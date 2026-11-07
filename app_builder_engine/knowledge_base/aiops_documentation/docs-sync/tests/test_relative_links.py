"""Relative link safety for Confluence/GitHub publish."""

from pathlib import Path

from docs_sync.links import (
    find_bare_relative_md_paths,
    resolve_under_doc_root,
)
from docs_sync.models import Document, DocumentationMetadata, DocumentationTree
from docs_sync.validation import validate_tree


def test_resolve_under_doc_root_rejects_escape():
    assert resolve_under_doc_root("overview.md", "../../knowledge/README.md") is None
    assert resolve_under_doc_root("a/b.md", "../c.md") == "c.md"
    assert resolve_under_doc_root("a/b.md", "./c.md") == "a/c.md"


def test_bare_relative_paths_detected():
    prose = (
        "Docs de pacotes relacionados: ../../knowledge/README.md · "
        "../../backend/README.md"
    )
    found = find_bare_relative_md_paths(prose)
    assert "../../knowledge/README.md" in found
    assert "../../backend/README.md" in found


def test_bare_paths_ignored_inside_markdown_links():
    text = "[backend](../../backend/README.md)"
    # Link target is stripped; remaining text has no bare path token.
    assert find_bare_relative_md_paths(text) == []


def test_validate_tree_rejects_escaping_and_bare_paths(tmp_path: Path):
    doc_path = tmp_path / "overview.md"
    doc_path.write_text(
        "See ../../knowledge/README.md and [x](../../backend/README.md).\n",
        encoding="utf-8",
    )
    tree = DocumentationTree(root_path=str(tmp_path))
    tree.documents["overview.md"] = Document(
        path="overview.md",
        title="Overview",
        content=doc_path.read_text(encoding="utf-8"),
        absolute_path=str(doc_path),
        metadata=DocumentationMetadata(title="Overview"),
    )
    report = validate_tree(tree)
    assert not report.ok
    joined = "\n".join(report.errors)
    assert "bare relative path" in joined
    assert "escapes the documentation tree" in joined or "broken relative link" in joined


def test_validate_tree_accepts_in_tree_relative(tmp_path: Path):
    (tmp_path / "a.md").write_text("# A\n", encoding="utf-8")
    (tmp_path / "b.md").write_text("See [A](./a.md).\n", encoding="utf-8")
    tree = DocumentationTree(root_path=str(tmp_path))
    tree.documents["a.md"] = Document(
        path="a.md",
        title="A",
        content="# A\n",
        absolute_path=str(tmp_path / "a.md"),
        metadata=DocumentationMetadata(document_id="A-1", title="A"),
    )
    tree.documents["b.md"] = Document(
        path="b.md",
        title="B",
        content="See [A](./a.md).\n",
        absolute_path=str(tmp_path / "b.md"),
        metadata=DocumentationMetadata(document_id="B-1", title="B"),
    )
    report = validate_tree(tree)
    assert report.ok, report.errors
