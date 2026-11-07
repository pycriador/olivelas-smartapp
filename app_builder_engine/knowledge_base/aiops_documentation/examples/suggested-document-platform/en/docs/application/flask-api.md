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

# Flask API (illustrative)

> Language: EN | [Português](../../../pt-BR/docs/application/flask-api.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** — Flask + SQLAlchemy is **example-only**.

## Responsibility

HTTP surface for auth, RBAC, document analysis, chat, knowledge operations, Slack helpers, external tokens, and health. The same image can run as a Slack worker or scheduler via entrypoint flags.

## Main route groups

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

## Dependencies

| Dependency | Use | Classification |
| --- | --- | --- |
| PostgreSQL (`app`, `knowledge`) | Persistence | Confirmed (within example) |
| External LLM | Completions | Proposed (example only) |
| Cloud drive | Sync/fetch | Proposed (example only) |
| Vault / env | Secrets at `secrets/path/example` | Proposed (example only) |

## Process modes

| Mode | Entrypoint intent | Classification |
| --- | --- | --- |
| `api` | Serve HTTP | Confirmed (within example) |
| `slack-worker` | Socket Mode loop | Confirmed (within example) |
| `scheduler-worker` | Internal jobs loop | Confirmed (within example) |

## Related

- [contracts/http-api.md](../contracts/http-api.md)
- [document-analysis.md](document-analysis.md)
- [slack-bridge.md](slack-bridge.md)
