"""Tests for --only tree filtering."""

from __future__ import annotations

from docs_sync.filter import filter_tree_by_only
from docs_sync.models import Document, DocumentationMetadata, DocumentationTree


def _doc(path: str, doc_id: str | None = None, parent: str | None = None, index: bool = False) -> Document:
    meta = DocumentationMetadata(document_id=doc_id)
    return Document(
        path=path,
        title=path,
        content=f"body {path}",
        absolute_path=f"/tmp/{path}",
        metadata=meta,
        parent_path=parent,
        is_directory_index=index,
    )


def test_filter_by_stable_id_includes_ancestors() -> None:
    tree = DocumentationTree(root_path="/docs")
    tree.documents = {
        "README.md": _doc("README.md", "IDX-ROOT", index=True),
        "apps/README.md": _doc("apps/README.md", "IDX-APPS", parent="README.md", index=True),
        "apps/foo.md": _doc("apps/foo.md", "REF-FOO", parent="apps/README.md"),
    }
    tree.documents["README.md"].children = ["apps/README.md"]
    tree.documents["apps/README.md"].children = ["apps/foo.md"]

    filtered = filter_tree_by_only(tree, ["REF-FOO"])
    assert set(filtered.documents) == {"README.md", "apps/README.md", "apps/foo.md"}


def test_filter_by_path() -> None:
    tree = DocumentationTree(root_path="/docs")
    tree.documents = {
        "dataforge.md": _doc("dataforge.md", "REF-DF"),
    }
    filtered = filter_tree_by_only(tree, ["dataforge.md"])
    assert "dataforge.md" in filtered.documents


def test_filter_by_only_does_not_hang_on_self_referential_root_index() -> None:
    """A brand-new doc's --only selection must not hang if the root index's
    parent_path points at itself (see repository._wire_hierarchy)."""
    tree = DocumentationTree(root_path="/docs")
    tree.documents = {
        "README.md": _doc("README.md", "IDX-ROOT", parent="README.md", index=True),
        "README-guia.md": _doc("README-guia.md", "REF-GUIDE", parent="README.md"),
    }
    tree.documents["README.md"].children = ["README-guia.md"]

    filtered = filter_tree_by_only(tree, ["REF-GUIDE"])
    assert set(filtered.documents) == {"README.md", "README-guia.md"}
