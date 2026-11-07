# Search Readiness

> Language: EN | [Português (pt-BR)](../pt-BR/search-readiness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Prepare documentation so it **can** be indexed or searched later. This standard does **not** implement RAG, embeddings, vector databases, or a search engine.

## Readiness Criteria

| Criterion | Why it helps indexing |
| --- | --- |
| Stable `id` + title | Unique keys |
| Explicit `type` + tags | Filtering |
| First-paragraph purpose | Snippets |
| Predictable headings | Section anchors |
| Tables for inventories | Structured extraction |
| Relative links | Graph crawl |
| Manifest entries | Seed URL/path list |
| Redacted secrets | Safe indexing |

## Authoring Practices

1. Put critical facts in headings/tables, not only in buried prose.
2. Avoid ambiguous pronouns without antecedents in key claims.
3. Declare synonyms in glossary entries when needed.
4. Keep one primary topic per document when feasible ([chunking-guidelines.md](chunking-guidelines.md)).

## Explicit Non-Goals

- No embedding model choice
- No chunker implementation
- No retrieval evaluation harness
- No chatbot ranking policy

## Related Documents

- [manifest-rules.md](manifest-rules.md)
- [machine-readable.md](machine-readable.md)
- [chunking-guidelines.md](chunking-guidelines.md)
