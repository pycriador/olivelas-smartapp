"""docs-sync unit tests — parser."""

from docs_sync.parser import (
    content_hash,
    filename_to_title,
    markdown_to_storage_html,
    parse_frontmatter,
    resolve_page_title,
)
from docs_sync.models import DocumentationMetadata


def test_parse_frontmatter_and_title():
    text = """---
id: ARCH-001
title: System Context
status: ACCEPTED
---

# Ignored Heading

Body.
"""
    meta, body = parse_frontmatter(text)
    assert meta["id"] == "ARCH-001"
    assert "Ignored Heading" in body
    md = DocumentationMetadata.from_frontmatter(meta)
    title = resolve_page_title(metadata=md, body=body, path="architecture/system-context.md")
    assert title == "System Context"


def test_filename_to_title():
    assert filename_to_title("system-context.md") == "System Context"
    assert filename_to_title("api_contracts.md") == "Api Contracts"


def test_hash_stable():
    assert content_hash("a") == content_hash("a")
    assert content_hash("a") != content_hash("b")


def test_markdown_tables_and_code():
    html = markdown_to_storage_html(
        "# Title\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n`x`\n\n```python\nprint(1)\n```\n"
    )
    assert "<table" in html
    assert "confluenceTable" in html
    assert "confluenceTh" in html
    assert "<h1>" in html
    assert 'ac:name="code"' in html
    assert "print(1)" in html
    assert "<pre><code" not in html


def test_markdown_ascii_flow_uses_code_macro():
    html = markdown_to_storage_html("```text\nA → B → C\n```\n")
    assert 'ac:name="code"' in html
    assert "A → B → C" in html
    assert "<![CDATA[" in html
