---
title: "Knowledge Gap: notify-bridge DLQ retention (Fictional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "GAP-NB-001"
type: "Evidence"
---

# Knowledge Gap

> Language: EN | [Português (pt-BR)](../pt-BR/knowledge-gap.md)
>
> **Fictional example — not a real project.**

## ID

| Field | Value |
| --- | --- |
| Gap ID | GAP-NB-001 |
| Status | Open |
| Owner | example-platform-team |
| Priority | Medium |

## Gap

| Field | Value |
| --- | --- |
| Kind | Unknown |
| Topic | Dead-letter queue retention |
| Question that cannot be answered safely | How long are exhausted notify-bridge deliveries retained in the DLQ? |

## Context

| Field | Value |
| --- | --- |
| Document / component / system | CMP-NB-001 / notify-bridge |
| Blocking for | AI answer / Operations |
| Related claims | CLAIM-NB-001 (retries known; retention not) |

## What Was Checked

| Source | Result |
| --- | --- |
| Code / config | Incomplete — no retention constant found in sample paths |
| Ops docs | Not found |
| People | Not checked |

## Assumption (if Kind = Assumed)

| Field | Value |
| --- | --- |
| Assumption statement | — |
| Risk if wrong | — |
| Must verify by | — |

## Closure Criteria

Authoritative config or broker policy documenting retention duration, cited from a durable path or ticket; update CMP-NB-001 Data section.

## Resolution

| Field | Value |
| --- | --- |
| Outcome | |
| Closed on | |
| Resulting docs / claims | |
