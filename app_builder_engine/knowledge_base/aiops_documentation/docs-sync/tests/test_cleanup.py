"""Tests for title-based Confluence cleanup."""

from docs_sync.cleanup import collect_title_matches, run_cleanup
from docs_sync.confluence import FakeConfluenceClient


def _seed_space(client: FakeConfluenceClient) -> None:
    home = client.create_page(
        title="Olivelas",
        space_key="Olivelas",
        body_storage="",
        parent_id=None,
        labels=[],
        properties={},
    )
    client.homepage_id = home.page_id

    docs_inicial = client.create_page(
        title="Documentação Inicial",
        space_key="Olivelas",
        body_storage="",
        parent_id=home.page_id,
        labels=[],
        properties={},
        content_type="folder",
    )
    client.create_page(
        title="Índice da documentação",
        space_key="Olivelas",
        body_storage="<p>index</p>",
        parent_id=docs_inicial.page_id,
        labels=[],
        properties={"stable_id": "INDEX"},
    )

    junk_parent = client.create_page(
        title="Olivelas Docs · docs › pt-BR › templates",
        space_key="Olivelas",
        body_storage="",
        parent_id=home.page_id,
        labels=[],
        properties={},
    )
    client.create_page(
        title="Olivelas Docs · docs › pt-BR › templates › alert",
        space_key="Olivelas",
        body_storage="<p>junk</p>",
        parent_id=junk_parent.page_id,
        labels=[],
        properties={},
    )
    # Orphan not under homepage tree
    client.create_page(
        title="Olivelas Docs · docs › en › rollback",
        space_key="Olivelas",
        body_storage="<p>orphan</p>",
        parent_id=None,
        labels=[],
        properties={},
    )


def test_collect_prefix_skips_legitimate_tree():
    client = FakeConfluenceClient()
    _seed_space(client)
    protected = {client.homepage_id}
    # protect Documentação Inicial folder
    docs_folder = next(
        p for p in client.pages.values() if p.title == "Documentação Inicial"
    )
    protected.add(docs_folder.page_id)

    matches = collect_title_matches(
        client,
        space_key="Olivelas",
        title="Olivelas Docs",
        match="prefix",
        protected_ids=protected,
    )
    titles = {m.title for m in matches}
    assert "Documentação Inicial" not in titles
    assert "Índice da documentação" not in titles
    assert "Olivelas Docs · docs › pt-BR › templates › alert" in titles
    assert "Olivelas Docs · docs › en › rollback" in titles
    # deepest first
    assert matches[0].depth >= matches[-1].depth


def test_cleanup_dry_run_does_not_delete():
    client = FakeConfluenceClient()
    _seed_space(client)
    before = len(client.pages)
    report = run_cleanup(
        client,
        space_key="Olivelas",
        title="Olivelas Docs",
        match="prefix",
        protected_ids={client.homepage_id},
        dry_run=True,
    )
    assert report.matched >= 2
    assert report.deleted_ids == []
    assert len(client.pages) == before


def test_cleanup_deletes_matches_and_keeps_protected():
    client = FakeConfluenceClient()
    _seed_space(client)
    docs_folder = next(
        p for p in client.pages.values() if p.title == "Documentação Inicial"
    )
    index = next(p for p in client.pages.values() if p.title == "Índice da documentação")
    protected = {client.homepage_id, docs_folder.page_id, index.page_id}

    report = run_cleanup(
        client,
        space_key="Olivelas",
        title="Olivelas Docs",
        match="prefix",
        protected_ids=protected,
        dry_run=False,
        pause_seconds=0.0,
    )
    assert report.failed_ids == []
    assert report.deleted_ids
    remaining_titles = {p.title for p in client.pages.values()}
    assert "Documentação Inicial" in remaining_titles
    assert "Índice da documentação" in remaining_titles
    assert "Olivelas" in remaining_titles
    assert not any(t.startswith("Olivelas Docs") for t in remaining_titles)


def test_exact_match_only():
    client = FakeConfluenceClient()
    _seed_space(client)
    client.create_page(
        title="Olivelas Docs",
        space_key="Olivelas",
        body_storage="",
        parent_id=client.homepage_id,
        labels=[],
        properties={},
        content_type="folder",
    )
    matches = collect_title_matches(
        client,
        space_key="Olivelas",
        title="Olivelas Docs",
        match="exact",
        protected_ids={client.homepage_id},
    )
    assert len(matches) == 1
    assert matches[0].title == "Olivelas Docs"
