"""Synchronizer: plan + execute against Confluence."""

from __future__ import annotations

import logging

from docs_sync.config import AppConfig
from docs_sync.confluence import ConfluenceClient, ConfluencePage
from docs_sync.links import count_unresolved_confluence_hrefs, is_blank_storage, is_empty_storage, resolve_confluence_hrefs
from docs_sync.mapper import ConfluenceMapper
from docs_sync.models import (
    SyncAction,
    SyncError,
    SyncPlan,
    SyncPlanItem,
    SyncResult,
    DocumentationTree,
    ConfluencePageMapping,
)
from docs_sync.state import SyncState, load_state, resolve_state_path, save_state

logger = logging.getLogger(__name__)


class Synchronizer:
    def __init__(
        self,
        config: AppConfig,
        client: ConfluenceClient,
        mapper: ConfluenceMapper | None = None,
    ) -> None:
        self.config = config
        self.client = client
        self.mapper = mapper or ConfluenceMapper(config)
        self.state_path = resolve_state_path(
            config.config_path, config.sync.state_file
        )
        self.state = load_state(self.state_path)
        self.state.space = config.confluence.space
        self.state.root_page_id = config.confluence.root_page_id

    def build_plan(
        self,
        tree: DocumentationTree,
        *,
        force: bool = False,
    ) -> SyncPlan:
        space = self.config.confluence.space
        plan = SyncPlan()
        mappings = self.mapper.map_tree(tree, page_ids=dict(self.state.pages))
        # Never run space-wide warm_managed_index here — it loads properties for
        # every managed page in the space (hundreds of API calls). Local state
        # file + per-page get_page is enough for scoped sync.

        for mapping in mappings:
            if is_blank_storage(mapping.body_storage):
                plan.warnings.append(
                    f"Thin/blank generated body for {mapping.source_path}; "
                    "will still sync — verify Markdown source"
                )

            # Fresh publish or scoped subtree with new stable_ids: skip remote lookup.
            in_state = mapping.stable_id in self.state.pages
            if not self.state.pages or not in_state:
                self._append_create_plan_item(plan, mapping, space)
                continue

            page_id = self.state.pages[mapping.stable_id]
            previous_hash = self.state.content_hashes.get(mapping.stable_id)

            # Fast offline plan: compare to last successful sync hash in state.
            if not force and previous_hash == mapping.content_hash:
                plan.items.append(
                    SyncPlanItem(
                        action=SyncAction.UNCHANGED,
                        mapping=mapping,
                        confluence_page_id=page_id,
                    )
                )
                continue

            if not self.config.sync.update_existing and not force:
                plan.items.append(
                    SyncPlanItem(
                        action=SyncAction.SKIPPED,
                        mapping=mapping,
                        message="update_existing=false",
                        confluence_page_id=page_id,
                    )
                )
                continue

            plan.items.append(
                SyncPlanItem(
                    action=SyncAction.UPDATE,
                    mapping=mapping,
                    confluence_page_id=page_id,
                )
            )

        if self.config.sync.archive_removed:
            plan.warnings.append(
                "archive_removed is enabled but orphan detection is limited in v0.1"
            )
        return plan

    def _append_create_plan_item(
        self,
        plan: SyncPlan,
        mapping: ConfluencePageMapping,
        space: str,
    ) -> None:
        """Plan CREATE with title-conflict checks (no space-wide index warm)."""
        conflicts = self.client.find_pages_by_title(space, mapping.title)
        unmanaged = [p for p in conflicts if not p.is_managed]
        if unmanaged:
            plan.warnings.append(
                f"Potential conflicting unmanaged page titled {mapping.title!r} "
                f"for {mapping.source_path}; manual review required"
            )
            plan.items.append(
                SyncPlanItem(
                    action=SyncAction.WARNING,
                    mapping=mapping,
                    message="Conflicting unmanaged page — skipped",
                    confluence_page_id=unmanaged[0].page_id,
                )
            )
            return
        foreign_managed = [
            p
            for p in conflicts
            if p.is_managed and p.stable_id != mapping.stable_id
        ]
        if foreign_managed:
            plan.warnings.append(
                f"Title {mapping.title!r} already used by managed page "
                f"{foreign_managed[0].stable_id!r}; skipping {mapping.source_path}"
            )
            plan.items.append(
                SyncPlanItem(
                    action=SyncAction.WARNING,
                    mapping=mapping,
                    message="Conflicting managed page title — skipped",
                    confluence_page_id=foreign_managed[0].page_id,
                )
            )
            return
        if not self.config.sync.create_missing:
            plan.items.append(
                SyncPlanItem(
                    action=SyncAction.SKIPPED,
                    mapping=mapping,
                    message="create_missing=false",
                )
            )
            return
        plan.items.append(SyncPlanItem(action=SyncAction.CREATE, mapping=mapping))

    def execute_plan(
        self,
        plan: SyncPlan,
        *,
        dry_run: bool | None = None,
        relink: bool = True,
        tree: DocumentationTree | None = None,
    ) -> SyncResult:
        dry = self.config.sync.dry_run if dry_run is None else dry_run
        result = SyncResult(
            dry_run=dry,
            repository=self.config.project.repository_url,
            warnings=list(plan.warnings),
        )
        known_ids: dict[str, str] = dict(self.state.pages)

        for item in plan.items:
            mapping = item.mapping
            try:
                if item.action == SyncAction.CREATE:
                    if dry:
                        result.created += 1
                        logger.info("CREATE %s", mapping.title)
                        continue
                    parent_id = self._resolve_parent_id(mapping.parent_stable_id, known_ids)
                    body = self._body_with_links(mapping.body_storage, known_ids)
                    page = self.client.create_page(
                        title=mapping.title,
                        space_key=self.config.confluence.space,
                        body_storage=body,
                        parent_id=parent_id,
                        labels=mapping.labels,
                        properties=mapping.properties,
                    )
                    known_ids[mapping.stable_id] = page.page_id
                    self.state.remember(
                        stable_id=mapping.stable_id,
                        page_id=page.page_id,
                        content_hash=mapping.content_hash,
                    )
                    result.created += 1
                    logger.info("Created page: %s", mapping.title)

                elif item.action == SyncAction.UPDATE:
                    if dry:
                        result.updated += 1
                        logger.info("UPDATE %s", mapping.title)
                        continue
                    assert item.confluence_page_id
                    current = self.client.get_page(item.confluence_page_id)
                    if not current:
                        raise RuntimeError(f"Missing page id {item.confluence_page_id}")
                    body = self._body_with_links(mapping.body_storage, known_ids)
                    page = self.client.update_page(
                        page_id=current.page_id,
                        title=mapping.title,
                        body_storage=body,
                        version=current.version,
                        labels=mapping.labels,
                        properties=mapping.properties,
                    )
                    known_ids[mapping.stable_id] = page.page_id
                    self.state.remember(
                        stable_id=mapping.stable_id,
                        page_id=page.page_id,
                        content_hash=mapping.content_hash,
                    )
                    result.updated += 1
                    logger.info("Updated page: %s", mapping.title)

                elif item.action == SyncAction.UNCHANGED:
                    result.unchanged += 1
                    if item.confluence_page_id:
                        known_ids[mapping.stable_id] = item.confluence_page_id
                        self.state.remember(
                            stable_id=mapping.stable_id,
                            page_id=item.confluence_page_id,
                            content_hash=mapping.content_hash,
                        )
                    logger.info("Unchanged page: %s", mapping.title)

                elif item.action in {SyncAction.SKIPPED, SyncAction.WARNING}:
                    result.skipped += 1
                    logger.warning("%s %s — %s", item.action.value, mapping.title, item.message)

                else:
                    result.skipped += 1

            except Exception as exc:  # noqa: BLE001 — record and continue
                result.failed += 1
                msg = str(exc)
                result.errors.append(SyncError(path=mapping.source_path, message=msg))
                logger.error("Failed to sync %s: %s", mapping.source_path, msg)

        if relink and tree is not None and not dry:
            relinked = self.relink_pages(tree, known_ids=known_ids)
            if relinked:
                result.updated += relinked
                logger.info("Relinked %s pages with resolved Confluence URLs", relinked)

        if not dry:
            save_state(self.state_path, self.state)
            if self.state_path:
                logger.info(
                    "Wrote sync state to %s (%s pages)",
                    self.state_path,
                    len(self.state.pages),
                )

        return result

    def relink_pages(
        self,
        tree: DocumentationTree,
        *,
        known_ids: dict[str, str] | None = None,
    ) -> int:
        """Rewrite confluence:// placeholders to real URLs and update pages that need it."""
        id_map = dict(self.state.pages)
        if known_ids:
            id_map.update(known_ids)
        if not id_map or not self.config.confluence.url:
            return 0

        updated = 0
        mappings = self.mapper.map_tree(tree, page_ids=id_map)
        for mapping in mappings:
            page_id = id_map.get(mapping.stable_id)
            if not page_id:
                continue
            body, unresolved = resolve_confluence_hrefs(
                mapping.body_storage,
                stable_id_to_page_id=id_map,
                base_url=self.config.confluence.url,
                space_key=self.config.confluence.space,
            )
            if unresolved and count_unresolved_confluence_hrefs(body):
                # still has placeholders — skip until targets exist
                continue
            current = self.client.get_page(page_id)
            if not current:
                continue
            remote = current.body_storage or ""
            if remote == body:
                continue
            if (
                count_unresolved_confluence_hrefs(remote) == 0
                and not is_empty_storage(remote)
                and remote.strip() == body.strip()
            ):
                continue
            self.client.update_page(
                page_id=current.page_id,
                title=mapping.title,
                body_storage=body,
                version=current.version,
                labels=mapping.labels,
                properties=mapping.properties,
            )
            self.state.remember(
                stable_id=mapping.stable_id,
                page_id=current.page_id,
                content_hash=mapping.content_hash,
            )
            updated += 1
            logger.info("Relinked page: %s", mapping.title)
        return updated

    def flush_managed_pages(
        self,
        *,
        dry_run: bool = True,
        hard_delete: bool = True,
    ) -> tuple[int, list[str]]:
        """
        Remove managed pages under confluence.root_page_id (and state entries).

        Returns (count, page_ids).
        """
        root_id = self.config.confluence.root_page_id
        if not root_id:
            raise ValueError("confluence.root_page_id is required for flush")

        candidate_ids = self.client.list_descendant_page_ids(root_id)
        state_ids = list(self.state.pages.values())
        ordered: list[str] = []
        seen: set[str] = set()
        for page_id in list(reversed(state_ids)) + candidate_ids:
            if page_id in seen or page_id == root_id:
                continue
            seen.add(page_id)
            ordered.append(page_id)

        deleted: list[str] = []
        for page_id in ordered:
            page = self.client.get_page(page_id)
            if page is None:
                continue
            if page.properties and page.properties.get("managed_by") != self.config.sync.managed_by:
                # only flush docs-sync managed pages
                if page.stable_id and page.stable_id not in self.state.pages:
                    continue
            logger.info(
                "%s page %s (%s)",
                "Would delete" if dry_run else "Deleting",
                page_id,
                page.title,
            )
            if not dry_run:
                if hard_delete:
                    self.client.delete_page(page_id)
                else:
                    self.client.archive_page(page_id)
            deleted.append(page_id)

        if not dry_run:
            self.state = SyncState(
                space=self.config.confluence.space,
                root_page_id=self.config.confluence.root_page_id,
            )
            save_state(self.state_path, self.state)
            logger.info("Cleared local sync state at %s", self.state_path)

        return len(deleted), deleted

    def _body_with_links(self, body: str, known_ids: dict[str, str]) -> str:
        if not self.config.confluence.url or not known_ids:
            return body
        resolved, _ = resolve_confluence_hrefs(
            body,
            stable_id_to_page_id=known_ids,
            base_url=self.config.confluence.url,
            space_key=self.config.confluence.space,
        )
        return resolved

    def _resolve_existing(self, stable_id: str, title: str) -> ConfluencePage | None:
        existing = self.client.get_page_by_stable_id(stable_id)
        if existing is not None:
            return existing

        page_id = self.state.get_page_id(stable_id)
        if page_id:
            page = self.client.get_page(page_id)
            if page and page.stable_id == stable_id:
                cache = getattr(self.client, "_stable_id_cache", None)
                if isinstance(cache, dict):
                    cache[stable_id] = page
                return page

        for candidate in self.client.find_pages_by_title(
            self.config.confluence.space, title
        ):
            if candidate.stable_id == stable_id:
                self.state.remember(
                    stable_id=stable_id,
                    page_id=candidate.page_id,
                    content_hash=candidate.content_hash,
                )
                return candidate
        return None

    def _resolve_parent_id(
        self, parent_stable_id: str | None, known_ids: dict[str, str]
    ) -> str | None:
        if parent_stable_id:
            parent_id = known_ids.get(parent_stable_id) or self.state.get_page_id(
                parent_stable_id
            )
            if parent_id is None:
                parent_page = self.client.get_page_by_stable_id(parent_stable_id)
                parent_id = parent_page.page_id if parent_page else None
            if parent_id:
                return parent_id
        return self.config.confluence.root_page_id
