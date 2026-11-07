---
title: "AI Task Context: notify-bridge retry question (Fictional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "AITASK-NB-001"
type: "Context"
---

# AI Task Context

> Language: EN | [Português (pt-BR)](../pt-BR/ai-task-context.md)
>
> **Fictional example — not a real project.**

Assemble a **prompt context pack** for one scoped AI task. Documentation practice only — not a RAG product.

Policy: [ai-prompt-context.md](../../../docs/en/ai-prompt-context.md), [progressive-context.md](../../../docs/en/progressive-context.md), [ai-context.md](../../../docs/en/ai-context.md).

## Task

| Field | Value |
| --- | --- |
| Task ID | AITASK-NB-001 |
| Question | How many times does notify-bridge retry a failed delivery before DLQ? |
| Task type | Answer / Analysis |
| Allowed actions | Read docs; cite evidence; report gaps/contradictions |
| Not allowed | Invent configs; expose secrets; set ACCEPTED |

## Scope

| Field | Value |
| --- | --- |
| System | notify-bridge (fictional) |
| Environment | Example / non-production |
| Timeframe | Current |
| Depth target | Evidence (stop when claim answered) |

## Context Pack

| Slot | Document ID / path | Why included |
| --- | --- | --- |
| 1 | `docs/en/ai-context.md` | Primary AI entry |
| 2 | `docs/en/ai-task-boundaries.md` + `ai-context-safety.md` | Boundaries + safety |
| 3 | ARCH-NB-001 | System overview |
| 4 | CMP-NB-001 | Component behavior |
| 5 | CLAIM-NB-001 | Confirmed retry claim + evidence |
| 6 | CONTRA-NB-001 + GAP-NB-001 | Open conflict + retention Unknown |

## Explicitly Not Loaded

| Item | Reason |
| --- | --- |
| Full `docs/` tree | Progressive context — unnecessary |
| Secret store values | Safety — reference names only |
| Legacy ops note body | Loaded only as contradiction pointer |

## Expected Answer Shape

1. State **3** retries with Confirmed classification and citations to CLAIM-NB-001 evidence.
2. Mention open contradiction CONTRA-NB-001 (legacy “5 retries”).
3. Say DLQ retention is Unknown (GAP-NB-001).
4. Do not invent broker settings or secret values.

## Audit

| Field | Value |
| --- | --- |
| Assembled by | human (example) |
| Assembled on | 2026-08-07 |
| Reviewer | example-platform-team |
