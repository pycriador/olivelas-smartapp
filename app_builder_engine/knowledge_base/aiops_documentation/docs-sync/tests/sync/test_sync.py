"""Mapper and sync idempotency tests with FakeConfluenceClient."""

from pathlib import Path

from docs_sync.config import AppConfig, ConfluenceConfig, DocumentationConfig, ProjectConfig, SyncConfig
from docs_sync.confluence import FakeConfluenceClient
from docs_sync.mapper import ConfluenceMapper
from docs_sync.models import SyncAction
from docs_sync.repository import LocalRepositoryProvider
from docs_sync.sync import Synchronizer
from docs_sync.validation import validate_tree


def _write_mini_docs(root: Path) -> None:
    (root / "README.md").write_text(
        "---\nid: ROOT-001\ntitle: Project Docs\nstatus: ACCEPTED\n---\n\n# Project Docs\n\nWelcome.\n",
        encoding="utf-8",
    )
    arch = root / "architecture"
    arch.mkdir()
    (arch / "README.md").write_text(
        "---\nid: ARCH-000\ntitle: Architecture\nstatus: ACCEPTED\n---\n\n# Architecture\n\nOverview.\n",
        encoding="utf-8",
    )
    (arch / "system-context.md").write_text(
        "---\nid: ARCH-001\ntitle: System Context\nstatus: ACCEPTED\n---\n\n# System Context\n\nSee [Architecture](./README.md).\n",
        encoding="utf-8",
    )


def test_local_tree_and_titles(tmp_path: Path):
    docs = tmp_path / "docs"
    docs.mkdir()
    _write_mini_docs(docs)
    config = AppConfig(
        project=ProjectConfig(name="demo"),
        documentation=DocumentationConfig(path=str(docs)),
        confluence=ConfluenceConfig(space="DEMO"),
        sync=SyncConfig(),
        config_path=tmp_path / "docs-sync.yaml",
    )
    (tmp_path / "docs-sync.yaml").write_text("project:\n  name: demo\n", encoding="utf-8")
    # docs_root resolves relative to config parent + documentation.path absolute override
    config.documentation.path = str(docs)
    # monkeypatch docs_root via absolute path in documentation.path when config_path parent joined —
    # use absolute path so docs_root works:
    tree = LocalRepositoryProvider(config).get_documents()
    # Because docs_root = config_path.parent / path, and path is absolute, Path join may ignore parent on POSIX
    assert "README.md" in tree.documents or any(p.endswith("README.md") for p in tree.documents)
    report = validate_tree(tree)
    assert report.ok, report.errors


def test_sync_idempotent(tmp_path: Path):
    docs = tmp_path / "docs"
    docs.mkdir()
    _write_mini_docs(docs)
    config_file = tmp_path / "cfg.yaml"
    config_file.write_text(
        f"""
project:
  name: demo
  repository_url: https://example.test/repo
confluence:
  space: DEMO
  root_page: Demo
documentation:
  path: "{docs.as_posix()}"
sync:
  create_missing: true
  update_existing: true
""",
        encoding="utf-8",
    )
    from docs_sync.config import load_config

    config = load_config(config_file)
    client = FakeConfluenceClient()
    sync = Synchronizer(config, client)

    tree = LocalRepositoryProvider(config).get_documents()
    assert validate_tree(tree).ok

    plan1 = sync.build_plan(tree)
    assert any(i.action == SyncAction.CREATE for i in plan1.items)
    result1 = sync.execute_plan(plan1, dry_run=False)
    assert result1.created >= 1
    assert result1.failed == 0
    created = client.create_calls

    plan2 = sync.build_plan(tree)
    assert all(i.action in {SyncAction.UNCHANGED, SyncAction.SKIPPED} for i in plan2.items)
    result2 = sync.execute_plan(plan2, dry_run=False)
    assert result2.created == 0
    assert result2.unchanged >= 1
    assert client.create_calls == created


