"""Regression tests for the frontmatter-less stable_id fallback.

Reproduces a real incident: a profile's config declares a full documentation
root (docs/pt-BR), but a sync is invoked with --docs scoped to a subtree
(docs/pt-BR/aiops-apps). Both docs/pt-BR/README.md and
docs/pt-BR/aiops-apps/README.md lack frontmatter `id:`, so each falls back to
a `path:<relative-path>` stable_id. Before the fix, that relative path was
computed against whichever root the CLI happened to scan, so the scoped run
saw aiops-apps/README.md as just "README.md" — colliding with the unrelated
root index page's stable_id in the shared state file and causing the sync to
try to overwrite the wrong live Confluence page.
"""

from pathlib import Path

from docs_sync.config import AppConfig, DocumentationConfig, ProjectConfig, apply_cli_overrides
from docs_sync.repository import LocalRepositoryProvider


def _write_readme(path: Path, heading: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"# {heading}\n\nNo frontmatter here.\n", encoding="utf-8")


def _build_docs_root(tmp_path: Path) -> Path:
    docs_root = tmp_path / "docs" / "pt-BR"
    _write_readme(docs_root / "README.md", "Indice da documentacao")
    _write_readme(docs_root / "aiops-apps" / "README.md", "AIOps Apps")
    return docs_root


def test_full_tree_stable_ids_do_not_collide(tmp_path: Path) -> None:
    docs_root = _build_docs_root(tmp_path)
    config = AppConfig(
        project=ProjectConfig(name="demo"),
        documentation=DocumentationConfig(path=str(docs_root)),
        config_path=tmp_path / "cfg.yaml",
    )
    tree = LocalRepositoryProvider(config).get_documents()

    root_readme = tree.documents["README.md"]
    subtree_readme = tree.documents["aiops-apps/README.md"]

    assert root_readme.stable_id == "path:README.md"
    assert subtree_readme.stable_id == "path:aiops-apps/README.md"
    assert root_readme.stable_id != subtree_readme.stable_id


def test_scoped_docs_override_keeps_stable_id_from_full_tree(tmp_path: Path) -> None:
    """A --docs-scoped run must compute the SAME stable_id for a file as a
    full-tree run would, so it can never collide with (or silently touch) an
    unrelated page recorded under a full-tree stable_id in shared state."""
    docs_root = _build_docs_root(tmp_path)

    # Config as declared: full docs/pt-BR root (this is what a full-tree sync
    # of this profile would have used to populate .docs-sync-state.*.json).
    config = AppConfig(
        project=ProjectConfig(name="demo"),
        documentation=DocumentationConfig(path=str(docs_root)),
        config_path=tmp_path / "cfg.yaml",
    )

    # CLI overrides --docs to the aiops-apps subtree, as a scoped sync does.
    scoped_root = docs_root / "aiops-apps"
    apply_cli_overrides(config, docs=[str(scoped_root)])

    tree = LocalRepositoryProvider(config).get_documents()
    subtree_readme = tree.documents["README.md"]  # scan-relative key, root is scoped

    assert subtree_readme.path == "README.md"
    # Must match the full-tree run's stable_id for the same file, not collide
    # with the unrelated docs/pt-BR/README.md's "path:README.md".
    assert subtree_readme.stable_id == "path:aiops-apps/README.md"
    assert subtree_readme.canonical_path == "aiops-apps/README.md"
