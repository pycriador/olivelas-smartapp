"""Confluence API abstraction and implementations."""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

import httpx

logger = logging.getLogger(__name__)

MANAGED_PROPERTY_KEY = "docs-sync"


def _cql_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def _title_matches(candidate: str, needle: str, match: str) -> bool:
    mode = (match or "prefix").lower()
    if mode == "exact":
        return candidate == needle
    if mode == "contains":
        return needle in candidate
    # prefix (default)
    return candidate.startswith(needle)


def _ssl_verify(verify_ssl: bool = True):
    """Use OS trust store when available (corporate SSL inspection)."""
    if not verify_ssl:
        return False
    try:
        import ssl

        import truststore

        return truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    except Exception:  # noqa: BLE001
        return True


@dataclass
class ConfluencePage:
    page_id: str
    title: str
    space_key: str
    version: int
    parent_id: str | None = None
    body_storage: str = ""
    properties: dict[str, str] = field(default_factory=dict)
    labels: list[str] = field(default_factory=list)
    content_type: str = "page"  # page | folder
    ancestor_ids: list[str] = field(default_factory=list)

    @property
    def is_managed(self) -> bool:
        return self.properties.get("managed_by") == "docs-sync" or bool(
            self.properties.get("stable_id")
        )

    @property
    def stable_id(self) -> str | None:
        return self.properties.get("stable_id") or None

    @property
    def content_hash(self) -> str | None:
        return self.properties.get("content_hash") or None


@dataclass
class ConfluenceChild:
    """Lightweight child node used by tree walks / cleanup."""

    page_id: str
    title: str
    content_type: str  # page | folder
    parent_id: str | None = None
    ancestor_ids: list[str] = field(default_factory=list)


class ConfluenceClient(ABC):
    def warm_managed_index(
        self, space_key: str, parent_id: str | None = None
    ) -> int:
        """Optional preload of managed pages for a space. Returns indexed count."""
        return 0

    @abstractmethod
    def get_page_by_stable_id(self, stable_id: str) -> ConfluencePage | None:
        raise NotImplementedError

    @abstractmethod
    def get_page(self, page_id: str) -> ConfluencePage | None:
        raise NotImplementedError

    @abstractmethod
    def create_page(
        self,
        *,
        title: str,
        space_key: str,
        body_storage: str,
        parent_id: str | None,
        labels: list[str],
        properties: dict[str, str],
    ) -> ConfluencePage:
        raise NotImplementedError

    @abstractmethod
    def update_page(
        self,
        *,
        page_id: str,
        title: str,
        body_storage: str,
        version: int,
        labels: list[str],
        properties: dict[str, str],
    ) -> ConfluencePage:
        raise NotImplementedError

    @abstractmethod
    def move_page(self, page_id: str, parent_id: str) -> None:
        raise NotImplementedError

    @abstractmethod
    def archive_page(self, page_id: str) -> None:
        raise NotImplementedError

    def delete_page(self, page_id: str) -> None:
        """Permanently delete (trash) a page. Default: archive soft-label only."""
        self.archive_page(page_id)

    def list_descendant_page_ids(self, parent_id: str) -> list[str]:
        """Return descendant page ids under a parent page/folder (best-effort)."""
        return []

    def get_space_homepage_id(self, space_key: str) -> str | None:
        """Return the space homepage content id, if available."""
        return None

    def list_child_nodes(self, parent_id: str) -> list[ConfluenceChild]:
        """List direct page/folder children with titles (best-effort)."""
        return []

    def search_by_title(
        self,
        *,
        space_key: str,
        title: str,
        match: str = "prefix",
        include_folders: bool = True,
        limit: int = 50,
        start: int = 0,
    ) -> list[ConfluenceChild]:
        """
        Search pages/folders by title.

        match: ``exact`` | ``prefix`` | ``contains``
        """
        return []

    @abstractmethod
    def find_pages_by_title(self, space_key: str, title: str) -> list[ConfluencePage]:
        raise NotImplementedError


