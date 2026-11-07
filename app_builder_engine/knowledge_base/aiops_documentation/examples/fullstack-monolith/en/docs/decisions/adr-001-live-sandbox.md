---
title: "ADR-001 — Live/Sandbox modes (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# ADR-001 — Live / Sandbox

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/decisions/adr-001-live-sandbox.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / Fictional example.**

## Status
Accepted (within fictional example) — document lifecycle stays `DRAFT`.

## Context
UI needs exploration/demo without the database, and real operation against the API.

## Decision
Keep two client modes:
- **Live** — API + persistence
- **Sandbox** — local state with seed/mock

## Consequences
| Positive | Negative |
| --- | --- |
| Fast offline demos | Risk of Live vs Sandbox divergence |
| Visual onboarding | Real RBAC tests require Live |

## Alternatives
| Alternative | Notes | Classification |
| --- | --- | --- |
| Live only | Simpler; loses demos | Inferred |
| Server-side feature flags | Not in the example | Unknown |

## Related
[../application/sandbox-live.md](../application/sandbox-live.md)

