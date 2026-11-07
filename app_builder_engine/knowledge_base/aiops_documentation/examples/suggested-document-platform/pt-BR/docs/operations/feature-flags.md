---
title: "Feature flags — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "OPS-NS-FF-001"
type: "operations"
---

# Feature flags (ilustrativas)

> Idioma: pt-BR | [English](../../../en/docs/operations/feature-flags.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — nomes de flags são fictícios.

## Propósito

Documentar toggles de runtime que alteram o comportamento da Northstar sem redeploy da lógica (env ou remote config — específico da org).

## Flags

| Flag | Default | Effect | Classification |
| --- | --- | --- | --- |
| `VECTOR_SEARCH_ENABLED` | `false` | Enables optional vector retrieval | Proposed (example only) |
| `HYBRID_SEARCH_ENABLED` | `false` | Fuse FTS + vector | Proposed (example only) |
| `SLACK_BRIDGE_ENABLED` | `false` | Allow slack-worker to process events | Proposed (example only) |
| `SCHEDULER_ENABLED` | `false` | Allow scheduler-worker jobs | Proposed (example only) |
| `EXTERNAL_API_ENABLED` | `true` | Serve `/external/*` | Confirmed (within example) |

## Controle de mudança

| Topic | Guidance | Classification |
| --- | --- | --- |
| Who flips flags | example-team / on-call | Proposed (example only) |
| Audit | Prefer structured log of flag evaluation | Inferred |
| Rollback | Disable vector/hybrid first if search degrades | Confirmed (within example) |

## Relacionados

- [rb-hybrid-search.md](rb-hybrid-search.md)
- [../application/knowledge-platform.md](../application/knowledge-platform.md)
