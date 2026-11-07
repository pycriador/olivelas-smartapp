"""Confluence link rewriting, relative-link safety, and blank-body checks."""

from __future__ import annotations

import re
import subprocess
from pathlib import Path, PurePosixPath
from urllib.parse import quote

FOOTER_RE = re.compile(
    r"<!--\s*docs-sync:footer:start\s*-->.*?<!--\s*docs-sync:footer:end\s*-->",
    re.S,
)
TAG_RE = re.compile(r"<[^>]+>")
CONFLUENCE_HREF_RE = re.compile(
    r'href=(["\'])confluence://([^"\']+)\1',
    re.I,
)
WHITESPACE_RE = re.compile(r"\s+")
MD_LINK_RE = re.compile(r"\[([^\]]*)\]\(([^)]+)\)")
# Bare relative Markdown paths that climb at least two parents (monorepo / out-of-tree smell).
BARE_REL_MD_RE = re.compile(
    r"(?<!\()(?<!\]\()(\.\./){2,}(?:[\w.-]+/)+[\w.-]+\.md\b"
)
FENCE_RE = re.compile(r"```.*?```", re.S)
INLINE_CODE_RE = re.compile(r"`[^`]+`")


def confluence_page_url(*, base_url: str, space_key: str, page_id: str, title: str = "") -> str:
    """Build a Confluence Cloud page URL."""
    base = base_url.rstrip("/")
    # Prefer id-based URL (stable even if title changes)
    path = f"/wiki/spaces/{quote(space_key)}/pages/{page_id}"
    if title:
        slug = quote(title.replace(" ", "+"), safe="+")
        return f"{base}{path}/{slug}"
    return f"{base}{path}"


def resolve_confluence_hrefs(
    html: str,
    *,
    stable_id_to_page_id: dict[str, str],
    base_url: str,
    space_key: str,
) -> tuple[str, int]:
    """
    Replace href=\"confluence://<stable_id>\" with real Confluence page URLs.
    Returns (html, unresolved_count).
    """
    unresolved = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal unresolved
        quote_char = match.group(1)
        stable_id = match.group(2).strip()
        page_id = stable_id_to_page_id.get(stable_id)
        if not page_id:
            unresolved += 1
            return match.group(0)
        url = confluence_page_url(
            base_url=base_url, space_key=space_key, page_id=page_id
        )
        return f"href={quote_char}{url}{quote_char}"

    return CONFLUENCE_HREF_RE.sub(repl, html), unresolved


def count_unresolved_confluence_hrefs(html: str) -> int:
    return len(CONFLUENCE_HREF_RE.findall(html))


def visible_text_length(html: str, *, ignore_footer: bool = True) -> int:
    body = FOOTER_RE.sub("", html) if ignore_footer else html
    text = TAG_RE.sub(" ", body)
    text = WHITESPACE_RE.sub("", text)
    return len(text)


def is_blank_storage(html: str, *, min_chars: int = 40) -> bool:
    """True when page body has little/no visible content (footer ignored)."""
    if not (html or "").strip():
        return True
    return visible_text_length(html) < min_chars


def is_empty_storage(html: str) -> bool:
    """True when there is no visible content at all (footer ignored)."""
    if not (html or "").strip():
        return True
    return visible_text_length(html) == 0


def split_href(href: str) -> tuple[str, str]:
    """Return (path_part, fragment_with_hash_or_empty)."""
    href = href.strip()
    if "#" in href:
        target, frag = href.split("#", 1)
        return target, f"#{frag}"
    return href, ""


def resolve_under_doc_root(document_path: str, href_target: str) -> str | None:
    """
    Resolve a relative href against document_path within the sync tree root.

    Returns a normalized posix path, or None if the link escapes above the tree root
    (e.g. ``../../knowledge/README.md`` from a pack root).
    """
    if not href_target or href_target.startswith(
        ("http://", "https://", "mailto:", "#", "confluence://")
    ):
        return None
    if "://" in href_target:
        return None
    base = PurePosixPath(document_path).parent
    raw = (base / href_target).as_posix()
    parts: list[str] = []
    for part in PurePosixPath(raw).parts:
        if part == "..":
            if not parts:
                return None
            parts.pop()
            continue
        if part in ("", "."):
            continue
        parts.append(part)
    return "/".join(parts)


def git_relative_path(absolute_path: str | Path) -> str | None:
    path = Path(absolute_path)
    try:
        cwd = path.parent if path.suffix or path.is_file() else path
        if not cwd.exists():
            cwd = path.parent
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            cwd=cwd,
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            return None
        root = Path(result.stdout.strip())
        return path.resolve().relative_to(root).as_posix()
    except (OSError, ValueError):
        return None


def github_blob_url(repository_url: str, repo_relative_path: str, fragment: str = "") -> str:
    repo = repository_url.rstrip("/")
    return f"{repo}/blob/main/{repo_relative_path}{fragment}"


def strip_code_for_link_scan(text: str) -> str:
    text = FENCE_RE.sub("", text)
    text = INLINE_CODE_RE.sub("", text)
    return text


def find_bare_relative_md_paths(text: str) -> list[str]:
    """Find ``../../pkg/README.md``-style paths written as prose, not as link targets."""
    cleaned = strip_code_for_link_scan(text)
    # Drop entire markdown links (label may equal the path).
    cleaned = MD_LINK_RE.sub(" ", cleaned)
    return [m.group(0) for m in BARE_REL_MD_RE.finditer(cleaned)]


def iter_relative_file_hrefs(markdown: str) -> list[tuple[str, str, str]]:
    """
    Yield (link_text, href_target, fragment) for relative file links in markdown.

    Skips absolute URLs, mailto, anchors-only, and confluence://.
    """
    body = strip_code_for_link_scan(markdown)
    out: list[tuple[str, str, str]] = []
    for match in MD_LINK_RE.finditer(body):
        text, href = match.group(1), match.group(2).strip()
        if href.startswith(("http://", "https://", "mailto:", "#", "confluence://")):
            continue
        if "://" in href:
            continue
        target, fragment = split_href(href)
        if not target:
            continue
        out.append((text, target, fragment))
    return out
