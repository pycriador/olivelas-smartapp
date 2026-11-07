"""Compare local documentation to the last successful sync state (offline)."""

from __future__ import annotations

import subprocess
from dataclasses import dataclass, field
from pathlib import Path

from docs_sync.config import AppConfig
from docs_sync.mapper import ConfluenceMapper
from docs_sync.models import DocumentationTree
from docs_sync.state import SyncState, load_state, resolve_state_path


@dataclass
class ChangeItem:
    path: str
    stable_id: str
    status: str  # NEW | CHANGED | UNCHANGED | REMOVED
    title: str = ""


@dataclass
class ChangeReport:
    items: list[ChangeItem] = field(default_factory=list)
    git_paths: list[str] = field(default_factory=list)
    git_since: str | None = None
    state_path: str | None = None
    warnings: list[str] = field(default_factory=list)

    def actionable(self) -> list[ChangeItem]:
        return [i for i in self.items if i.status in {"NEW", "CHANGED", "REMOVED"}]

    def counts(self) -> dict[str, int]:
        out: dict[str, int] = {}
        for item in self.items:
            out[item.status] = out.get(item.status, 0) + 1
        return out


def build_local_change_report(
    config: AppConfig,
    tree: DocumentationTree,
    *,
    since: str | None = None,
) -> ChangeReport:
    """
    Offline view of what likely needs Confluence sync.

    Compares current Markdown content hashes to the local state file written
    after the last successful sync. This does not call Confluence — use
    `docs-sync plan --changes-only` for the authoritative remote plan.
    """
    state_path = resolve_state_path(config.config_path, config.sync.state_file)
    state = load_state(state_path)
    report = ChangeReport(
        state_path=str(state_path) if state_path else None,
        git_since=since,
    )
    if state_path is None or not state_path.is_file():
        report.warnings.append(
            "No local sync state file found. Run a successful `docs-sync sync` once, "
            "or use `docs-sync plan --changes-only` against Confluence."
        )

    mappings = ConfluenceMapper(config).map_tree(tree)
    seen_ids: set[str] = set()
    for mapping in mappings:
        seen_ids.add(mapping.stable_id)
        previous = state.content_hashes.get(mapping.stable_id)
        page_id = state.pages.get(mapping.stable_id)
        if not page_id and previous is None:
            status = "NEW"
        elif previous == mapping.content_hash:
            status = "UNCHANGED"
        else:
            status = "CHANGED"
        report.items.append(
            ChangeItem(
                path=mapping.source_path,
                stable_id=mapping.stable_id,
                status=status,
                title=mapping.title,
            )
        )

    for stable_id, page_id in state.pages.items():
        if stable_id in seen_ids:
            continue
        report.items.append(
            ChangeItem(
                path=f"(removed locally; page_id={page_id})",
                stable_id=stable_id,
                status="REMOVED",
            )
        )

    if since:
        report.git_paths = list_git_changed_markdown(config, since)
        if not report.git_paths:
            report.warnings.append(
                f"No Markdown changes under documentation roots since {since!r} "
                "(or git history unavailable)."
            )
    return report


def list_git_changed_markdown(config: AppConfig, since: str) -> list[str]:
    """Return Markdown paths changed in git since a ref, scoped to docs roots."""
    roots = config.docs_roots
    repo = _git_toplevel(roots[0] if roots else Path.cwd())
    if repo is None:
        return []
    changed: list[str] = []
    for root in roots:
        try:
            rel = root.resolve().relative_to(repo.resolve()).as_posix()
        except ValueError:
            rel = str(root)
        result = subprocess.run(
            [
                "git",
                "-C",
                str(repo),
                "diff",
                "--name-only",
                "--diff-filter=ACMR",
                f"{since}...HEAD",
                "--",
                rel,
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            # fallback: since..HEAD or just since
            result = subprocess.run(
                [
                    "git",
                    "-C",
                    str(repo),
                    "diff",
                    "--name-only",
                    "--diff-filter=ACMR",
                    since,
                    "HEAD",
                    "--",
                    rel,
                ],
                check=False,
                capture_output=True,
                text=True,
            )
        if result.returncode != 0:
            continue
        for line in result.stdout.splitlines():
            path = line.strip()
            if path.endswith(".md"):
                changed.append(path)
    return sorted(set(changed))


def _git_toplevel(start: Path) -> Path | None:
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        cwd=start if start.is_dir() else start.parent,
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return None
    return Path(result.stdout.strip())
