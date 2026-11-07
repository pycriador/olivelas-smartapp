---
title: "AI context — Northstar Document Platform"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "AI-NS-001"
type: "ai-context"
---

# AI context — Northstar Document Platform (Fictional)

> Language: EN | [Português](../../pt-BR/docs/ai-context.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** example — **NOT** the documentation standard nor a platform mandate.

## How agents should use this package

1. Start at [project-overview.md](project-overview.md) for purpose, scope, and the non-normative stack card.
2. Treat every technology choice as **example-only** unless confirmed in the adopter’s real repository.
3. Prefer Classification labels: **Confirmed** (within the example fiction), **Inferred**, **Unknown**, **Proposed**.
4. Never invent real hostnames, vault paths, credentials, or production URLs. Use placeholders.

## System one-liner

Northstar is a fictional document-intelligence platform: SSR BFF + Flask API + dual-schema PostgreSQL + optional Slack/scheduler workers + knowledge/RAG subsystem.

## High-value entry points

| Need | Document |
| --- | --- |
| Topology | [architecture/overview.md](architecture/overview.md) |
| Actors and trust | [architecture/system-context.md](architecture/system-context.md) |
| Schemas / entities | [architecture/data-model.md](architecture/data-model.md) |
| HTTP surface | [contracts/http-api.md](contracts/http-api.md) |
| External tokens | [contracts/external-api.md](contracts/external-api.md) |
| Why SSR BFF | [decisions/adr-001-ssr-bff.md](decisions/adr-001-ssr-bff.md) |
| Why Slack worker | [decisions/adr-002-slack-socket-worker.md](decisions/adr-002-slack-socket-worker.md) |
| Hybrid search ops | [operations/rb-hybrid-search.md](operations/rb-hybrid-search.md) |

## Safe assumptions for agents

| Assumption | Classification |
| --- | --- |
| Browser never talks to DB / LLM / Drive directly | Confirmed (within example) |
| Workers share the API image | Confirmed (within example) |
| Secrets via env or Vault path placeholder | Proposed (example only) |
| Vector search optional behind a feature flag | Proposed (example only) |
| Real SLO numbers / incident history | Unknown |

## Out of scope for agents

- Treating this tree as normative for the Olivelas Documentation Standard
- Copying the illustrative stack into production without org review
- Using fictional names as if they were real services
