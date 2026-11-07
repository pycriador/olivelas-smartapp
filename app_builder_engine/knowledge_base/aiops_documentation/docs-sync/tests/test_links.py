"""Link resolution and blank-body helpers."""

from docs_sync.links import (
    count_unresolved_confluence_hrefs,
    is_blank_storage,
    resolve_confluence_hrefs,
)


def test_resolve_confluence_hrefs():
    html = '<p><a href="confluence://ARCH-001">Context</a></p>'
    out, unresolved = resolve_confluence_hrefs(
        html,
        stable_id_to_page_id={"ARCH-001": "42"},
        base_url="https://example.atlassian.net",
        space_key="AIOps",
    )
    assert unresolved == 0
    assert "confluence://" not in out
    assert "/wiki/spaces/AIOps/pages/42" in out
    assert count_unresolved_confluence_hrefs(out) == 0


def test_unresolved_links_counted():
    html = '<a href="confluence://MISSING">x</a>'
    out, unresolved = resolve_confluence_hrefs(
        html,
        stable_id_to_page_id={},
        base_url="https://example.atlassian.net",
        space_key="AIOps",
    )
    assert unresolved == 1
    assert "confluence://MISSING" in out


def test_blank_storage_ignores_footer():
    html = """
    <!-- docs-sync:footer:start -->
    <hr/><p>managed</p>
    <!-- docs-sync:footer:end -->
    """
    assert is_blank_storage(html)
    assert not is_blank_storage("<p>" + ("word " * 30) + "</p>")
