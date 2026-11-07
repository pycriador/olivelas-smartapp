"""Synchronizer plan — skip slow Confluence warm for scoped new pages."""

from __future__ import annotations

from pathlib import Path

from docs_sync.config import AppConfig, DocumentationConfig, SyncConfig
from docs_sync.confluence import FakeConfluenceClient
from docs_sync.models import Document, DocumentationMetadata, DocumentationTree, SyncAction
from docs_sync.state import SyncState, save_state
from docs_sync.sync import Synchronizer


class _TrackingClient(FakeConfluenceClient):
    warm_calls = 0

    def warm_managed_index(self, space_key: str, parent_id: str | None = None) -> int:
        _TrackingClient.warm_calls += 1
        return super().warm_managed_index(space_key, parent_id)


def test_build_plan_skips_warm_for_new_stable_ids_in_nonempty_state(tmp_path: Path):
    docs = tmp_path / "docs" / "aiops-team"
    docs.mkdir(parents=True)
    (docs / "README.md").write_text("# Hub\n", encoding="utf-8")
    cfg_path = tmp_path / "cfg.yaml"
    state_path = tmp_path / "state.json"
    config = AppConfig(
        documentation=DocumentationConfig(path=str(docs), language="pt-BR"),
        sync=SyncConfig(state_file=str(state_path)),
        config_path=cfg_path,
    )
    state = SyncState(
        space="AIOps",
        pages={"REF-OLD": "999"},
        content_hashes={"REF-OLD": "abc"},
    )
    save_state(state_path, state)

    tree = DocumentationTree(
        root_path=str(docs),
        documents={
            "README.md": Document(
                path="README.md",
                title="Hub",
                content="# Hub\n",
                absolute_path=str(docs / "README.md"),
                metadata=DocumentationMetadata(document_id="REF-AIOPS-TEAM-001"),
                is_directory_index=True,
            )
        },
        roots=["README.md"],
    )

    _TrackingClient.warm_calls = 0
    client = _TrackingClient()
    plan = Synchronizer(config, client).build_plan(tree)

    assert _TrackingClient.warm_calls == 0
    assert plan.items[0].action == SyncAction.CREATE


def test_build_plan_uses_state_hash_without_warm_for_existing_pages(tmp_path: Path):
    docs = tmp_path / "docs" / "aiops-team"
    docs.mkdir(parents=True)
    (docs / "README.md").write_text("# Hub\n", encoding="utf-8")
    cfg_path = tmp_path / "cfg.yaml"
    state_path = tmp_path / "state.json"
    config = AppConfig(
        documentation=DocumentationConfig(path=str(docs), language="pt-BR"),
        sync=SyncConfig(state_file=str(state_path)),
        config_path=cfg_path,
    )

    doc = Document(
        path="README.md",
        title="Hub",
        content="# Hub\n",
        absolute_path=str(docs / "README.md"),
        metadata=DocumentationMetadata(document_id="REF-AIOPS-TEAM-001"),
        is_directory_index=True,
    )
    doc.content_hash = doc.content  # simplified; mapper hashes body

    from docs_sync.mapper import ConfluenceMapper

    mapping = ConfluenceMapper(config).map_document(doc, tree=None)
    state = SyncState(
        space="AIOps",
        pages={"REF-AIOPS-TEAM-001": "1001"},
        content_hashes={"REF-AIOPS-TEAM-001": mapping.content_hash},
    )
    save_state(state_path, state)

    tree = DocumentationTree(
        root_path=str(docs),
        documents={"README.md": doc},
        roots=["README.md"],
    )

    class _NoApiClient(FakeConfluenceClient):
        def get_page(self, page_id: str):
            raise AssertionError("plan should not fetch remote pages when hash matches")

    _TrackingClient.warm_calls = 0
    plan = Synchronizer(config, _NoApiClient()).build_plan(tree)

    assert _TrackingClient.warm_calls == 0
    assert plan.items[0].action == SyncAction.UNCHANGED
    assert plan.items[0].confluence_page_id == "1001"
