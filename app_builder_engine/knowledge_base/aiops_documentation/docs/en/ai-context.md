# AI Context

> Language: EN | [Português (pt-BR)](../pt-BR/ai-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

**Primary AI entry point** for this Documentation Standard. Agents and humans preparing AI prompts should start here, then follow links — do not load the entire corpus blindly.

This page is intentionally short. Details live in linked documents.

## Start

1. Read this file.
2. Apply [ai-navigation.md](ai-navigation.md).
3. Load only the depth required by the question ([progressive-context.md](progressive-context.md)).
4. Obey [ai-task-boundaries.md](ai-task-boundaries.md) and [ai-context-safety.md](ai-context-safety.md).

## Model Chain

```text
Context → Knowledge → Relationships → Evidence → Constraints → Actions
```

See [ai-ready-model.md](ai-ready-model.md).

## Level Hierarchy (0–6)

| Level | Focus | Load when |
| --- | --- | --- |
| **0** | This entry + navigation/safety rules | Always for AI work on docs |
| **1** | Project/system context & glossaries | “What is this system?” |
| **2** | Architecture & boundaries | Structure, components, dependencies |
| **3** | Contracts & interfaces | APIs, events, compatibility |
| **4** | Operations & reliability | Run, fail, recover |
| **5** | Security | Assets, threats, controls, secrets *references* |
| **6** | Evidence, drift, debt, history | Validation, contradictions, change impact |

Do not jump to Level 6 narrative without Levels 0–1 scope.

## Core Rule Pointers

| Need | Document |
| --- | --- |
| Answer questions | [ai-answering-rules.md](ai-answering-rules.md) |
| Change docs/code with doc impact | [ai-change-rules.md](ai-change-rules.md), [ai-documentation-workflow.md](ai-documentation-workflow.md) |
| Classify claims | [evidence-model.md](evidence-model.md) |
| Avoid secrets | [ai-context-safety.md](ai-context-safety.md) |
| Existing AI writing rules | [ai-documentation.md](ai-documentation.md) |
| Wire Cursor / Claude Code | [ai-agent-entry.md](ai-agent-entry.md) |

## Non-Goals

No RAG, embeddings, vector DB, MCP, search engine, or chatbot specification on this page.

## Related Documents

- [progressive-context.md](progressive-context.md)
- [ai-prompt-context.md](ai-prompt-context.md)
- [ai-agent-entry.md](ai-agent-entry.md)
- [manifest.yaml](manifest.yaml)
