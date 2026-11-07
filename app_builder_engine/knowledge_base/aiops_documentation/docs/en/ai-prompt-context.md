# AI Prompt Context

> Language: EN | [Português (pt-BR)](../pt-BR/ai-prompt-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How to assemble **prompt context** from documentation for an AI task — as a documentation practice, not a productized RAG pipeline.

## Context Pack Recipe

| Slot | Source | Notes |
| --- | --- | --- |
| 1 | [ai-context.md](ai-context.md) | Always |
| 2 | Task boundaries + safety | [ai-task-boundaries.md](ai-task-boundaries.md), [ai-context-safety.md](ai-context-safety.md) |
| 3 | Scoped overview | Context/Architecture Level 1–2 |
| 4 | Task-specific docs | Contract / Ops / Security as needed |
| 5 | Evidence excerpts | Paths cited, not entire repos dumped |
| 6 | Gaps / contradictions | Known unknowns |

## Assembly Rules

1. Prefer small, high-authority packs over large low-authority dumps.
2. Respect [chunking-guidelines.md](chunking-guidelines.md) context boundaries.
3. Include metadata (id, status, updated, classification defaults) when available.
4. Exclude secrets, credentials, and unnecessary PII.
5. Exclude Deprecated/Archived unless the task is historical.
6. State what was **not** loaded when material to confidence.

## Anti-Patterns

- Pasting the entire `docs/` tree
- Mixing Proposed roadmap docs as if ACCEPTED SoT
- Omitting safety rules to “save tokens”

## Related Documents

- [progressive-context.md](progressive-context.md)
- [search-readiness.md](search-readiness.md)
- [chunking-guidelines.md](chunking-guidelines.md)
- [ai-agent-entry.md](ai-agent-entry.md)
