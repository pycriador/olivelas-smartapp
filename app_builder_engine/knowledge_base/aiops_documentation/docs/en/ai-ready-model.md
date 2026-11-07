# AI-Ready Documentation Model

> Language: EN | [Português (pt-BR)](../pt-BR/ai-ready-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

The AI-ready model defines how documentation must be structured so humans and AI agents can use it as reliable engineering context — without inventing retrieval systems, embeddings, or chatbots.

This standard is **documentation only**. It does not require RAG, vector databases, MCP servers, search engines, or agent runtimes.

## Model Overview

```text
Context → Knowledge → Relationships → Evidence → Constraints → Actions
```

Each stage depends on the previous. Skipping a stage produces plausible but unsafe answers.

| Stage | Purpose | Primary docs |
| --- | --- | --- |
| **Context** | What system/problem; where to start | [ai-context.md](ai-context.md), [progressive-context.md](progressive-context.md) |
| **Knowledge** | Stable facts, inventories, typed docs | [document-types.md](document-types.md), registries |
| **Relationships** | How docs and components connect | [documentation-graph.md](documentation-graph.md), [document-relationships.md](document-relationships.md) |
| **Evidence** | What supports each claim | [evidence-model.md](evidence-model.md), [claims.md](claims.md) |
| **Constraints** | Authority, safety, task limits | [source-of-truth.md](source-of-truth.md), [ai-task-boundaries.md](ai-task-boundaries.md), [ai-context-safety.md](ai-context-safety.md) |
| **Actions** | How to answer, change, validate | [ai-answering-rules.md](ai-answering-rules.md), [ai-change-rules.md](ai-change-rules.md), [ai-documentation-workflow.md](ai-documentation-workflow.md) |

## Stage Details

### 1. Context

Establish scope before answering or editing:

- system / module under discussion;
- audience and depth ([progressive-context.md](progressive-context.md));
- entry document ([ai-context.md](ai-context.md));
- known gaps ([knowledge-gaps.md](knowledge-gaps.md)).

### 2. Knowledge

Represent facts in typed, identifiable documents with metadata ([document-metadata.md](document-metadata.md), [document-identity.md](document-identity.md)). Prefer machine-readable structure ([machine-readable.md](machine-readable.md)).

### 3. Relationships

Link documents and architectural units with a controlled vocabulary. Do not rely on prose alone for “related to X”.

### 4. Evidence

Every non-trivial claim needs a classification and, when Confirmed, a reference. Never promote Inferred to Confirmed without new authoritative evidence.

### 5. Constraints

Respect source-of-truth authority, lifecycle status, secret redaction, and task boundaries. Confidence is not status.

### 6. Actions

Apply answering, change, generation, review, and validation rules. Record contradictions and gaps instead of smoothing them away.

## Non-Goals

This model does **not** define:

- embedding pipelines or vector stores;
- RAG retrieval policies;
- chatbot UX;
- MCP tool wiring;
- automated search product requirements.

Those may consume AI-ready docs later; they are out of scope for Documentation Standard v1.0.

## Related Documents

- [ai-context.md](ai-context.md) — primary AI entry point
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [ai-documentation.md](ai-documentation.md) — existing AI generation rules 
- [principles.md](principles.md)
