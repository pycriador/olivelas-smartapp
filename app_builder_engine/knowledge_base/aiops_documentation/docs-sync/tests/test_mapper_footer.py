"""GitHub source footer helpers for Confluence mapper."""

from pathlib import Path

from docs_sync.config import AppConfig, DocumentationConfig, ProjectConfig, SyncConfig
from docs_sync.mapper import ConfluenceMapper
from docs_sync.models import Document, DocumentationMetadata


def test_github_source_link_uses_blob_and_git_relative_path(tmp_path: Path):
    # Create a file under a fake git-less tree; mapper falls back to language prefix.
    docs = tmp_path / "docs" / "pt-BR" / "loft-infra"
    docs.mkdir(parents=True)
    file_path = docs / "kong-gateway.md"
    file_path.write_text("# Kong\n", encoding="utf-8")

    config = AppConfig(
        project=ProjectConfig(
            name="demo",
            repository_url="https://github.com/pycriador/olivelas-smartapp",
        ),
        documentation=DocumentationConfig(path=str(docs), language="pt-BR"),
        sync=SyncConfig(include_footer=True),
        config_path=tmp_path / "docs-sync.yaml",
    )
    mapper = ConfluenceMapper(config)
    doc = Document(
        path="kong-gateway.md",
        title="Kong",
        content="# Kong\n",
        absolute_path=str(file_path),
        metadata=DocumentationMetadata(),
    )
    display, url = mapper._github_source_link(doc)
    assert "kong-gateway.md" in display
    assert url.startswith(
        "https://github.com/pycriador/olivelas-smartapp/blob/main/"
    )
    assert url.endswith("kong-gateway.md")
    assert "/blob/main/" in url


def test_footer_contains_github_blob_link(tmp_path: Path):
    docs = tmp_path / "pack"
    docs.mkdir()
    file_path = docs / "readme.md"
    file_path.write_text("# Hi\n", encoding="utf-8")
    config = AppConfig(
        project=ProjectConfig(
            name="demo",
            repository_url="https://github.com/pycriador/olivelas-smartapp",
        ),
        documentation=DocumentationConfig(path=str(docs), language="pt-BR"),
        sync=SyncConfig(include_footer=True),
        config_path=tmp_path / "cfg.yaml",
    )
    mapper = ConfluenceMapper(config)
    doc = Document(
        path="readme.md",
        title="Hi",
        content="# Hi\n",
        absolute_path=str(file_path),
        metadata=DocumentationMetadata(),
    )
    html = mapper._append_footer("<p>body</p>", doc)
    assert "Source (GitHub):" in html
    assert "/blob/main/" in html
    assert "docs-sync:footer:start" in html
