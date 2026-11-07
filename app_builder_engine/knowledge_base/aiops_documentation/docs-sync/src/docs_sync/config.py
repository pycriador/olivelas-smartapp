"""Configuration loading with env-var expansion (no secrets in files)."""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Sequence

import yaml

_ENV_PATTERN = re.compile(r"\$\{([A-Za-z_][A-Za-z0-9_]*)\}")


@dataclass
class ConfluenceConfig:
    url: str = ""
    space: str = ""
    username: str = ""
    api_token: str = ""
    api_profile: str = "cloud"  # cloud | datacenter (isolated adapter choice)
    root_page_title: str = "Project Documentation"
    # Parent page OR folder id (Confluence Cloud folders work as ancestors)
    root_page_id: str | None = None
    verify_ssl: bool = True


@dataclass
class DocumentationConfig:
    """Local Markdown source(s) to publish."""

    path: str = "./docs"
    # Optional extra roots (merged). CLI --docs overrides path + paths.
    paths: list[str] = field(default_factory=list)
    language: str | None = None  # e.g. "pt-BR" when docs/pt-BR is the source
    exclude_globs: list[str] = field(default_factory=lambda: ["**/generated/**", "**/.git/**"])
    # When non-empty, only paths matching at least one pattern are included
    include_globs: list[str] = field(default_factory=list)
    index_filenames: list[str] = field(default_factory=lambda: ["README.md", "index.md"])


@dataclass
class SyncConfig:
    dry_run: bool = False
    create_missing: bool = True
    update_existing: bool = True
    archive_removed: bool = False
    include_footer: bool = True
    managed_by: str = "docs-sync"
    labels: list[str] = field(
        default_factory=lambda: ["documentation", "managed-by-docs-sync"]
    )
    # Local stable_id → page_id map for fast incremental sync (gitignored)
    state_file: str | None = ".docs-sync-state.json"


@dataclass
class ProjectConfig:
    name: str = "project"
    repository_url: str | None = None


@dataclass
class AppConfig:
    project: ProjectConfig = field(default_factory=ProjectConfig)
    confluence: ConfluenceConfig = field(default_factory=ConfluenceConfig)
    documentation: DocumentationConfig = field(default_factory=DocumentationConfig)
    sync: SyncConfig = field(default_factory=SyncConfig)
    config_path: Path | None = None
    # Snapshot of `documentation` as declared in the config file, taken before any
    # CLI `--docs` override mutates `documentation.path`/`paths`. Frontmatter-less
    # documents derive their fallback stable_id from this root so it stays the
    # same regardless of how narrowly a given invocation scopes `--docs`.
    canonical_documentation: DocumentationConfig | None = None

    def __post_init__(self) -> None:
        if self.canonical_documentation is None:
            self.canonical_documentation = DocumentationConfig(
                path=self.documentation.path,
                paths=list(self.documentation.paths),
            )

    @property
    def docs_root(self) -> Path:
        """Primary documentation root (first of docs_roots)."""
        return self.docs_roots[0]

    @property
    def docs_roots(self) -> list[Path]:
        return self._resolve_roots(self.documentation)

    @property
    def canonical_docs_roots(self) -> list[Path]:
        """Documentation root(s) as declared in the config file, unaffected by
        `--docs` CLI overrides. Use this (not `docs_roots`) to compute any
        identity that must be stable across scoped and full-tree invocations."""
        assert self.canonical_documentation is not None
        return self._resolve_roots(self.canonical_documentation)

    def _resolve_roots(self, documentation: DocumentationConfig) -> list[Path]:
        raw_paths: list[str] = []
        if documentation.paths:
            raw_paths.extend(documentation.paths)
        elif documentation.path:
            raw_paths.append(documentation.path)
        if not raw_paths:
            raw_paths = ["./docs"]
        return [self._resolve_docs_path(p) for p in raw_paths]

    def _resolve_docs_path(self, value: str) -> Path:
        path = Path(value)
        if path.is_absolute():
            return path.resolve()
        base = self.config_path.parent if self.config_path else Path.cwd()
        return (base / path).resolve()


