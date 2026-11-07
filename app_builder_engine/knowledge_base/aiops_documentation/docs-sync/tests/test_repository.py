"""LocalRepositoryProvider tree wiring — top-level directory index parenting."""

from __future__ import annotations

from pathlib import Path

from docs_sync.config import AppConfig, DocumentationConfig
from docs_sync.repository import LocalRepositoryProvider


def test_top_level_directory_index_has_no_self_referential_parent(tmp_path: Path):
    """A docs root's own index page has no ancestor; parent_path must be None,
    not a self-reference — a self-loop hangs any code that walks parent_path
    upward (e.g. filter.filter_tree_by_only's --only ancestor resolution)."""
    docs = tmp_path / "docs" / "aiops-team"
    docs.mkdir(parents=True)
    (docs / "README.md").write_text("---\nid: IDX-ROOT\n---\n# Hub\n", encoding="utf-8")
    (docs / "README-guia.md").write_text(
        "---\nid: REF-GUIDE\n---\n# Guide\n", encoding="utf-8"
    )

    config = AppConfig(documentation=DocumentationConfig(path=str(docs), language="pt-BR"))
    tree = LocalRepositoryProvider(config).get_documents()

    assert tree.documents["README.md"].parent_path is None
    assert tree.documents["README-guia.md"].parent_path == "README.md"
