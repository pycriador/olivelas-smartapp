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

# Runbook: hybrid search degradation (illustrative)

> Language: EN | [Português](../../../pt-BR/docs/operations/rb-hybrid-search.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** — fictional symptoms and toggles.

## Symptoms

- Empty or irrelevant chat citations
- Latency spike on `/api/knowledge/search`
- Errors mentioning vector extension / embedding provider

## Immediate mitigation

1. Disable `HYBRID_SEARCH_ENABLED` → fall back to FTS only.
2. If still failing, disable `VECTOR_SEARCH_ENABLED`.
3. Confirm the FTS path returns hits for a known document.

**Classification:** Confirmed (within example playbook).

## Diagnosis checklist

| Check | Classification |
| --- | --- |
| Feature flags current values | Confirmed (within example) |
| Embedding backfill lag | Proposed (example only) |
| PostgreSQL FTS index health | Inferred |
| LLM / embedding provider status | Unknown (vendor) |

## Recovery

| Step | Action | Classification |
| --- | --- | --- |
| 1 | Restore FTS-only service | Confirmed (within example) |
| 2 | Re-enable vector on a canary group | Proposed (example only) |
| 3 | Re-enable hybrid after quality spot-check | Proposed (example only) |

## Related

- [feature-flags.md](feature-flags.md)
- [../application/knowledge-platform.md](../application/knowledge-platform.md)
