"""Title-based Confluence cleanup (junk pages / accidental sync dumps)."""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Literal

from docs_sync.confluence import ConfluenceChild, ConfluenceClient

logger = logging.getLogger(__name__)

MatchMode = Literal["exact", "prefix", "contains"]


def _title_matches(candidate: str, needle: str, match: MatchMode | str) -> bool:
    mode = (match or "prefix").lower()
    if mode == "exact":
        return candidate == needle
    if mode == "contains":
        return needle in candidate
    return candidate.startswith(needle)


@dataclass
class CleanupCandidate:
    page_id: str
    title: str
    content_type: str
    depth: int
    source: str  # tree | search


@dataclass
class CleanupReport:
    candidates: list[CleanupCandidate] = field(default_factory=list)
    deleted_ids: list[str] = field(default_factory=list)
    skipped_ids: list[str] = field(default_factory=list)
    failed_ids: list[str] = field(default_factory=list)
    dry_run: bool = True
    protected_ids: set[str] = field(default_factory=set)

    @property
    def matched(self) -> int:
        return len(self.candidates)


def collect_title_matches(
    client: ConfluenceClient,
    *,
    space_key: str,
    title: str,
    match: MatchMode = "prefix",
    from_parent_id: str | None = None,
    include_folders: bool = True,
    protected_ids: set[str] | None = None,
    walk_tree: bool = True,
    use_search: bool = True,
) -> list[CleanupCandidate]:
    """
    Find pages/folders whose titles match ``title`` under ``match`` mode.

    Discovery combines:
    - BFS from space homepage (or ``from_parent_id``)
    - CQL/title search for orphans not reachable from the tree walk
    """
    protected = set(protected_ids or ())
    by_id: dict[str, CleanupCandidate] = {}

    roots: list[str] = []
    if from_parent_id:
        roots.append(from_parent_id)
    elif walk_tree:
        home = client.get_space_homepage_id(space_key)
        if home:
            roots.append(home)
            protected.add(home)

    if walk_tree and roots:
        for root_id in roots:
            _walk_matching_subtree(
                client,
                root_id=root_id,
                title=title,
                match=match,
                include_folders=include_folders,
                protected=protected,
                into=by_id,
            )

    if use_search:
        start = 0
        while True:
            batch = client.search_by_title(
                space_key=space_key,
                title=title,
                match=match,
                include_folders=include_folders,
                limit=50,
                start=start,
            )
            if not batch:
                break
            for child in batch:
                _maybe_add_candidate(
                    by_id,
                    child,
                    depth=len(child.ancestor_ids),
                    source="search",
                    protected=protected,
                    title=title,
                    match=match,
                    include_folders=include_folders,
                )
            if len(batch) < 50:
                break
            start += len(batch)
            if start > 10_000:
                logger.warning("Title search pagination capped at 10000 results")
                break

    candidates = list(by_id.values())
    candidates.sort(key=lambda c: (c.depth, c.title, c.page_id), reverse=True)
    return candidates


def run_cleanup(
    client: ConfluenceClient,
    *,
    space_key: str,
    title: str,
    match: MatchMode = "prefix",
    from_parent_id: str | None = None,
    include_folders: bool = True,
    protected_ids: set[str] | None = None,
    dry_run: bool = True,
    max_retries: int = 5,
    pause_seconds: float = 0.2,
) -> CleanupReport:
    """Collect matching content and optionally delete it (trash)."""
    protected = set(protected_ids or ())
    candidates = collect_title_matches(
        client,
        space_key=space_key,
        title=title,
        match=match,
        from_parent_id=from_parent_id,
        include_folders=include_folders,
        protected_ids=protected,
    )
    report = CleanupReport(
        candidates=candidates,
        dry_run=dry_run,
        protected_ids=protected,
    )
    if dry_run:
        for item in candidates:
            logger.info(
                "Would delete %s %s (%s) depth=%s source=%s",
                item.content_type,
                item.page_id,
                item.title,
                item.depth,
                item.source,
            )
        return report

    for item in candidates:
        if item.page_id in protected:
            report.skipped_ids.append(item.page_id)
            continue
        ok = _delete_with_retry(
            client,
            item.page_id,
            max_retries=max_retries,
            pause_seconds=pause_seconds,
        )
        if ok:
            report.deleted_ids.append(item.page_id)
            logger.info(
                "Deleted %s %s (%s)",
                item.content_type,
                item.page_id,
                item.title,
            )
        else:
            report.failed_ids.append(item.page_id)
            logger.error("Failed to delete %s (%s)", item.page_id, item.title)
    return report


