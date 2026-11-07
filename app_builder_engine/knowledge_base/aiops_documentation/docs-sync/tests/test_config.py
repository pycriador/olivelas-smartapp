"""Config loading tests."""

import os
from pathlib import Path

from docs_sync.config import expand_env, load_config


def test_expand_env(monkeypatch):
    monkeypatch.setenv("CONFLUENCE_SPACE", "ABC")
    assert expand_env({"space": "${CONFLUENCE_SPACE}"})["space"] == "ABC"


def test_load_config_example(tmp_path: Path, monkeypatch):
    monkeypatch.setenv("CONFLUENCE_URL", "https://example.atlassian.net")
    monkeypatch.setenv("CONFLUENCE_SPACE", "ENG")
    monkeypatch.setenv("CONFLUENCE_USERNAME", "user@example.com")
    monkeypatch.setenv("CONFLUENCE_API_TOKEN", "token-value")
    cfg = tmp_path / "docs-sync.yaml"
    cfg.write_text(
        """
project:
  name: sample
confluence:
  url: "${CONFLUENCE_URL}"
  space: "${CONFLUENCE_SPACE}"
  username: "${CONFLUENCE_USERNAME}"
  api_token: "${CONFLUENCE_API_TOKEN}"
  root_page_id: "6085345351"
documentation:
  path: "./docs"
  language: pt-BR
""",
        encoding="utf-8",
    )
    (tmp_path / "docs").mkdir()
    config = load_config(cfg)
    assert config.confluence.space == "ENG"
    assert config.confluence.api_token == "token-value"
    assert config.confluence.root_page_id == "6085345351"
    assert config.documentation.language == "pt-BR"
    assert "token-value" not in repr(config.project)  # sanity: project has no token


def test_cli_overrides_docs_and_includes(tmp_path: Path, monkeypatch):
    from docs_sync.config import apply_cli_overrides

    monkeypatch.setenv("CONFLUENCE_URL", "https://example.atlassian.net")
    monkeypatch.setenv("CONFLUENCE_SPACE", "ENG")
    monkeypatch.setenv("CONFLUENCE_USERNAME", "user@example.com")
    monkeypatch.setenv("CONFLUENCE_API_TOKEN", "token-value")
    cfg = tmp_path / "docs-sync.yaml"
    cfg.write_text(
        """
project:
  name: sample
confluence:
  space: "${CONFLUENCE_SPACE}"
documentation:
  path: "./docs"
""",
        encoding="utf-8",
    )
    config = load_config(cfg)
    apply_cli_overrides(
        config,
        docs=[str(tmp_path / "a"), str(tmp_path / "b")],
        root_page_id="6085345351",
        include=["architecture/**"],
        language="pt-BR",
    )
    assert config.documentation.paths == [str(tmp_path / "a"), str(tmp_path / "b")]
    assert config.confluence.root_page_id == "6085345351"
    assert config.documentation.include_globs == ["architecture/**"]
    assert config.documentation.language == "pt-BR"


def test_include_globs_filter_docs(tmp_path: Path):
    from docs_sync.config import AppConfig, DocumentationConfig, ProjectConfig
    from docs_sync.repository import LocalRepositoryProvider

    docs = tmp_path / "docs"
    (docs / "architecture").mkdir(parents=True)
    (docs / "runbooks").mkdir(parents=True)
    (docs / "architecture" / "README.md").write_text(
        "---\nid: A-1\ntitle: Arch\nstatus: DRAFT\n---\n\n# Arch\n",
        encoding="utf-8",
    )
    (docs / "runbooks" / "README.md").write_text(
        "---\nid: R-1\ntitle: Run\nstatus: DRAFT\n---\n\n# Run\n",
        encoding="utf-8",
    )
    config = AppConfig(
        project=ProjectConfig(name="demo"),
        documentation=DocumentationConfig(
            path=str(docs),
            include_globs=["architecture/**"],
        ),
        config_path=tmp_path / "cfg.yaml",
    )
    (tmp_path / "cfg.yaml").write_text("project:\n  name: demo\n", encoding="utf-8")
    tree = LocalRepositoryProvider(config).get_documents()
    assert any(p.endswith("architecture/README.md") for p in tree.documents)
    assert not any("runbooks" in p for p in tree.documents)
