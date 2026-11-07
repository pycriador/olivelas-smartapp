"""Human and JSON sync reports."""

from __future__ import annotations

import json
from typing import Any

from docs_sync.models import SyncPlan, SyncResult


def format_plan(plan: SyncPlan, *, changes_only: bool = False) -> str:
    lines = [
        "Synchronization Plan",
        "====================",
        "",
    ]
    by_action: dict[str, list[str]] = {}
    for item in plan.items:
        if changes_only and item.action.value == "UNCHANGED":
            continue
        by_action.setdefault(item.action.value, []).append(
            f"{item.mapping.title} ({item.mapping.source_path})"
        )
    actions: tuple[str, ...] = (
        "CREATE",
        "UPDATE",
        "UNCHANGED",
        "SKIPPED",
        "WARNING",
        "FAILED",
    )
    if changes_only:
        actions = ("CREATE", "UPDATE", "SKIPPED", "WARNING", "FAILED")
    for action in actions:
        entries = by_action.get(action) or []
        if not entries:
            continue
        lines.append(action)
        for entry in entries:
            lines.append(f"  - {entry}")
        lines.append("")
    if plan.warnings:
        lines.append("WARNINGS")
        for warning in plan.warnings:
            lines.append(f"  - {warning}")
        lines.append("")
    if plan.errors:
        lines.append("ERRORS")
        for error in plan.errors:
            lines.append(f"  - {error}")
        lines.append("")
    counts = plan.counts()
    if changes_only:
        shown = {k: v for k, v in counts.items() if k != "UNCHANGED"}
        unchanged = counts.get("UNCHANGED", 0)
        summary = ", ".join(f"{k}={v}" for k, v in sorted(shown.items())) or "no pending changes"
        lines.append(f"Summary (changes only): {summary}")
        if unchanged:
            lines.append(f"Hidden UNCHANGED: {unchanged}")
    else:
        lines.append("Summary: " + ", ".join(f"{k}={v}" for k, v in sorted(counts.items())))
    return "\n".join(lines).rstrip() + "\n"


def format_result(result: SyncResult) -> str:
    lines = [
        "Documentation Sync Report",
        "=========================",
        "",
        f"Repository: {result.repository or '-'}",
        f"Commit: {result.revision or '-'}",
        f"Dry run: {result.dry_run}",
        "",
        f"Created: {result.created}",
        f"Updated: {result.updated}",
        f"Unchanged: {result.unchanged}",
        f"Skipped: {result.skipped}",
        f"Failed: {result.failed}",
        "",
        f"Warnings: {len(result.warnings)}",
    ]
    if result.warnings:
        for warning in result.warnings:
            lines.append(f"- {warning}")
    if result.errors:
        lines.append("")
        lines.append("Failed Pages:")
        for err in result.errors:
            lines.append(f"- {err.path}: {err.message}")
    return "\n".join(lines).rstrip() + "\n"


def format_result_json(result: SyncResult) -> str:
    return json.dumps(result.to_dict(), indent=2, ensure_ascii=False) + "\n"


def format_plan_json(plan: SyncPlan, *, changes_only: bool = False) -> str:
    items = plan.items
    if changes_only:
        items = [i for i in items if i.action.value != "UNCHANGED"]
    payload: dict[str, Any] = {
        "counts": plan.counts(),
        "changes_only": changes_only,
        "warnings": plan.warnings,
        "errors": plan.errors,
        "items": [
            {
                "action": item.action.value,
                "title": item.mapping.title,
                "path": item.mapping.source_path,
                "stable_id": item.mapping.stable_id,
                "message": item.message,
            }
            for item in items
        ],
    }
    return json.dumps(payload, indent=2, ensure_ascii=False) + "\n"


def format_change_report(report, *, changes_only: bool = True) -> str:
    lines = [
        "Local change status (vs last sync state)",
        "========================================",
        "",
    ]
    if report.state_path:
        lines.append(f"State file: {report.state_path}")
        lines.append("")
    if report.git_since:
        lines.append(f"Git since: {report.git_since}")
        if report.git_paths:
            lines.append("Git Markdown changes:")
            for path in report.git_paths:
                lines.append(f"  - {path}")
        else:
            lines.append("Git Markdown changes: (none)")
        lines.append("")

    by_status: dict[str, list[str]] = {}
    for item in report.items:
        if changes_only and item.status == "UNCHANGED":
            continue
        label = f"{item.title} ({item.path})" if item.title else item.path
        by_status.setdefault(item.status, []).append(label)

    for status in ("NEW", "CHANGED", "REMOVED", "UNCHANGED"):
        entries = by_status.get(status) or []
        if not entries:
            continue
        lines.append(status)
        for entry in entries:
            lines.append(f"  - {entry}")
        lines.append("")

    if report.warnings:
        lines.append("WARNINGS")
        for warning in report.warnings:
            lines.append(f"  - {warning}")
        lines.append("")

    counts = report.counts()
    actionable = len(report.actionable())
    lines.append(
        "Summary: "
        + ", ".join(f"{k}={v}" for k, v in sorted(counts.items()))
        + f" | actionable={actionable}"
    )
    lines.append("")
    lines.append(
        "Next: run `docs-sync plan --config <cfg> --changes-only` to confirm against Confluence,"
    )
    lines.append("then `docs-sync sync --config <cfg>` to publish.")
    return "\n".join(lines).rstrip() + "\n"


def format_change_report_json(report, *, changes_only: bool = True) -> str:
    items = report.items
    if changes_only:
        items = [i for i in items if i.status != "UNCHANGED"]
    payload = {
        "state_path": report.state_path,
        "git_since": report.git_since,
        "git_paths": report.git_paths,
        "counts": report.counts(),
        "actionable": len(report.actionable()),
        "warnings": report.warnings,
        "items": [
            {
                "status": i.status,
                "path": i.path,
                "stable_id": i.stable_id,
                "title": i.title,
            }
            for i in items
        ],
    }
    return json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
