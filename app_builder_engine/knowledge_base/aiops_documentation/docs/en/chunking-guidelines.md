# Chunking Guidelines

> Language: EN | [Português (pt-BR)](../pt-BR/chunking-guidelines.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Guidance for splitting documentation into logical units suitable for reading and for *future* indexing. No RAG implementation is specified.

## Prefer Document-Native Chunks

| Unit | Use when |
| --- | --- |
| Whole document | Short Reference/Context pages |
| `##` section | Medium docs with distinct topics |
| Table row / claim | Inventories and evidence maps |
| Runbook procedure step group | Operational procedures |

## Context Boundaries

Respect boundaries — do not merge across them blindly:

1. **Lifecycle** — DRAFT vs ACCEPTED vs DEPRECATED
2. **Time** — Historical vs Current ([history-model.md](history-model.md))
3. **Classification** — Confirmed vs Inferred vs Proposed
4. **Authority** — Authoritative vs Informational
5. **Safety** — Secret references vs public config
6. **Domain** — Architecture vs Contract vs Ops vs Security unless the section is explicitly cross-cutting

## Rules

- Do not split mid-table without repeating the header elsewhere.
- Keep claim + evidence reference in the same chunk when possible.
- Preserve document `id` and section heading in any derived excerpt metadata.
- Proposed content must remain labeled if chunked separately.

## Related Documents

- [search-readiness.md](search-readiness.md)
- [ai-prompt-context.md](ai-prompt-context.md)
- [progressive-context.md](progressive-context.md)
