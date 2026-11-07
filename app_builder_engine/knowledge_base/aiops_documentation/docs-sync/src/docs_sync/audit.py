"""Audit managed Confluence pages for blank bodies and broken links."""

from __future__ import annotations

from dataclasses import dataclass, field

from docs_sync.config import AppConfig
from docs_sync.confluence import ConfluenceClient
from docs_sync.links import count_unresolved_confluence_hrefs, is_blank_storage, visible_text_length
from docs_sync.mapper import ConfluenceMapper
from docs_sync.models import DocumentationTree
from docs_sync.state import load_state, resolve_state_path


@dataclass
class PageAuditIssue:
    page_id: str
    title: str
    stable_id: str | None
    source_path: str | None
    issues: list[str] = field(default_factory=list)
    visible_chars: int = 0
    unresolved_links: int = 0


@dataclass
class AuditReport:
    checked: int = 0
    blank: int = 0
    broken_links: int = 0
    missing_local: int = 0
    issues: list[PageAuditIssue] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def audit_managed_pages(
    config: AppConfig,
    client: ConfluenceClient,
    tree: DocumentationTree | None = None,
    *,
    min_chars: int = 40,
) -> AuditReport:
    """
    Validate content of managed pages known in local state (and optional tree).

    Flags:
    - blank / near-empty body
    - unresolved confluence:// hrefs
    - state entries with no matching local document
    """
    report = AuditReport()
    state_path = resolve_state_path(config.config_path, config.sync.state_file)
    state = load_state(state_path)
    if not state.pages:
        report.warnings.append(
            "Local state is empty — run sync first or pass a populated state file."
        )
        return report

    local_by_stable: dict[str, str] = {}
    if tree is not None:
        for doc in tree.iter_documents():
            local_by_stable[doc.stable_id] = doc.path

    for stable_id, page_id in sorted(state.pages.items(), key=lambda x: x[0]):
        page = client.get_page(page_id)
        if page is None:
            report.issues.append(
                PageAuditIssue(
                    page_id=page_id,
                    title="(missing)",
                    stable_id=stable_id,
                    source_path=local_by_stable.get(stable_id),
                    issues=["page_not_found"],
                )
            )
            continue

        report.checked += 1
        body = page.body_storage or ""
        visible = visible_text_length(body)
        unresolved = count_unresolved_confluence_hrefs(body)
        issues: list[str] = []
        if is_blank_storage(body, min_chars=min_chars):
            issues.append("blank_or_thin_body")
            report.blank += 1
        if unresolved:
            issues.append(f"unresolved_confluence_links:{unresolved}")
            report.broken_links += 1
        if tree is not None and stable_id not in local_by_stable:
            issues.append("missing_local_document")
            report.missing_local += 1

        if issues:
            report.issues.append(
                PageAuditIssue(
                    page_id=page.page_id,
                    title=page.title,
                    stable_id=stable_id,
                    source_path=local_by_stable.get(stable_id) or page.properties.get("source_path"),
                    issues=issues,
                    visible_chars=visible,
                    unresolved_links=unresolved,
                )
            )
    return report


def format_audit_report(report: AuditReport) -> str:
    lines = [
        "Confluence content audit",
        "========================",
        "",
        f"Checked: {report.checked}",
        f"Blank/thin: {report.blank}",
        f"Broken links: {report.broken_links}",
        f"Missing local: {report.missing_local}",
        "",
    ]
    if report.warnings:
        lines.append("WARNINGS")
        for w in report.warnings:
            lines.append(f"  - {w}")
        lines.append("")
    if not report.issues:
        lines.append("No content issues found.")
        return "\n".join(lines).rstrip() + "\n"

    lines.append("ISSUES")
    for item in report.issues:
        path = item.source_path or "-"
        lines.append(
            f"  - [{item.page_id}] {item.title} ({path}) "
            f"visible={item.visible_chars} links={item.unresolved_links}: "
            + ", ".join(item.issues)
        )
    lines.append("")
    lines.append(
        "Fix: `docs-sync sync --config <cfg> --force --relink` "
        "or `docs-sync flush --yes --resync` for a full republish."
    )
    return "\n".join(lines).rstrip() + "\n"
