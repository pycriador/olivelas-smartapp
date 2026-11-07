"""CLI entrypoint for docs-sync."""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

from docs_sync.changes import build_local_change_report
from docs_sync.config import apply_cli_overrides, load_config
from docs_sync.confluence import FakeConfluenceClient, build_confluence_client
from docs_sync.filter import filter_tree_by_only
from docs_sync.reporting import (
    format_change_report,
    format_change_report_json,
    format_plan,
    format_plan_json,
    format_result,
    format_result_json,
)
from docs_sync.repository import LocalRepositoryProvider
from docs_sync.sync import Synchronizer
from docs_sync.validation import validate_tree


def _configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(levelname)s  %(message)s",
    )
    # never let httpx dump auth headers at INFO
    logging.getLogger("httpx").setLevel(logging.WARNING)


def _load_tree(args: argparse.Namespace):
    config = load_config(args.config)
    apply_cli_overrides(
        config,
        docs=getattr(args, "docs", None) or None,
        root_page_id=getattr(args, "root_page_id", None),
        space=getattr(args, "space", None),
        include=getattr(args, "include", None) or None,
        language=getattr(args, "language", None),
    )
    provider = LocalRepositoryProvider(config)
    tree = provider.get_documents()
    only = getattr(args, "only", None) or None
    if only:
        tree = filter_tree_by_only(tree, only)
    tree.revision = provider.get_revision()
    return config, tree


def cmd_validate(args: argparse.Namespace) -> int:
    config, tree = _load_tree(args)
    roots = ", ".join(str(p) for p in config.docs_roots)
    logging.info("Loading documentation from %s", roots)
    logging.info("Found %s documents", len(tree.documents))
    if config.confluence.root_page_id:
        logging.info(
            "Confluence parent (page/folder id): %s", config.confluence.root_page_id
        )
    report = validate_tree(tree)
    for warning in report.warnings:
        logging.warning(warning)
    if not report.ok:
        for error in report.errors:
            logging.error(error)
        logging.error("Sync aborted")
        return 1
    logging.info("Validation passed")
    return 0


def cmd_status(args: argparse.Namespace) -> int:
    """Offline: which local docs changed since the last successful sync."""
    config, tree = _load_tree(args)
    report = build_local_change_report(
        config,
        tree,
        since=getattr(args, "since", None),
    )
    changes_only = not getattr(args, "all", False)
    text = (
        format_change_report_json(report, changes_only=changes_only)
        if args.json
        else format_change_report(report, changes_only=changes_only)
    )
    sys.stdout.write(text)
    return 0


def cmd_plan(args: argparse.Namespace) -> int:
    config, tree = _load_tree(args)
    report = validate_tree(tree)
    if not report.ok:
        for error in report.errors:
            logging.error(error)
        logging.error("Sync aborted")
        return 1
    client = _client_for(args, config)
    synchronizer = Synchronizer(config, client)
    plan = synchronizer.build_plan(tree, force=bool(getattr(args, "force", False)))
    changes_only = bool(getattr(args, "changes_only", False))
    text = (
        format_plan_json(plan, changes_only=changes_only)
        if args.json
        else format_plan(plan, changes_only=changes_only)
    )
    sys.stdout.write(text)
    return 0


def cmd_sync(args: argparse.Namespace) -> int:
    config, tree = _load_tree(args)
    if args.dry_run:
        config.sync.dry_run = True
    report = validate_tree(tree)
    if not report.ok:
        for error in report.errors:
            logging.error(error)
        logging.error("Sync aborted")
        return 1
    if not config.confluence.root_page_id and not getattr(args, "fake", False):
        logging.warning(
            "No confluence.root_page_id / --root-page-id set; "
            "top-level pages will be created at the space root"
        )
    client = _client_for(args, config)
    synchronizer = Synchronizer(config, client)
    force = bool(getattr(args, "force", False))
    relink = bool(getattr(args, "relink", True))
    logging.info("Building synchronization plan (force=%s relink=%s)", force, relink)
    plan = synchronizer.build_plan(tree, force=force)
    changes_only = bool(getattr(args, "changes_only", False))
    if not args.json:
        sys.stdout.write(format_plan(plan, changes_only=changes_only))
        sys.stdout.write("\n")
    logging.info("Executing synchronization plan")
    result = synchronizer.execute_plan(
        plan,
        dry_run=config.sync.dry_run,
        relink=relink,
        tree=tree,
    )
    result.revision = tree.revision
    result.repository = config.project.repository_url
    text = format_result_json(result) if args.json else format_result(result)
    sys.stdout.write(text)
    return 1 if result.failed else 0