def apply_cli_overrides(
    config: AppConfig,
    *,
    docs: Sequence[str] | None = None,
    root_page_id: str | None = None,
    space: str | None = None,
    include: Sequence[str] | None = None,
    language: str | None = None,
) -> AppConfig:
    """Apply CLI overrides onto a loaded config (mutates and returns config)."""
    if docs:
        config.documentation.path = docs[0]
        config.documentation.paths = list(docs)
    if root_page_id:
        config.confluence.root_page_id = str(root_page_id).strip() or None
    if space:
        config.confluence.space = space.strip()
    if include:
        config.documentation.include_globs = list(include)
    if language:
        config.documentation.language = language
    return config


def expand_env(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: expand_env(v) for k, v in value.items()}
    if isinstance(value, list):
        return [expand_env(v) for v in value]
    if isinstance(value, str):

        def repl(match: re.Match[str]) -> str:
            return os.environ.get(match.group(1), "")

        return _ENV_PATTERN.sub(repl, value)
    return value


def load_config(path: str | Path) -> AppConfig:
    config_path = Path(path).resolve()
    if not config_path.is_file():
        raise FileNotFoundError(f"Config not found: {config_path}")
    raw = yaml.safe_load(config_path.read_text(encoding="utf-8")) or {}
    raw = expand_env(raw)

    project_raw = raw.get("project") or {}
    conf_raw = raw.get("confluence") or {}
    docs_raw = raw.get("documentation") or {}
    sync_raw = raw.get("sync") or {}

    paths_raw = docs_raw.get("paths") or []
    if isinstance(paths_raw, str):
        paths_raw = [paths_raw]
    paths = [str(p) for p in paths_raw if str(p).strip()]

    # Prefer explicit config values; fall back to environment names from the sprint
    confluence = ConfluenceConfig(
        url=str(conf_raw.get("url") or os.environ.get("CONFLUENCE_URL") or "").rstrip("/"),
        space=str(conf_raw.get("space") or os.environ.get("CONFLUENCE_SPACE") or ""),
        username=str(conf_raw.get("username") or os.environ.get("CONFLUENCE_USERNAME") or ""),
        api_token=str(conf_raw.get("api_token") or os.environ.get("CONFLUENCE_API_TOKEN") or ""),
        api_profile=str(conf_raw.get("api_profile") or "cloud"),
        root_page_title=str(
            conf_raw.get("root_page")
            or conf_raw.get("root_page_title")
            or "Project Documentation"
        ),
        root_page_id=_optional_str(
            conf_raw.get("root_page_id") or os.environ.get("CONFLUENCE_ROOT_PAGE_ID")
        ),
        verify_ssl=_as_bool(
            conf_raw.get("verify_ssl", os.environ.get("CONFLUENCE_VERIFY_SSL", "true")),
            default=True,
        ),
    )
    documentation = DocumentationConfig(
        path=str(docs_raw.get("path") or docs_raw.get("source") or "./docs"),
        paths=paths,
        language=_optional_str(docs_raw.get("language")),
        exclude_globs=list(docs_raw.get("exclude_globs") or DocumentationConfig().exclude_globs),
        include_globs=list(docs_raw.get("include_globs") or []),
        index_filenames=list(
            docs_raw.get("index_filenames") or DocumentationConfig().index_filenames
        ),
    )
    sync = SyncConfig(
        dry_run=bool(sync_raw.get("dry_run", False)),
        create_missing=bool(sync_raw.get("create_missing", True)),
        update_existing=bool(sync_raw.get("update_existing", True)),
        archive_removed=bool(sync_raw.get("archive_removed", False)),
        include_footer=bool(sync_raw.get("include_footer", True)),
        managed_by=str(sync_raw.get("managed_by") or "docs-sync"),
        labels=list(sync_raw.get("labels") or SyncConfig().labels),
        state_file=_optional_str(
            sync_raw.get("state_file")
            if "state_file" in sync_raw
            else ".docs-sync-state.json"
        ),
    )
    project = ProjectConfig(
        name=str(project_raw.get("name") or "project"),
        repository_url=_optional_str(project_raw.get("repository_url")),
    )
    return AppConfig(
        project=project,
        confluence=confluence,
        documentation=documentation,
        sync=sync,
        config_path=config_path,
    )


def _optional_str(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _as_bool(value: Any, *, default: bool = False) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "on"}
