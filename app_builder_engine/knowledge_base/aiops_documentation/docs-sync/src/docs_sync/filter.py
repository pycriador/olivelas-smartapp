"""Filter documentation trees for scoped sync (--only)."""

from __future__ import annotations

import fnmatch
from typing import Sequence

from docs_sync.models import DocumentationTree


def filter_tree_by_only(tree: DocumentationTree, only: Sequence[str]) -> DocumentationTree:
    """Keep documents matching any --only needle plus ancestor index pages."""
    needles = [n.strip() for n in only if n.strip()]
    if not needles:
        return tree

    selected: set[str] = set()
    for needle in needles:
        matched = False
        for path, doc in tree.documents.items():
            if _matches(doc.stable_id, path, needle):
                matched = True
                selected.add(path)
                _add_ancestors(tree, path, selected)
        if not matched and needle.startswith("path:"):
            # Allow explicit path: stable_id form when file missing id frontmatter
            rel = needle.removeprefix("path:")
            if rel in tree.documents:
                selected.add(rel)
                _add_ancestors(tree, rel, selected)
                matched = True
        if not matched:
            raise ValueError(f"No document matched --only {needle!r}")

    new_docs = {p: tree.documents[p] for p in selected}
    for path, doc in new_docs.items():
        doc.children = [c for c in doc.children if c in new_docs]

    filtered = DocumentationTree(
        root_path=tree.root_path,
        documents=new_docs,
        revision=tree.revision,
        repository_url=tree.repository_url,
    )
    filtered.roots = [p for p, d in new_docs.items() if d.parent_path is None]
    return filtered


def _matches(stable_id: str, path: str, needle: str) -> bool:
    if stable_id == needle or path == needle:
        return True
    if path.endswith("/" + needle) or path.endswith(needle):
        return True
    return fnmatch.fnmatch(path, needle)


def _add_ancestors(tree: DocumentationTree, path: str, selected: set[str]) -> None:
    visited: set[str] = set()
    parent = tree.documents[path].parent_path
    while parent and parent in tree.documents and parent not in visited:
        visited.add(parent)
        selected.add(parent)
        parent = tree.documents[parent].parent_path