def cmd_audit(args: argparse.Namespace) -> int:
    from docs_sync.audit import audit_managed_pages, format_audit_report

    config, tree = _load_tree(args)
    client = _client_for(args, config)
    report = audit_managed_pages(
        config,
        client,
        tree,
        min_chars=int(getattr(args, "min_chars", 40) or 40),
    )
    if args.json:
        import json

        payload = {
            "checked": report.checked,
            "blank": report.blank,
            "broken_links": report.broken_links,
            "missing_local": report.missing_local,
            "warnings": report.warnings,
            "issues": [
                {
                    "page_id": i.page_id,
                    "title": i.title,
                    "stable_id": i.stable_id,
                    "source_path": i.source_path,
                    "issues": i.issues,
                    "visible_chars": i.visible_chars,
                    "unresolved_links": i.unresolved_links,
                }
                for i in report.issues
            ],
        }
        sys.stdout.write(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    else:
        sys.stdout.write(format_audit_report(report))
    return 1 if report.issues else 0


def cmd_flush(args: argparse.Namespace) -> int:
    config, tree = _load_tree(args)
    if not getattr(args, "yes", False) and not args.dry_run:
        logging.error("Refusing flush without --yes (or use --dry-run to preview)")
        return 2
    if not config.confluence.root_page_id:
        logging.error("flush requires confluence.root_page_id / --root-page-id")
        return 2
    client = _client_for(args, config)
    synchronizer = Synchronizer(config, client)
    count, ids = synchronizer.flush_managed_pages(
        dry_run=bool(args.dry_run),
        hard_delete=not bool(getattr(args, "archive_only", False)),
    )
    logging.info("Flush %s: %s pages", "preview" if args.dry_run else "done", count)
    if getattr(args, "resync", False) and not args.dry_run:
        logging.info("Re-syncing documentation tree after flush")
        plan = synchronizer.build_plan(tree, force=True)
        result = synchronizer.execute_plan(
            plan, dry_run=False, relink=True, tree=tree
        )
        sys.stdout.write(format_result(result))
        return 1 if result.failed else 0
    if args.json:
        import json

        sys.stdout.write(
            json.dumps({"flushed": count, "page_ids": ids, "dry_run": args.dry_run}, indent=2)
            + "\n"
        )
    return 0


def cmd_cleanup(args: argparse.Namespace) -> int:
    """Delete Confluence pages/folders by title match (junk / accidental dumps)."""
    from docs_sync.cleanup import format_cleanup_report, run_cleanup

    if not getattr(args, "yes", False) and not args.dry_run:
        logging.error("Refusing cleanup without --yes (or use --dry-run to preview)")
        return 2
    title = (getattr(args, "title", None) or "").strip()
    if not title:
        logging.error("cleanup requires --title")
        return 2

    config = load_config(args.config)
    apply_cli_overrides(
        config,
        docs=getattr(args, "docs", None) or None,
        root_page_id=getattr(args, "root_page_id", None),
        space=getattr(args, "space", None),
        include=getattr(args, "include", None) or None,
        language=getattr(args, "language", None),
    )
    if not config.confluence.space:
        logging.error("cleanup requires confluence.space / --space")
        return 2

    protected: set[str] = set()
    if config.confluence.root_page_id:
        protected.add(str(config.confluence.root_page_id))
    for page_id in getattr(args, "protect", None) or []:
        if page_id:
            protected.add(str(page_id))

    client = _client_for(args, config)
    report = run_cleanup(
        client,
        space_key=config.confluence.space,
        title=title,
        match=getattr(args, "match", "prefix") or "prefix",
        from_parent_id=getattr(args, "from_parent", None) or None,
        include_folders=not bool(getattr(args, "pages_only", False)),
        protected_ids=protected,
        dry_run=bool(args.dry_run),
        pause_seconds=float(getattr(args, "pause", 0.2) or 0.0),
    )
    logging.info(
        "Cleanup %s: matched=%s deleted=%s failed=%s",
        "preview" if report.dry_run else "done",
        report.matched,
        len(report.deleted_ids),
        len(report.failed_ids),
    )
    if args.json:
        import json

        sys.stdout.write(
            json.dumps(
                {
                    "matched": report.matched,
                    "dry_run": report.dry_run,
                    "deleted": report.deleted_ids,
                    "skipped": report.skipped_ids,
                    "failed": report.failed_ids,
                    "protected": sorted(report.protected_ids),
                    "candidates": [
                        {
                            "page_id": c.page_id,
                            "title": c.title,
                            "content_type": c.content_type,
                            "depth": c.depth,
                            "source": c.source,
                        }
                        for c in report.candidates
                    ],
                },
                indent=2,
                ensure_ascii=False,
            )
            + "\n"
        )
    else:
        sys.stdout.write(format_cleanup_report(report))
    return 1 if report.failed_ids else 0


def cmd_report(args: argparse.Namespace) -> int:
    # report reuses sync dry-run output
    args.dry_run = True
    return cmd_sync(args)


def _client_for(args: argparse.Namespace, config):
    if getattr(args, "fake", False):
        return FakeConfluenceClient()
    if config.sync.dry_run or getattr(args, "dry_run", False):
        # dry-run against fake unless credentials present
        if not config.confluence.url or not config.confluence.api_token:
            logging.info("Using FakeConfluenceClient for dry-run (no Confluence credentials)")
            return FakeConfluenceClient()
    if not config.confluence.url or not config.confluence.space:
        raise SystemExit(
            "Missing Confluence configuration. Set CONFLUENCE_URL / CONFLUENCE_SPACE "
            "and CONFLUENCE_USERNAME / CONFLUENCE_API_TOKEN (see .env.example)."
        )
    return build_confluence_client(
        api_profile=config.confluence.api_profile,
        url=config.confluence.url,
        username=config.confluence.username,
        api_token=config.confluence.api_token,
        verify_ssl=config.confluence.verify_ssl,
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="docs-sync",
        description=(
            "Synchronize documentation-standard Markdown trees to Confluence. "
            "Use `status` to see local changes, `plan --changes-only` against Confluence, "
            "then `sync` to publish."
        ),
    )
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--json", action="store_true", help="Emit JSON for plan/report/sync")
    parser.add_argument(
        "--fake",
        action="store_true",
        help="Force FakeConfluenceClient (tests / offline demos)",
    )

    sub = parser.add_subparsers(dest="command", required=True)

    def add_common(p: argparse.ArgumentParser) -> None:
        p.add_argument(
            "--config",
            default="docs-sync.yaml",
            help="Path to docs-sync config YAML",
        )
        p.add_argument(
            "--docs",
            action="append",
            default=[],
            metavar="PATH",
            help=(
                "Documentation folder to publish (repeatable). "
                "Overrides documentation.path / paths from config."
            ),
        )
        p.add_argument(
            "--include",
            action="append",
            default=[],
            metavar="GLOB",
            help="Only include Markdown paths matching glob (repeatable), relative to each --docs root",
        )
        p.add_argument(
            "--only",
            action="append",
            default=[],
            metavar="ID_OR_PATH",
            help=(
                "Sync only matching docs by stable_id (frontmatter id:), relative path, "
                "or glob — includes ancestor index pages (repeatable)"
            ),
        )
        p.add_argument(
            "--root-page-id",
            dest="root_page_id",
            default=None,
            help="Confluence parent page or folder id (e.g. 6085345351)",
        )
        p.add_argument(
            "--space",
            default=None,
            help="Override Confluence space key",
        )
        p.add_argument(
            "--language",
            default=None,
            help="Optional language tag stored in config context (e.g. pt-BR)",
        )
        p.add_argument("--verbose", action="store_true")
        p.add_argument("--json", action="store_true")
        p.add_argument("--fake", action="store_true")

    p_validate = sub.add_parser("validate", help="Validate local documentation tree")
    add_common(p_validate)
    p_validate.set_defaults(func=cmd_validate)

    p_status = sub.add_parser(
        "status",
        help="Show local docs changed since last sync (offline; uses state file)",
    )
    add_common(p_status)
    p_status.add_argument(
        "--since",
        default=None,
        metavar="GIT_REF",
        help="Also list Markdown files changed in git since this ref (e.g. origin/main, HEAD~5)",
    )
    p_status.add_argument(
        "--all",
        action="store_true",
        help="Include UNCHANGED entries in the report",
    )
    p_status.set_defaults(func=cmd_status)

    p_plan = sub.add_parser(
        "plan",
        help="Build synchronization plan against Confluence (authoritative)",
    )
    add_common(p_plan)
    p_plan.add_argument("--dry-run", action="store_true", default=True)
    p_plan.add_argument(
        "--changes-only",
        action="store_true",
        help="Hide UNCHANGED pages; show only CREATE/UPDATE/warnings",
    )
    p_plan.add_argument(
        "--force",
        action="store_true",
        help="Treat all managed pages as UPDATE (ignore content_hash)",
    )
    p_plan.set_defaults(func=cmd_plan)

    p_sync = sub.add_parser("sync", help="Execute synchronization (create/update)")
    add_common(p_sync)
    p_sync.add_argument(
        "--dry-run",
        action="store_true",
        help="Plan only — do not write to Confluence",
    )
    p_sync.add_argument(
        "--changes-only",
        action="store_true",
        help="When printing the plan, hide UNCHANGED pages",
    )
    p_sync.add_argument(
        "--force",
        action="store_true",
        help="Rewrite all managed pages even when content_hash matches",
    )
    p_sync.add_argument(
        "--relink",
        dest="relink",
        action="store_true",
        default=True,
        help="After sync, resolve confluence:// links to real page URLs (default)",
    )
    p_sync.add_argument(
        "--no-relink",
        dest="relink",
        action="store_false",
        help="Skip post-sync link resolution pass",
    )
    p_sync.set_defaults(func=cmd_sync)

    p_audit = sub.add_parser(
        "audit",
        help="Validate Confluence page bodies (blank pages / broken confluence:// links)",
    )
    add_common(p_audit)
    p_audit.add_argument(
        "--min-chars",
        type=int,
        default=40,
        help="Minimum visible characters before a body is considered blank (default: 40)",
    )
    p_audit.set_defaults(func=cmd_audit)

    p_flush = sub.add_parser(
        "flush",
        help="Delete managed pages under root_page_id and clear local state",
    )
    add_common(p_flush)
    p_flush.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview which pages would be deleted",
    )
    p_flush.add_argument(
        "--yes",
        action="store_true",
        help="Confirm destructive flush",
    )
    p_flush.add_argument(
        "--resync",
        action="store_true",
        help="After flush, run a full force sync + relink",
    )
    p_flush.add_argument(
        "--archive-only",
        action="store_true",
        help="Soft-archive (label) instead of deleting pages",
    )
    p_flush.set_defaults(func=cmd_flush)

    p_cleanup = sub.add_parser(
        "cleanup",
        help=(
            "Delete Confluence pages/folders by title match "
            "(e.g. accidental 'Olivelas Docs · …' dumps)"
        ),
    )
    add_common(p_cleanup)
    p_cleanup.add_argument(
        "--title",
        required=True,
        help="Title needle to match (see --match)",
    )
    p_cleanup.add_argument(
        "--match",
        choices=("prefix", "exact", "contains"),
        default="prefix",
        help="How to match --title (default: prefix)",
    )
    p_cleanup.add_argument(
        "--from-parent",
        default=None,
        metavar="PAGE_ID",
        help="Only walk children under this parent (default: space homepage)",
    )
    p_cleanup.add_argument(
        "--protect",
        action="append",
        default=[],
        metavar="PAGE_ID",
        help="Never delete this page/folder id (repeatable; root_page_id is always protected)",
    )
    p_cleanup.add_argument(
        "--pages-only",
        action="store_true",
        help="Only match pages (skip folders)",
    )
    p_cleanup.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview matches without deleting",
    )
    p_cleanup.add_argument(
        "--yes",
        action="store_true",
        help="Confirm destructive cleanup",
    )
    p_cleanup.add_argument(
        "--pause",
        type=float,
        default=0.2,
        help="Pause seconds between deletes (default: 0.2; helps avoid 429)",
    )
    p_cleanup.set_defaults(func=cmd_cleanup)

    p_report = sub.add_parser("report", help="Produce a dry-run sync report")
    add_common(p_report)
    p_report.add_argument("--dry-run", action="store_true", default=True)
    p_report.add_argument("--changes-only", action="store_true")
    p_report.add_argument("--force", action="store_true")
    p_report.set_defaults(func=cmd_report)

    return parser


def main(argv: list[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    verbose = bool(getattr(args, "verbose", False))
    _configure_logging(verbose)
    config_path = Path(args.config)
    if not config_path.is_file():
        alt = Path(__file__).resolve().parents[2] / "config.example.yaml"
        if args.config == "docs-sync.yaml" and alt.is_file():
            logging.warning("Config %s not found; using %s", args.config, alt)
            args.config = str(alt)
    try:
        code = args.func(args)
    except FileNotFoundError as exc:
        logging.error("%s", exc)
        raise SystemExit(2) from exc
    raise SystemExit(code)


if __name__ == "__main__":
    main()