def format_cleanup_report(report: CleanupReport) -> str:
    lines = [
        f"matched={report.matched}",
        f"dry_run={report.dry_run}",
        f"deleted={len(report.deleted_ids)}",
        f"skipped={len(report.skipped_ids)}",
        f"failed={len(report.failed_ids)}",
        f"protected={len(report.protected_ids)}",
        "",
        "Candidates (deepest first):",
    ]
    for item in report.candidates:
        lines.append(
            f"  [{item.content_type}] id={item.page_id} depth={item.depth} "
            f"source={item.source} title={item.title!r}"
        )
    if report.failed_ids:
        lines.append("")
        lines.append("Failed ids:")
        for page_id in report.failed_ids:
            lines.append(f"  {page_id}")
    return "\n".join(lines) + "\n"


def _walk_matching_subtree(
    client: ConfluenceClient,
    *,
    root_id: str,
    title: str,
    match: MatchMode,
    include_folders: bool,
    protected: set[str],
    into: dict[str, CleanupCandidate],
) -> None:
    """
    BFS from root. Matching nodes are candidates; we still walk into matching
    parents so nested junk is collected. Non-matching branches are not walked
    (keeps Documentação Inicial / other trees untouched).
    """
    queue: list[tuple[str, int]] = [(root_id, 0)]
    seen: set[str] = {root_id}
    while queue:
        parent_id, depth = queue.pop(0)
        for child in client.list_child_nodes(parent_id):
            if child.page_id in seen:
                continue
            seen.add(child.page_id)
            child_depth = depth + 1
            matches = _title_matches(child.title, title, match)
            if matches:
                _maybe_add_candidate(
                    into,
                    child,
                    depth=child_depth,
                    source="tree",
                    protected=protected,
                    title=title,
                    match=match,
                    include_folders=include_folders,
                )
                queue.append((child.page_id, child_depth))
            # non-matching: do not descend (avoid wiping legitimate trees)


def _maybe_add_candidate(
    into: dict[str, CleanupCandidate],
    child: ConfluenceChild,
    *,
    depth: int,
    source: str,
    protected: set[str],
    title: str,
    match: MatchMode,
    include_folders: bool,
) -> None:
    if child.page_id in protected:
        return
    if child.content_type == "folder" and not include_folders:
        return
    if not _title_matches(child.title, title, match):
        return
    existing = into.get(child.page_id)
    if existing is None or depth > existing.depth:
        into[child.page_id] = CleanupCandidate(
            page_id=child.page_id,
            title=child.title,
            content_type=child.content_type,
            depth=depth,
            source=source if existing is None else existing.source,
        )


def _delete_with_retry(
    client: ConfluenceClient,
    page_id: str,
    *,
    max_retries: int,
    pause_seconds: float,
) -> bool:
    delay = pause_seconds
    for attempt in range(1, max_retries + 1):
        try:
            client.delete_page(page_id)
            if pause_seconds:
                time.sleep(pause_seconds)
            return True
        except Exception as exc:  # noqa: BLE001
            # httpx.HTTPStatusError for 429/5xx etc.
            status = getattr(getattr(exc, "response", None), "status_code", None)
            if status == 404:
                return True
            if attempt >= max_retries:
                logger.error(
                    "Delete failed for %s after %s attempts: %s",
                    page_id,
                    attempt,
                    exc,
                )
                return False
            logger.warning(
                "Delete retry %s/%s for %s status=%s",
                attempt,
                max_retries,
                page_id,
                status,
            )
            time.sleep(delay)
            delay = min(delay * 2, 8.0)
    return False
