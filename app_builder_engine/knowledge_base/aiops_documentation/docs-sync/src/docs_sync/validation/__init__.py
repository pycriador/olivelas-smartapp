"""Local documentation validation before any Confluence writes."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from docs_sync.links import (
    find_bare_relative_md_paths,
    iter_relative_file_hrefs,
    resolve_under_doc_root,
)
from docs_sync.models import DocumentationTree


@dataclass
class ValidationReport:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.errors


def validate_tree(tree: DocumentationTree) -> ValidationReport:
    report = ValidationReport()
    if not tree.documents:
        report.errors.append("No Markdown documents found under documentation path")
        return report

    seen_ids: dict[str, str] = {}
    seen_paths: set[str] = set()

    for doc in tree.iter_documents():
        if doc.path in seen_paths:
            report.errors.append(f"Duplicate path: {doc.path}")
        seen_paths.add(doc.path)

        if not doc.title or not doc.title.strip():
            report.errors.append(f"Missing title: {doc.path}")

        doc_id = doc.metadata.document_id
        if doc_id:
            if doc_id in seen_ids:
                report.errors.append(
                    f"Duplicate document id {doc_id}: {seen_ids[doc_id]} and {doc.path}"
                )
            else:
                seen_ids[doc_id] = doc.path

        status = doc.metadata.status
        if status and status not in {
            "DRAFT",
            "REVIEW",
            "ACCEPTED",
            "DEPRECATED",
            "ARCHIVED",
        }:
            report.warnings.append(f"Unexpected status {status!r} in {doc.path}")

        if doc.parent_path and doc.parent_path not in tree.documents:
            report.errors.append(
                f"Broken parent reference for {doc.path}: {doc.parent_path}"
            )

        _validate_document_links(report, tree, doc.path, doc.content, doc.absolute_path)

    return report


def _validate_document_links(
    report: ValidationReport,
    tree: DocumentationTree,
    document_path: str,
    content: str,
    absolute_path: str,
) -> None:
    """Fail sync when relative links would publish as dead Confluence/GitHub hrefs."""
    for bare in find_bare_relative_md_paths(content):
        report.errors.append(
            f"{document_path}: bare relative path {bare!r} is not a navigable link "
            f"on Confluence/GitHub — use a Markdown link with a GitHub blob URL "
            f"(org/repo) or an in-tree relative .md link"
        )

    doc_abs = Path(absolute_path)
    for _text, target, _fragment in iter_relative_file_hrefs(content):
        resolved = resolve_under_doc_root(document_path, target)
        if resolved is not None and resolved in tree.documents:
            continue

        candidate = (doc_abs.parent / target)
        try:
            resolved_file = candidate.resolve()
            exists = resolved_file.exists()
        except OSError:
            exists = False
            resolved_file = None

        if exists and resolved_file is not None:
            # Same git repo file (e.g. cross-pack sibling) → GitHub blob on rewrite.
            continue

        if resolved is None:
            report.errors.append(
                f"{document_path}: relative link {target!r} escapes the documentation "
                f"tree and the file was not found — use "
                f"https://github.com/<org>/<repo>/blob/main/... for another repository"
            )
        else:
            report.errors.append(
                f"{document_path}: broken relative link {target!r} "
                f"(resolved {resolved!r} not in sync tree and file not found). "
                f"For another GitHub repo, use an absolute blob URL."
            )
