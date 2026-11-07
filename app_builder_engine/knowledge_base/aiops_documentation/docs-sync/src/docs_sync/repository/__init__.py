"""Repository providers — local checkout first; GitHub API left for later."""

from __future__ import annotations

import fnmatch
import subprocess
from abc import ABC, abstractmethod
from pathlib import Path

from docs_sync.config import AppConfig
from docs_sync.models import DocumentationTree
from docs_sync.parser import parse_markdown_file


class RepositoryProvider(ABC):
    @abstractmethod
    def get_documents(self) -> DocumentationTree:
        raise NotImplementedError

    @abstractmethod
    def get_revision(self) -> str | None:
        raise NotImplementedError


class LocalRepositoryProvider(RepositoryProvider):
    """Load documentation from one or more local filesystem trees."""

    def __init__(self, config: AppConfig) -> None:
        self.config = config
        self.roots = config.docs_roots
        self.root = self.roots[0]
        self.canonical_roots = config.canonical_docs_roots

    def get_revision(self) -> str | None:
        try:
            result = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                cwd=self.root,
                check=False,
                capture_output=True,
                text=True,
            )
            if result.returncode == 0:
                return result.stdout.strip() or None
        except OSError:
            return None
        return None

    def get_documents(self) -> DocumentationTree:
        for root in self.roots:
            if not root.is_dir():
                raise FileNotFoundError(f"Documentation path not found: {root}")

        index_names = {n.lower() for n in self.config.documentation.index_filenames}
        display_root = (
            str(self.roots[0])
            if len(self.roots) == 1
            else ",".join(str(r) for r in self.roots)
        )
        tree = DocumentationTree(
            root_path=display_root,
            revision=self.get_revision(),
            repository_url=self.config.project.repository_url,
        )

        multi = len(self.roots) > 1
        for root in self.roots:
            prefix = f"{root.name}/" if multi else ""
            for path in sorted(root.rglob("*.md")):
                rel_in_root = path.relative_to(root).as_posix()
                if self._excluded(rel_in_root) or not self._included(rel_in_root):
                    continue
                rel = f"{prefix}{rel_in_root}"
                is_index = path.name.lower() in index_names
                doc = parse_markdown_file(
                    path, relative_path=rel, is_directory_index=is_index
                )
                doc.canonical_path = self._canonical_relative_path(path)
                if rel in tree.documents:
                    raise ValueError(
                        f"Duplicate documentation path after merge: {rel} "
                        f"(from {root})"
                    )
                tree.documents[rel] = doc

        self._wire_hierarchy(tree, index_names)
        return tree

    def _canonical_relative_path(self, absolute_path: Path) -> str | None:
        """Path relative to the config-declared documentation root(s), ignoring
        any --docs CLI override. Returns None if the file lies outside every
        canonical root (e.g. an override pointing at an unrelated directory),
        in which case callers fall back to the scan-relative path."""
        multi = len(self.canonical_roots) > 1
        for root in self.canonical_roots:
            try:
                rel_in_root = absolute_path.relative_to(root).as_posix()
            except ValueError:
                continue
            prefix = f"{root.name}/" if multi else ""
            return f"{prefix}{rel_in_root}"
        return None

    def _excluded(self, rel: str) -> bool:
        for pattern in self.config.documentation.exclude_globs:
            if self._match(rel, pattern):
                return True
        return False

    def _included(self, rel: str) -> bool:
        patterns = self.config.documentation.include_globs
        if not patterns:
            return True
        return any(self._match(rel, pattern) for pattern in patterns)

    @staticmethod
    def _match(rel: str, pattern: str) -> bool:
        normalized = pattern.lstrip("./")
        if fnmatch.fnmatch(rel, normalized):
            return True
        if fnmatch.fnmatch(rel, pattern.replace("**/", "")):
            return True
        return False

    def _wire_hierarchy(self, tree: DocumentationTree, index_names: set[str]) -> None:
        by_dir: dict[str, list[str]] = {}
        for path in tree.documents:
            parent = str(Path(path).parent).replace("\\", "/")
            if parent == ".":
                parent = ""
            by_dir.setdefault(parent, []).append(path)

        for path, doc in tree.documents.items():
            parent_dir = str(Path(path).parent).replace("\\", "/")
            if parent_dir == ".":
                parent_dir = ""
            if doc.is_directory_index:
                grand = str(Path(parent_dir).parent).replace("\\", "/") if parent_dir else ""
                if grand == ".":
                    grand = ""
                parent_index = self._find_index(by_dir.get(grand, []), index_names)
                if parent_index == path:
                    parent_index = None
                doc.parent_path = parent_index
            else:
                parent_index = self._find_index(by_dir.get(parent_dir, []), index_names)
                if parent_index == path:
                    parent_index = None
                doc.parent_path = parent_index

        for path, doc in tree.documents.items():
            if doc.parent_path and doc.parent_path in tree.documents:
                parent = tree.documents[doc.parent_path]
                if path not in parent.children:
                    parent.children.append(path)

        tree.roots = [p for p, d in tree.documents.items() if d.parent_path is None]

    @staticmethod
    def _find_index(paths: list[str], index_names: set[str]) -> str | None:
        for path in sorted(paths):
            if Path(path).name.lower() in index_names:
                return path
        return None


class GitHubRepositoryProvider(RepositoryProvider):
    """Placeholder for a future GitHub API-backed provider."""

    def get_documents(self) -> DocumentationTree:
        raise NotImplementedError(
            "GitHubRepositoryProvider is not implemented; clone locally and use LocalRepositoryProvider."
        )

    def get_revision(self) -> str | None:
        raise NotImplementedError(
            "GitHubRepositoryProvider is not implemented; clone locally and use LocalRepositoryProvider."
        )
