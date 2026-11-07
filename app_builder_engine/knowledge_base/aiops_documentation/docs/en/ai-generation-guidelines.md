# AI Generation Guidelines

> Language: EN | [Português (pt-BR)](../pt-BR/ai-generation-guidelines.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How AI should generate documentation content under this standard.

## Style

- Follow [style-guide.md](style-guide.md) and [standards.md](standards.md)
- English for source documentation artifacts; retain English machine tokens
- Specific titles; shallow heading hierarchy
- Tables for inventories; lists for procedures

## Content

1. Ground every non-trivial claim in evidence or mark Unknown.
2. Use required metadata ([document-metadata.md](document-metadata.md)).
3. Prefer links to canonical docs over duplication.
4. Keep diagrams aligned with current state or label Proposed.
5. Use domain vocabularies already defined (drift, breaking changes, operational state, etc.).
6. Generate Incomplete Accurate pages rather than Complete Fiction.

## Structure Checklist

- Header language/status/standard block
- Purpose section early
- Explicit Unknown/Not applicable where empty
- Related Documents section with relative links
- No secrets in examples — placeholders only

## Related Documents

- [ai-documentation.md](ai-documentation.md)
- [ai-review.md](ai-review.md)
- [ai-documentation-anti-patterns.md](ai-documentation-anti-patterns.md)
