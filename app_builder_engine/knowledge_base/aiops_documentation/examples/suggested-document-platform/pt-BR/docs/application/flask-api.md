---
title: "Flask API — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "APP-NS-API-001"
type: "application"
---

# Flask API (ilustrativa)

> Idioma: pt-BR | [English](../../../en/docs/application/flask-api.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — Flask + SQLAlchemy é **apenas exemplo**.

## Responsabilidade

Superfície HTTP para auth, RBAC, document analysis, chat, knowledge operations, helpers Slack, tokens externos e health. A mesma imagem pode rodar como worker Slack ou scheduler via flags de entrypoint.

## Grupos principais de rotas

| Prefix | Purpose | Classification |
| --- | --- | --- |
| `/api/auth`, `/api/me` | Session / identity | Confirmed (within example) |
| `/api/groups`, `/api/admin` | Tenancy + admin | Confirmed (within example) |
| `/api/analyses` | Document analysis jobs | Confirmed (within example) |
| `/api/chat` | Conversational turns | Confirmed (within example) |
| `/api/knowledge` | KOC / RAG ops | Confirmed (within example) |
| `/api/slack` | Slack interaction helpers | Confirmed (within example) |
| `/external` | Token-scoped machine API | Confirmed (within example) |
| `/api/health` | Liveness/readiness sketch | Confirmed (within example) |

## Dependências

| Dependency | Use | Classification |
| --- | --- | --- |
| PostgreSQL (`app`, `knowledge`) | Persistence | Confirmed (within example) |
| External LLM | Completions | Proposed (example only) |
| Cloud drive | Sync/fetch | Proposed (example only) |
| Vault / env | Secrets at `secrets/path/example` | Proposed (example only) |

## Modos de processo

| Mode | Entrypoint intent | Classification |
| --- | --- | --- |
| `api` | Serve HTTP | Confirmed (within example) |
| `slack-worker` | Socket Mode loop | Confirmed (within example) |
| `scheduler-worker` | Internal jobs loop | Confirmed (within example) |

## Relacionados

- [contracts/http-api.md](../contracts/http-api.md)
- [document-analysis.md](document-analysis.md)
- [slack-bridge.md](slack-bridge.md)
