#!/usr/bin/env python3
"""Minimal documentation checks for Engineering Documentation Standard adopters.

Optional starter — not the full framework validation suite.
Exit codes: 0 ok, 1 validation errors, 2 usage error.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED_FM = ("title", "status", "owner", "updated")
FM_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--docs-root", default="docs", help="Docs root (default: docs)")
    return p.parse_args()


def frontmatter_fields(text: str) -> dict[str, str]:
    m = FM_RE.match(text)
    if not m:
        return {}
    fields: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.strip().startswith("#"):
            key, _, val = line.partition(":")
            fields[key.strip()] = val.strip().strip('"').strip("'")
    return fields


def language_trees(root: Path) -> list[Path]:
    trees = []
    for name in ("en", "pt-BR"):
        candidate = root / name
        if candidate.is_dir():
            trees.append(candidate)
    return trees


def file_set(tree: Path) -> set[str]:
    return {p.relative_to(tree).as_posix() for p in tree.rglob("*") if p.is_file()}


def check_parity(trees: list[Path], errors: list[str]) -> None:
    if len(trees) < 2:
        return
    a, b = trees[0], trees[1]
    sa, sb = file_set(a), file_set(b)
    only_a = sorted(sa - sb)
    only_b = sorted(sb - sa)
    for rel in only_a:
        errors.append(f"parity: present in {a.name}/ missing in {b.name}/: {rel}")
    for rel in only_b:
        errors.append(f"parity: present in {b.name}/ missing in {a.name}/: {rel}")


def check_frontmatter(root: Path, errors: list[str]) -> None:
    for path in root.rglob("*.md"):
        if path.name.lower() == "readme.md" and path.parent == root:
            continue
        text = path.read_text(encoding="utf-8")
        # Skip tiny chooser readmes without frontmatter under language roots
        if path.name == "README.md" and "Language:" in text[:500] and not text.startswith("---"):
            continue
        fields = frontmatter_fields(text)
        if not fields:
            # Allow example root readmes without FM
            if path.name == "README.md":
                continue
            errors.append(f"frontmatter: missing in {path}")
            continue
        for key in REQUIRED_FM:
            if key not in fields or not fields[key]:
                errors.append(f"frontmatter: {path} missing `{key}`")


def check_links(root: Path, errors: list[str]) -> None:
    for path in root.rglob("*.md"):
        text = path.read_text(encoding="utf-8")
        for match in LINK_RE.finditer(text):
            target = match.group(1).strip()
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            clean = target.split("#", 1)[0].split("?", 1)[0]
            if not clean:
                continue
            resolved = (path.parent / clean).resolve()
            try:
                resolved.relative_to(root.resolve())
            except ValueError:
                # Link escapes docs root — skip
                continue
            if not resolved.exists():
                errors.append(f"link: {path} -> {target}")


def main() -> int:
    args = parse_args()
    root = Path(args.docs_root)
    if not root.is_dir():
        print(f"usage error: docs root not found: {root}", file=sys.stderr)
        return 2
    errors: list[str] = []
    trees = language_trees(root)
    if trees:
        check_parity(trees, errors)
        for tree in trees:
            check_frontmatter(tree, errors)
            check_links(tree, errors)
    else:
        check_frontmatter(root, errors)
        check_links(root, errors)
    if errors:
        print(f"adopter_docs_check: {len(errors)} issue(s)")
        for err in errors:
            print(f"  - {err}")
        return 1
    print("adopter_docs_check: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
