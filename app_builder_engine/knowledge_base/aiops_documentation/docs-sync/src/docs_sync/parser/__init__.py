"""Markdown and metadata parsing (no Confluence knowledge)."""

from __future__ import annotations

import hashlib
import html as html_lib
import re
from pathlib import Path
from typing import Any
from xml.sax.saxutils import escape as xml_escape

import markdown
import yaml
from markdown.extensions.fenced_code import FencedCodeExtension
from markdown.extensions.tables import TableExtension

from docs_sync.models import DocumentationMetadata, Document

FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n?", re.S)
HEADING_RE = re.compile(r"^#\s+(.+?)\s*$", re.M)

# Convert standard HTML fenced blocks into Confluence storage code macros.
_PRE_CODE_RE = re.compile(
    r"<pre><code(?:\s+class=\"language-([^\"]+)\")?>(.*?)</code></pre>",
    re.S,
)

# Languages Confluence code macro commonly recognizes.
_CODE_LANG_ALIASES = {
    "text": "none",
    "plaintext": "none",
    "txt": "none",
    "shell": "bash",
    "sh": "bash",
    "zsh": "bash",
    "console": "bash",
    "yml": "yaml",
    "md": "none",
    "markdown": "none",
    "dockerfile": "bash",
    "hcl": "none",
    "tf": "none",
}


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text
    try:
        data = yaml.safe_load(match.group(1)) or {}
    except yaml.YAMLError:
        data = {}
    if not isinstance(data, dict):
        data = {}
    body = text[match.end() :]
    return data, body


def extract_markdown_title(body: str) -> str | None:
    match = HEADING_RE.search(body)
    if not match:
        return None
    return match.group(1).strip() or None


def filename_to_title(filename: str) -> str:
    stem = Path(filename).stem
    if stem.lower() in {"readme", "index"}:
        return Path(filename).parent.name.replace("-", " ").replace("_", " ").title() or "Index"
    parts = re.split(r"[-_]+", stem)
    return " ".join(p.capitalize() for p in parts if p)


def resolve_page_title(
    *,
    metadata: DocumentationMetadata,
    body: str,
    path: str,
    is_directory_index: bool = False,
) -> str:
    if metadata.title:
        return metadata.title
    md_title = extract_markdown_title(body)
    if md_title:
        return md_title
    if is_directory_index:
        parent = Path(path).parent.name
        if parent and parent not in {".", ""}:
            return filename_to_title(parent + ".md")
    return filename_to_title(Path(path).name)


def content_hash(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def _cdata(text: str) -> str:
    """Wrap text for Confluence plain-text-body (escape CDATA terminators)."""
    safe = text.replace("]]>", "]]]]><![CDATA[>")
    return f"<![CDATA[{safe}]]>"


def _unescape_html_text(text: str) -> str:
    return html_lib.unescape(text)


def _confluence_code_macro(language: str | None, body: str) -> str:
    lang = (language or "none").strip().lower()
    lang = _CODE_LANG_ALIASES.get(lang, lang) or "none"
    params = [f'<ac:parameter ac:name="language">{xml_escape(lang)}</ac:parameter>']
    inner = "".join(params) + f"<ac:plain-text-body>{_cdata(body)}</ac:plain-text-body>"
    return (
        '<ac:structured-macro ac:name="code" ac:schema-version="1">'
        f"{inner}"
        "</ac:structured-macro>"
    )


def _upgrade_fenced_blocks_to_code_macros(html: str) -> str:
    def repl(match: re.Match[str]) -> str:
        language = match.group(1)
        body = _unescape_html_text(match.group(2))
        if body.endswith("\n"):
            body = body[:-1]
        return _confluence_code_macro(language, body)

    return _PRE_CODE_RE.sub(repl, html)


def _normalize_tables(html: str) -> str:
    """Keep HTML tables; add Confluence-friendly classes for rendering."""
    return (
        html.replace("<table>", '<table class="wrapped relative-table confluenceTable">')
        .replace("<th>", '<th class="confluenceTh">')
        .replace("<td>", '<td class="confluenceTd">')
    )


def markdown_to_storage_html(md_text: str) -> str:
    """Convert Markdown to Confluence storage HTML (tables, code macros, lists)."""
    html = markdown.markdown(
        md_text,
        extensions=[
            "extra",
            "sane_lists",
            FencedCodeExtension(),
            TableExtension(),
            "nl2br",
        ],
        output_format="html",
    )
    html = _upgrade_fenced_blocks_to_code_macros(html)
    html = _normalize_tables(html)
    return html


def parse_markdown_file(
    absolute_path: Path,
    *,
    relative_path: str,
    is_directory_index: bool = False,
) -> Document:
    text = absolute_path.read_text(encoding="utf-8")
    meta_raw, body = parse_frontmatter(text)
    metadata = DocumentationMetadata.from_frontmatter(meta_raw)
    title = resolve_page_title(
        metadata=metadata,
        body=body,
        path=relative_path,
        is_directory_index=is_directory_index,
    )
    hashed = content_hash(body.strip() + "\n" + title)
    return Document(
        path=relative_path.replace("\\", "/"),
        title=title,
        content=body,
        absolute_path=str(absolute_path),
        metadata=metadata,
        is_directory_index=is_directory_index,
        content_hash=hashed,
    )
