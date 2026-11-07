"""Domain models for documentation sync."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class SyncAction(str, Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    UNCHANGED = "UNCHANGED"
    SKIPPED = "SKIPPED"
    FAILED = "FAILED"
    WARNING = "WARNING"
    ARCHIVED = "ARCHIVED"


@dataclass
class DocumentationMetadata:
    """Parsed YAML frontmatter and derived fields."""

    raw: dict[str, Any] = field(default_factory=dict)
    document_id: str | None = None
    title: str | None = None
    status: str | None = None
    owner: str | None = None
    doc_type: str | None = None
    authority: str | None = None

    @classmethod
    def from_frontmatter(cls, data: dict[str, Any]) -> DocumentationMetadata:
        return cls(
            raw=dict(data),
            document_id=_as_str(data.get("id")),
            title=_as_str(data.get("title")),
            status=_as_str(data.get("status")),
            owner=_as_str(data.get("owner")),
            doc_type=_as_str(data.get("type")),
            authority=_as_str(data.get("authority")),
        )


@dataclass
class Document:
    """A single documentation unit (usually one Markdown file)."""

    path: str  # relative path using forward slashes, relative to the SCAN root
    # (may be a --docs-scoped subtree; do not use for stable_id, see canonical_path)
    title: str
    content: str  # markdown body without frontmatter
    absolute_path: str
    metadata: DocumentationMetadata = field(default_factory=DocumentationMetadata)
    parent_path: str | None = None
    children: list[str] = field(default_factory=list)
    is_directory_index: bool = False
    content_hash: str = ""
    # Path relative to the config-declared documentation root (never the CLI
    # --docs override). Set by the repository provider. Falls back to `path`
    # only when the file lies outside every canonical root.
    canonical_path: str | None = None

    @property
    def stable_id(self) -> str:
        """Stable identity for Confluence mapping (prefer document id).

        The frontmatter-less fallback must stay identical whether this document
        was loaded via a full-tree sync or a --docs-scoped subtree sync, since
        both write into the same shared state file. Using the scan-relative
        `path` here would let two different files collide onto the same
        fallback id whenever a scoped run's root drops a shared prefix
        (e.g. both `README.md` at the doc root and `aiops-apps/README.md`
        reducing to `path:README.md` under a `--docs aiops-apps` scope).
        """
        if self.metadata.document_id:
            return self.metadata.document_id
        return f"path:{self.canonical_path or self.path}"


@dataclass
class DocumentationTree:
    """In-memory documentation model rooted at the docs source."""

    root_path: str
    documents: dict[str, Document] = field(default_factory=dict)  # path -> Document
    roots: list[str] = field(default_factory=list)  # top-level paths
    revision: str | None = None
    repository_url: str | None = None

    def get(self, path: str) -> Document | None:
        return self.documents.get(path)

    def iter_documents(self) -> list[Document]:
        return [self.documents[p] for p in sorted(self.documents)]


@dataclass
class ConfluencePageMapping:
    """How a Document maps onto a Confluence page (no HTTP)."""

    stable_id: str
    title: str
    parent_stable_id: str | None
    source_path: str
    labels: list[str] = field(default_factory=list)
    properties: dict[str, str] = field(default_factory=dict)
    body_storage: str = ""
    content_hash: str = ""


@dataclass
class SyncPlanItem:
    action: SyncAction
    mapping: ConfluencePageMapping
    message: str = ""
    confluence_page_id: str | None = None


@dataclass
class SyncPlan:
    items: list[SyncPlanItem] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)

    def counts(self) -> dict[str, int]:
        out: dict[str, int] = {}
        for item in self.items:
            out[item.action.value] = out.get(item.action.value, 0) + 1
        return out


@dataclass
class SyncError:
    path: str
    message: str
    action: SyncAction = SyncAction.FAILED


@dataclass
class SyncResult:
    created: int = 0
    updated: int = 0
    unchanged: int = 0
    skipped: int = 0
    failed: int = 0
    warnings: list[str] = field(default_factory=list)
    errors: list[SyncError] = field(default_factory=list)
    repository: str | None = None
    revision: str | None = None
    dry_run: bool = False

    def to_dict(self) -> dict[str, Any]:
        return {
            "repository": self.repository,
            "revision": self.revision,
            "dry_run": self.dry_run,
            "created": self.created,
            "updated": self.updated,
            "unchanged": self.unchanged,
            "skipped": self.skipped,
            "failed": self.failed,
            "warnings": list(self.warnings),
            "errors": [{"path": e.path, "message": e.message} for e in self.errors],
        }


def _as_str(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None
