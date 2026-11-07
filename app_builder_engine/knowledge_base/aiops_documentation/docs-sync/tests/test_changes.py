"""Offline change detection vs sync state."""

from pathlib import Path

from docs_sync.changes import build_local_change_report
from docs_sync.config import load_config
from docs_sync.repository import LocalRepositoryProvider
from docs_sync.state import SyncState, save_state


def test_status_detects_new_and_changed(tmp_path: Path):
    docs = tmp_path / "docs"
    docs.mkdir()
    readme = docs / "README.md"
    readme.write_text(
        "---\nid: ROOT-1\ntitle: Root\nstatus: DRAFT\n---\n\n# Root\n\nHello.\n",
        encoding="utf-8",
    )
    config_file = tmp_path / "cfg.yaml"
    config_file.write_text(
        f"""
project:
  name: demo
confluence:
  space: DEMO
documentation:
  path: "{docs.as_posix()}"
sync:
  state_file: ".docs-sync-state.json"
""",
        encoding="utf-8",
    )
    config = load_config(config_file)
    tree = LocalRepositoryProvider(config).get_documents()
    report = build_local_change_report(config, tree)
    assert any(i.status == "NEW" and i.stable_id == "ROOT-1" for i in report.items)

    # Simulate previous sync
    state = SyncState(pages={"ROOT-1": "111"}, content_hashes={})
    # Fill hash from current tree so next status is UNCHANGED
    from docs_sync.mapper import ConfluenceMapper

    mapping = ConfluenceMapper(config).map_tree(tree)[0]
    state.remember(
        stable_id="ROOT-1", page_id="111", content_hash=mapping.content_hash
    )
    save_state(tmp_path / ".docs-sync-state.json", state)

    report2 = build_local_change_report(config, tree)
    assert any(i.status == "UNCHANGED" and i.stable_id == "ROOT-1" for i in report2.items)

    readme.write_text(
        "---\nid: ROOT-1\ntitle: Root\nstatus: DRAFT\n---\n\n# Root\n\nHello changed.\n",
        encoding="utf-8",
    )
    tree3 = LocalRepositoryProvider(config).get_documents()
    report3 = build_local_change_report(config, tree3)
    assert any(i.status == "CHANGED" and i.stable_id == "ROOT-1" for i in report3.actionable())
