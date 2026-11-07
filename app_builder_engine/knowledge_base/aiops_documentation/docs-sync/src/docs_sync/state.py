"""Local sync state — maps stable_id → Confluence page_id for fast re-sync."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class SyncState:
    """Persisted identity map so re-sync does not need a full Confluence crawl."""

    pages: dict[str, str] = field(default_factory=dict)  # stable_id -> page_id
    content_hashes: dict[str, str] = field(default_factory=dict)  # stable_id -> hash
    root_page_id: str | None = None
    space: str | None = None

    def get_page_id(self, stable_id: str) -> str | None:
        return self.pages.get(stable_id)

    def remember(
        self,
        *,
        stable_id: str,
        page_id: str,
        content_hash: str | None = None,
    ) -> None:
        self.pages[stable_id] = page_id
        if content_hash:
            self.content_hashes[stable_id] = content_hash

    def to_dict(self) -> dict[str, Any]:
        return {
            "version": 1,
            "space": self.space,
            "root_page_id": self.root_page_id,
            "pages": dict(self.pages),
            "content_hashes": dict(self.content_hashes),
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> SyncState:
        return cls(
            pages={str(k): str(v) for k, v in (data.get("pages") or {}).items()},
            content_hashes={
                str(k): str(v) for k, v in (data.get("content_hashes") or {}).items()
            },
            root_page_id=(str(data["root_page_id"]) if data.get("root_page_id") else None),
            space=(str(data["space"]) if data.get("space") else None),
        )


def resolve_state_path(config_path: Path | None, configured: str | None) -> Path | None:
    if not configured:
        return None
    path = Path(configured)
    if path.is_absolute():
        return path
    base = config_path.parent if config_path else Path.cwd()
    return (base / path).resolve()


def load_state(path: Path | None) -> SyncState:
    if path is None or not path.is_file():
        return SyncState()
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        return SyncState()
    return SyncState.from_dict(raw)


def save_state(path: Path | None, state: SyncState) -> None:
    if path is None:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(state.to_dict(), indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