def test_mapper_stable_id_and_relative_link(tmp_path: Path):
    docs = tmp_path / "docs"
    docs.mkdir()
    _write_mini_docs(docs)
    config_file = tmp_path / "cfg.yaml"
    config_file.write_text(
        f"""
project:
  name: demo
confluence:
  space: DEMO
documentation:
  path: "{docs.as_posix()}"
""",
        encoding="utf-8",
    )
    from docs_sync.config import load_config

    config = load_config(config_file)
    tree = LocalRepositoryProvider(config).get_documents()
    mapper = ConfluenceMapper(config)
    mappings = {m.source_path: m for m in mapper.map_tree(tree)}
    ctx = next(m for p, m in mappings.items() if p.endswith("system-context.md"))
    assert ctx.stable_id == "ARCH-001"
    assert "confluence://ARCH-000" in ctx.body_storage or "confluence://ARCH-000" in (
        tree.documents[ctx.source_path].content
        if False
        else mapper._rewrite_relative_links(tree.documents[ctx.source_path], tree)
    )


def test_sync_force_and_relink(tmp_path: Path):
    docs = tmp_path / "docs"
    docs.mkdir()
    _write_mini_docs(docs)
    config_file = tmp_path / "cfg.yaml"
    config_file.write_text(
        f"""
project:
  name: demo
  repository_url: https://example.test/repo
confluence:
  url: https://example.atlassian.net
  space: DEMO
  root_page_id: "1"
documentation:
  path: "{docs.as_posix()}"
sync:
  create_missing: true
  update_existing: true
  state_file: ".docs-sync-state.json"
""",
        encoding="utf-8",
    )
    from docs_sync.config import load_config

    config = load_config(config_file)
    client = FakeConfluenceClient()
    sync = Synchronizer(config, client)
    tree = LocalRepositoryProvider(config).get_documents()

    plan1 = sync.build_plan(tree)
    result1 = sync.execute_plan(plan1, dry_run=False, relink=True, tree=tree)
    assert result1.failed == 0
    assert result1.created >= 1

    # Bodies should not keep confluence:// placeholders after relink
    for page in client.pages.values():
        assert "confluence://" not in (page.body_storage or "")

    created = client.create_calls
    plan_force = sync.build_plan(tree, force=True)
    assert any(i.action == SyncAction.UPDATE for i in plan_force.items)
    result2 = sync.execute_plan(plan_force, dry_run=False, relink=True, tree=tree)
    assert result2.failed == 0
    assert result2.updated >= 1
    assert client.create_calls == created


def test_flush_deletes_managed_pages(tmp_path: Path):
    docs = tmp_path / "docs"
    docs.mkdir()
    _write_mini_docs(docs)
    config_file = tmp_path / "cfg.yaml"
    config_file.write_text(
        f"""
project:
  name: demo
confluence:
  url: https://example.atlassian.net
  space: DEMO
  root_page_id: "root"
documentation:
  path: "{docs.as_posix()}"
sync:
  state_file: ".docs-sync-state.json"
""",
        encoding="utf-8",
    )
    from docs_sync.config import load_config
    from docs_sync.confluence import ConfluencePage

    config = load_config(config_file)
    client = FakeConfluenceClient()
    client.pages["root"] = ConfluencePage(
        page_id="root", title="Root", space_key="DEMO", version=1
    )
    sync = Synchronizer(config, client)
    tree = LocalRepositoryProvider(config).get_documents()
    plan = sync.build_plan(tree)
    sync.execute_plan(plan, dry_run=False, relink=True, tree=tree)
    assert len(client.pages) > 1

    count, _ = sync.flush_managed_pages(dry_run=False, hard_delete=True)
    assert count >= 1
    assert sync.state.pages == {}


def test_mapper_disambiguates_duplicate_titles(tmp_path: Path):
    docs = tmp_path / "docs"
    (docs / "architecture").mkdir(parents=True)
    (docs / "templates").mkdir(parents=True)
    (docs / "architecture" / "README.md").write_text(
        "---\nid: A-1\ntitle: Architecture\nstatus: DRAFT\n---\n\n# Architecture\n",
        encoding="utf-8",
    )
    (docs / "templates" / "architecture.md").write_text(
        "---\nid: T-1\ntitle: Architecture\nstatus: DRAFT\n---\n\n# Architecture\n",
        encoding="utf-8",
    )
    config_file = tmp_path / "cfg.yaml"
    config_file.write_text(
        f"""
project:
  name: demo
confluence:
  space: DEMO
  root_page_id: "1"
documentation:
  path: "{docs.as_posix()}"
""",
        encoding="utf-8",
    )
    from docs_sync.config import load_config

    config = load_config(config_file)
    tree = LocalRepositoryProvider(config).get_documents()
    titles = [m.title for m in ConfluenceMapper(config).map_tree(tree)]
    assert len(titles) == len(set(titles))
    assert any("templates" in t for t in titles)
