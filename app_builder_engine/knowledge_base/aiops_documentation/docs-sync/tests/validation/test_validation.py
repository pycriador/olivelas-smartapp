"""Validation tests."""

from docs_sync.models import Document, DocumentationMetadata, DocumentationTree
from docs_sync.validation import validate_tree


def _doc(path: str, *, doc_id: str | None = None, title: str = "T") -> Document:
    return Document(
        path=path,
        title=title,
        content="body",
        absolute_path=f"/tmp/{path}",
        metadata=DocumentationMetadata(document_id=doc_id, title=title),
    )


def test_duplicate_ids_fail():
    tree = DocumentationTree(root_path="/tmp")
    tree.documents["a.md"] = _doc("a.md", doc_id="X-1")
    tree.documents["b.md"] = _doc("b.md", doc_id="X-1")
    report = validate_tree(tree)
    assert not report.ok
    assert any("Duplicate document id" in e for e in report.errors)


def test_missing_title_fails():
    tree = DocumentationTree(root_path="/tmp")
    tree.documents["a.md"] = _doc("a.md", title="  ")
    report = validate_tree(tree)
    assert not report.ok
