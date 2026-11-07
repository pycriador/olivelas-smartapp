---
title: "Runbook — Hybrid search — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "RB-NS-HYBRID-001"
type: "runbook"
---

# Runbook: degradação de hybrid search (ilustrativo)

> Idioma: pt-BR | [English](../../../en/docs/operations/rb-hybrid-search.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — sintomas e toggles fictícios.

## Sintomas

- Citações de chat vazias ou irrelevantes
- Spike de latência em `/api/knowledge/search`
- Erros mencionando extensão vetorial / provedor de embedding

## Mitigação imediata

1. Desabilitar `HYBRID_SEARCH_ENABLED` → cair para FTS only.  
2. Se ainda falhar, desabilitar `VECTOR_SEARCH_ENABLED`.  
3. Confirmar que o caminho FTS retorna resultados para um documento conhecido.  

**Classification:** Confirmed (within example playbook).

## Checklist de diagnóstico

| Check | Classification |
| --- | --- |
| Feature flags current values | Confirmed (within example) |
| Embedding backfill lag | Proposed (example only) |
| PostgreSQL FTS index health | Inferred |
| LLM / embedding provider status | Unknown (vendor) |

## Recuperação

| Step | Action | Classification |
| --- | --- | --- |
| 1 | Restore FTS-only service | Confirmed (within example) |
| 2 | Re-enable vector on a canary group | Proposed (example only) |
| 3 | Re-enable hybrid after quality spot-check | Proposed (example only) |

## Relacionados

- [feature-flags.md](feature-flags.md)
- [../application/knowledge-platform.md](../application/knowledge-platform.md)