class ConfluenceCloudClient(ConfluenceClient):
    """
    Confluence Cloud REST API v2 / content properties.

    Premise: Cloud REST under `{url}/wiki/rest/api` for classic content endpoints
    and content properties for stable identity. Data Center/Server should use a
    separate adapter — select via config `confluence.api_profile`.
    """

    def __init__(
        self,
        *,
        base_url: str,
        username: str,
        api_token: str,
        timeout: float = 30.0,
        verify_ssl: bool = True,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self._client = httpx.Client(
            base_url=f"{self.base_url}/wiki/rest/api",
            auth=(username, api_token),
            timeout=timeout,
            headers={"Accept": "application/json"},
            verify=_ssl_verify(verify_ssl),
        )
        self._v2 = httpx.Client(
            base_url=f"{self.base_url}/wiki/api/v2",
            auth=(username, api_token),
            timeout=timeout,
            headers={"Accept": "application/json"},
            verify=_ssl_verify(verify_ssl),
        )
        self._stable_id_cache: dict[str, ConfluencePage] = {}
        self._index_warmed_spaces: set[str] = set()

    def close(self) -> None:
        self._client.close()
        self._v2.close()

    def warm_managed_index(
        self, space_key: str, parent_id: str | None = None
    ) -> int:
        """Load managed pages via label search (best-effort; prefer local state file)."""
        key = (space_key or "").strip()
        cache_key = f"{key}|labels"
        if cache_key in self._index_warmed_spaces:
            return len(self._stable_id_cache)

        if key:
            start = 0
            limit = 50
            while True:
                response = self._client.get(
                    "/content/search",
                    params={
                        "cql": (
                            f'space = "{key}" AND label = "managed-by-docs-sync" '
                            "AND type = page"
                        ),
                        "limit": limit,
                        "start": start,
                        "expand": "version,metadata.labels",
                    },
                )
                if response.status_code >= 400:
                    logger.warning(
                        "Confluence index warm failed: status=%s body=%s",
                        response.status_code,
                        response.text[:300],
                    )
                    break
                results = response.json().get("results") or []
                for item in results:
                    page = self._hydrate(item)
                    props = self._load_properties(page.page_id)
                    page.properties = props
                    sid = props.get("stable_id")
                    if sid:
                        self._stable_id_cache[sid] = page
                if len(results) < limit:
                    break
                start += limit

        self._index_warmed_spaces.add(cache_key)
        logger.info(
            "Warmed managed page index for space %s (%s cache entries)",
            key or "-",
            len(self._stable_id_cache),
        )
        return len(self._stable_id_cache)

    def _index_under_parent(self, parent_id: str) -> int:
        """Walk folder/page children via REST v2 and cache managed properties."""
        indexed = 0
        queue = [parent_id]
        seen: set[str] = set()
        while queue:
            current = queue.pop(0)
            if current in seen:
                continue
            seen.add(current)
            children = self._list_direct_children(current)
            for child_id, child_type in children:
                if child_type == "folder":
                    queue.append(child_id)
                    continue
                if child_type != "page":
                    continue
                page = self._load_managed_stub(child_id)
                if page and page.stable_id:
                    self._stable_id_cache[page.stable_id] = page
                    indexed += 1
                queue.append(child_id)
        return indexed

    def _load_managed_stub(self, page_id: str) -> ConfluencePage | None:
        """Load id/title/version + docs-sync property without page body."""
        response = self._client.get(
            f"/content/{page_id}",
            params={"expand": "version,space"},
        )
        if response.status_code == 404:
            return None
        if response.status_code >= 400:
            return None
        page = self._hydrate(response.json())
        page.properties = self._load_properties(page_id)
        return page

    def _list_direct_children(self, parent_id: str) -> list[tuple[str, str]]:
        out: list[tuple[str, str]] = []
        for path in (
            f"/folders/{parent_id}/direct-children",
            f"/pages/{parent_id}/direct-children",
        ):
            cursor: str | None = None
            found_any = False
            while True:
                params: dict[str, Any] = {"limit": 50}
                if cursor:
                    params["cursor"] = cursor
                response = self._v2.get(path, params=params)
                if response.status_code == 404:
                    break
                if response.status_code >= 400:
                    logger.debug(
                        "Children list %s failed status=%s", path, response.status_code
                    )
                    break
                found_any = True
                payload = response.json()
                for item in payload.get("results") or []:
                    child_id = str(item.get("id") or "")
                    child_type = (item.get("type") or "").lower()
                    if child_id and child_type:
                        out.append((child_id, child_type))
                links = payload.get("_links") or {}
                next_link = links.get("next")
                cursor = None
                if next_link:
                    from urllib.parse import parse_qs, urlparse

                    parsed = urlparse(str(next_link))
                    values = parse_qs(parsed.query).get("cursor") or []
                    cursor = values[0] if values else None
                if not cursor:
                    break
            if found_any:
                break
        return out

    def get_page_by_stable_id(self, stable_id: str) -> ConfluencePage | None:
        cached = self._stable_id_cache.get(stable_id)
        if cached is not None:
            return cached
        # Without a warm index hit, avoid repeated full-space scans.
        return None

    def get_page(self, page_id: str) -> ConfluencePage | None:
        response = self._client.get(
            f"/content/{page_id}",
            params={"expand": "version,body.storage,ancestors,metadata.labels"},
        )
        if response.status_code == 404:
            return None
        response.raise_for_status()
        page = self._hydrate(response.json())
        page.properties = self._load_properties(page_id)
        return page

    def create_page(
        self,
        *,
        title: str,
        space_key: str,
        body_storage: str,
        parent_id: str | None,
        labels: list[str],
        properties: dict[str, str],
    ) -> ConfluencePage:
        payload: dict[str, Any] = {
            "type": "page",
            "title": title,
            "space": {"key": space_key},
            "body": {"storage": {"value": body_storage, "representation": "storage"}},
        }
        if parent_id:
            payload["ancestors"] = [{"id": parent_id}]
        response = self._client.post("/content", json=payload)
        response.raise_for_status()
        page = self._hydrate(response.json())
        self._set_labels(page.page_id, labels)
        self._set_properties(page.page_id, properties)
        page.properties = properties
        page.labels = labels
        stable = properties.get("stable_id")
        if stable:
            self._stable_id_cache[stable] = page
        return page

    def update_page(
        self,
        *,
        page_id: str,
        title: str,
        body_storage: str,
        version: int,
        labels: list[str],
        properties: dict[str, str],
    ) -> ConfluencePage:
        payload = {
            "id": page_id,
            "type": "page",
            "title": title,
            "version": {"number": version + 1},
            "body": {"storage": {"value": body_storage, "representation": "storage"}},
        }
        response = self._client.put(f"/content/{page_id}", json=payload)
        response.raise_for_status()
        page = self._hydrate(response.json())
        self._set_labels(page_id, labels)
        self._set_properties(page_id, properties)
        page.properties = properties
        page.labels = labels
        stable = properties.get("stable_id")
        if stable:
            self._stable_id_cache[stable] = page
        return page

    def move_page(self, page_id: str, parent_id: str) -> None:
        # Cloud move via update with ancestors
        current = self.get_page(page_id)
        if not current:
            raise ValueError(f"Page not found: {page_id}")
        payload = {
            "id": page_id,
            "type": "page",
            "title": current.title,
            "version": {"number": current.version + 1},
            "ancestors": [{"id": parent_id}],
            "body": {
                "storage": {
                    "value": current.body_storage,
                    "representation": "storage",
                }
            },
        }
        response = self._client.put(f"/content/{page_id}", json=payload)
        response.raise_for_status()

    def archive_page(self, page_id: str) -> None:
        # Soft archive: add label; hard delete intentionally not used by default
        self._set_labels(page_id, ["docs-sync-archived"])

    def delete_page(self, page_id: str) -> None:
        response = self._client.delete(f"/content/{page_id}")
        if response.status_code not in {204, 404}:
            response.raise_for_status()
        # drop from caches
        for sid, page in list(self._stable_id_cache.items()):
            if page.page_id == page_id:
                self._stable_id_cache.pop(sid, None)

    def get_space_homepage_id(self, space_key: str) -> str | None:
        response = self._client.get(f"/space/{space_key}", params={"expand": "homepage"})
        if response.status_code >= 400:
            return None
        homepage = response.json().get("homepage") or {}
        page_id = homepage.get("id")
        return str(page_id) if page_id else None

    def list_child_nodes(self, parent_id: str) -> list[ConfluenceChild]:
        """Prefer classic child API (includes titles for pages and folders)."""
        out: list[ConfluenceChild] = []
        for content_type in ("page", "folder"):
            start = 0
            while True:
                response = self._client.get(
                    f"/content/{parent_id}/child/{content_type}",
                    params={"limit": 100, "start": start},
                )
                if response.status_code >= 400:
                    break
                batch = response.json().get("results") or []
                if not batch:
                    break
                for item in batch:
                    child_id = str(item.get("id") or "")
                    if not child_id:
                        continue
                    out.append(
                        ConfluenceChild(
                            page_id=child_id,
                            title=item.get("title") or "",
                            content_type=content_type,
                            parent_id=parent_id,
                        )
                    )
                if len(batch) < 100:
                    break
                start += len(batch)
        if out:
            return out
        # Fallback to v2 ids without titles
        return [
            ConfluenceChild(
                page_id=child_id,
                title="",
                content_type=child_type,
                parent_id=parent_id,
            )
            for child_id, child_type in self._list_direct_children(parent_id)
        ]

    def search_by_title(
        self,
        *,
        space_key: str,
        title: str,
        match: str = "prefix",
        include_folders: bool = True,
        limit: int = 50,
        start: int = 0,
    ) -> list[ConfluenceChild]:
        mode = (match or "prefix").lower()
        if mode == "exact":
            cql = f'title = "{_cql_escape(title)}" AND space = "{space_key}"'
        else:
            # CQL ~ is fuzzy; callers filter exact prefix/contains locally.
            cql = f'title ~ "{_cql_escape(title)}" AND space = "{space_key}"'
        response = self._client.get(
            "/content/search",
            params={
                "cql": cql,
                "limit": limit,
                "start": start,
                "expand": "ancestors",
            },
        )
        if response.status_code >= 400:
            logger.warning(
                "Title search failed status=%s body=%s",
                response.status_code,
                response.text[:200],
            )
            return []
        results: list[ConfluenceChild] = []
        for item in response.json().get("results") or []:
            item_title = item.get("title") or ""
            content_type = (item.get("type") or "page").lower()
            if content_type == "folder" and not include_folders:
                continue
            if content_type not in {"page", "folder"}:
                continue
            if not _title_matches(item_title, title, mode):
                continue
            ancestors = item.get("ancestors") or []
            ancestor_ids = [str(a.get("id")) for a in ancestors if a.get("id")]
            parent_id = ancestor_ids[-1] if ancestor_ids else None
            results.append(
                ConfluenceChild(
                    page_id=str(item["id"]),
                    title=item_title,
                    content_type=content_type,
                    parent_id=parent_id,
                    ancestor_ids=ancestor_ids,
                )
            )
        return results

    def list_descendant_page_ids(self, parent_id: str) -> list[str]:
        """BFS over folder/page children; returns page ids deepest-last (parents after children)."""
        ordered: list[str] = []
        queue = [parent_id]
        seen: set[str] = set()
        while queue:
            current = queue.pop(0)
            if current in seen:
                continue
            seen.add(current)
            children = self._list_direct_children(current)
            child_pages: list[str] = []
            for child_id, child_type in children:
                if child_type == "folder":
                    queue.append(child_id)
                elif child_type == "page":
                    child_pages.append(child_id)
                    queue.append(child_id)
            # children first for safer delete order later (reverse at end)
            ordered.extend(child_pages)
        # deepest pages tend to appear later; reverse so children deleted before parents
        return list(reversed(ordered))

    def find_pages_by_title(self, space_key: str, title: str) -> list[ConfluencePage]:
        response = self._client.get(
            "/content",
            params={
                "spaceKey": space_key,
                "title": title,
                "type": "page",
                "expand": "version,body.storage",
            },
        )
        if response.status_code >= 400:
            return []
        pages: list[ConfluencePage] = []
        for item in response.json().get("results", []):
            page = self._hydrate(item)
            page.properties = self._load_properties(page.page_id)
            sid = page.properties.get("stable_id")
            if sid:
                self._stable_id_cache[sid] = page
            pages.append(page)
        return pages

    def _hydrate(self, item: dict[str, Any]) -> ConfluencePage:
        ancestors = item.get("ancestors") or []
        parent_id = str(ancestors[-1]["id"]) if ancestors else None
        ancestor_ids = [str(a["id"]) for a in ancestors if a.get("id")]
        labels = []
        for label in ((item.get("metadata") or {}).get("labels") or {}).get("results") or []:
            labels.append(label.get("name", ""))
        return ConfluencePage(
            page_id=str(item["id"]),
            title=item.get("title") or "",
            space_key=((item.get("space") or {}).get("key") or ""),
            version=int(((item.get("version") or {}).get("number") or 1)),
            parent_id=parent_id,
            body_storage=((item.get("body") or {}).get("storage") or {}).get("value") or "",
            labels=[x for x in labels if x],
            content_type=(item.get("type") or "page").lower(),
            ancestor_ids=ancestor_ids,
        )

    def _load_properties(self, page_id: str) -> dict[str, str]:
        response = self._client.get(f"/content/{page_id}/property/{MANAGED_PROPERTY_KEY}")
        if response.status_code == 404:
            return {}
        if response.status_code >= 400:
            logger.warning("Failed to load page properties for %s", page_id)
            return {}
        value = response.json().get("value") or {}
        if isinstance(value, dict):
            return {str(k): str(v) for k, v in value.items()}
        return {}

    def _set_properties(self, page_id: str, properties: dict[str, str]) -> None:
        # create or update content property
        existing = self._client.get(f"/content/{page_id}/property/{MANAGED_PROPERTY_KEY}")
        payload = {"key": MANAGED_PROPERTY_KEY, "value": properties}
        if existing.status_code == 404:
            response = self._client.post(f"/content/{page_id}/property", json=payload)
        else:
            version = int((existing.json().get("version") or {}).get("number") or 1)
            payload["version"] = {"number": version + 1}
            response = self._client.put(
                f"/content/{page_id}/property/{MANAGED_PROPERTY_KEY}",
                json=payload,
            )
        if response.status_code >= 400:
            logger.error("Failed to set page properties for %s status=%s", page_id, response.status_code)

    def _set_labels(self, page_id: str, labels: list[str]) -> None:
        payload = [{"prefix": "global", "name": label} for label in labels if label]
        if not payload:
            return
        response = self._client.post(f"/content/{page_id}/label", json=payload)
        if response.status_code < 400:
            return
        logger.warning(
            "Batch label set failed for %s status=%s body=%s; retrying one-by-one",
            page_id,
            response.status_code,
            response.text[:300],
        )
        for item in payload:
            single = self._client.post(f"/content/{page_id}/label", json=[item])
            if single.status_code >= 400:
                logger.warning(
                    "Failed to set label %r on %s status=%s body=%s",
                    item.get("name"),
                    page_id,
                    single.status_code,
                    single.text[:200],
                )


class FakeConfluenceClient(ConfluenceClient):
    """In-memory Confluence for unit/integration tests."""

    def __init__(self) -> None:
        self.pages: dict[str, ConfluencePage] = {}
        self.by_stable_id: dict[str, str] = {}
        self._seq = 1000
        self.create_calls = 0
        self.update_calls = 0
        self.homepage_id: str | None = None
        self.delete_calls: list[str] = []

    def warm_managed_index(
        self, space_key: str, parent_id: str | None = None
    ) -> int:
        return len(self.by_stable_id)

    def get_page_by_stable_id(self, stable_id: str) -> ConfluencePage | None:
        page_id = self.by_stable_id.get(stable_id)
        if not page_id:
            return None
        return self.pages.get(page_id)

    def get_page(self, page_id: str) -> ConfluencePage | None:
        return self.pages.get(page_id)

    def create_page(
        self,
        *,
        title: str,
        space_key: str,
        body_storage: str,
        parent_id: str | None,
        labels: list[str],
        properties: dict[str, str],
        content_type: str = "page",
    ) -> ConfluencePage:
        self.create_calls += 1
        self._seq += 1
        page_id = str(self._seq)
        page = ConfluencePage(
            page_id=page_id,
            title=title,
            space_key=space_key,
            version=1,
            parent_id=parent_id,
            body_storage=body_storage,
            properties=dict(properties),
            labels=list(labels),
            content_type=content_type,
            ancestor_ids=self._ancestor_ids(parent_id),
        )
        self.pages[page_id] = page
        stable = properties.get("stable_id")
        if stable:
            self.by_stable_id[stable] = page_id
        return page

    def update_page(
        self,
        *,
        page_id: str,
        title: str,
        body_storage: str,
        version: int,
        labels: list[str],
        properties: dict[str, str],
    ) -> ConfluencePage:
        self.update_calls += 1
        page = self.pages[page_id]
        page.title = title
        page.body_storage = body_storage
        page.version = version + 1
        page.labels = list(labels)
        page.properties = dict(properties)
        stable = properties.get("stable_id")
        if stable:
            self.by_stable_id[stable] = page_id
        return page

    def move_page(self, page_id: str, parent_id: str) -> None:
        page = self.pages[page_id]
        page.parent_id = parent_id
        page.ancestor_ids = self._ancestor_ids(parent_id)

    def archive_page(self, page_id: str) -> None:
        labels = set(self.pages[page_id].labels)
        labels.add("docs-sync-archived")
        self.pages[page_id].labels = sorted(labels)

    def delete_page(self, page_id: str) -> None:
        self.delete_calls.append(page_id)
        page = self.pages.pop(page_id, None)
        if not page:
            return
        for sid, pid in list(self.by_stable_id.items()):
            if pid == page_id:
                self.by_stable_id.pop(sid, None)

    def get_space_homepage_id(self, space_key: str) -> str | None:
        return self.homepage_id

    def list_child_nodes(self, parent_id: str) -> list[ConfluenceChild]:
        out: list[ConfluenceChild] = []
        for page in self.pages.values():
            if page.parent_id != parent_id:
                continue
            out.append(
                ConfluenceChild(
                    page_id=page.page_id,
                    title=page.title,
                    content_type=page.content_type or "page",
                    parent_id=parent_id,
                    ancestor_ids=list(page.ancestor_ids),
                )
            )
        return out

    def search_by_title(
        self,
        *,
        space_key: str,
        title: str,
        match: str = "prefix",
        include_folders: bool = True,
        limit: int = 50,
        start: int = 0,
    ) -> list[ConfluenceChild]:
        matches: list[ConfluenceChild] = []
        for page in self.pages.values():
            if page.space_key != space_key:
                continue
            if (page.content_type or "page") == "folder" and not include_folders:
                continue
            if not _title_matches(page.title, title, match):
                continue
            matches.append(
                ConfluenceChild(
                    page_id=page.page_id,
                    title=page.title,
                    content_type=page.content_type or "page",
                    parent_id=page.parent_id,
                    ancestor_ids=list(page.ancestor_ids),
                )
            )
        return matches[start : start + limit]

    def list_descendant_page_ids(self, parent_id: str) -> list[str]:
        # Fake: any page whose parent chain reaches parent_id
        out: list[str] = []
        for page in self.pages.values():
            if (page.content_type or "page") != "page":
                continue
            cur = page.parent_id
            while cur:
                if cur == parent_id:
                    out.append(page.page_id)
                    break
                parent = self.pages.get(cur)
                cur = parent.parent_id if parent else None
        return list(reversed(out))

    def find_pages_by_title(self, space_key: str, title: str) -> list[ConfluencePage]:
        return [
            p
            for p in self.pages.values()
            if p.space_key == space_key and p.title == title
        ]

    def _ancestor_ids(self, parent_id: str | None) -> list[str]:
        if not parent_id:
            return []
        chain: list[str] = []
        cur: str | None = parent_id
        seen: set[str] = set()
        while cur and cur not in seen:
            seen.add(cur)
            chain.append(cur)
            parent = self.pages.get(cur)
            cur = parent.parent_id if parent else None
        return list(reversed(chain))


class ConfluenceDataCenterClient(ConfluenceCloudClient):
    """
    Confluence Data Center / Server adapter.

    Premise: classic REST under `{url}/rest/api` (no `/wiki` prefix).
    Auth still uses username + token/password via Basic auth — confirm against
    your instance (personal access tokens vary by version).
    """

    def __init__(
        self,
        *,
        base_url: str,
        username: str,
        api_token: str,
        timeout: float = 30.0,
        verify_ssl: bool = True,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        verify = _ssl_verify(verify_ssl)
        self._client = httpx.Client(
            base_url=f"{self.base_url}/rest/api",
            auth=(username, api_token),
            timeout=timeout,
            headers={"Accept": "application/json"},
            verify=verify,
        )
        # DC has no /api/v2 folder tree; reuse classic API base as a no-op-friendly client
        self._v2 = httpx.Client(
            base_url=f"{self.base_url}/rest/api",
            auth=(username, api_token),
            timeout=timeout,
            headers={"Accept": "application/json"},
            verify=verify,
        )
        self._stable_id_cache: dict[str, ConfluencePage] = {}
        self._index_warmed_spaces: set[str] = set()


def build_confluence_client(
    *,
    api_profile: str,
    url: str,
    username: str,
    api_token: str,
    verify_ssl: bool = True,
) -> ConfluenceClient:
    profile = (api_profile or "cloud").lower()
    if profile in {"cloud", "confluence-cloud"}:
        return ConfluenceCloudClient(
            base_url=url,
            username=username,
            api_token=api_token,
            verify_ssl=verify_ssl,
        )
    if profile in {"datacenter", "server", "data-center"}:
        return ConfluenceDataCenterClient(
            base_url=url,
            username=username,
            api_token=api_token,
            verify_ssl=verify_ssl,
        )
    raise ValueError(f"Unsupported confluence.api_profile: {api_profile}")
