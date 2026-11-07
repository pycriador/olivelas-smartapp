---
title: "HTTP API contract — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "CTR-NS-HTTP-001"
type: "contract"
---

# HTTP API (illustrative sketch)

> Language: EN | [Português](../../../pt-BR/docs/contracts/http-api.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** — not an OpenAPI source of truth for a real service.

## Base URL (placeholder)

`https://api.docs.example.com`

## Authentication

| Mechanism | Use | Classification |
| --- | --- | --- |
| Session / bearer for UI | Browser via BFF | Confirmed (within example) |
| External API token | `/external/*` | Confirmed (within example) |

## Representative endpoints

| Method | Path | Purpose | Classification |
| --- | --- | --- | --- |
| GET | `/api/health` | Health | Confirmed (within example) |
| POST | `/api/auth/login` | Login | Confirmed (within example) |
| GET | `/api/me` | Current user | Confirmed (within example) |
| POST | `/api/analyses` | Start analysis | Confirmed (within example) |
| GET | `/api/analyses/{id}` | Job status | Confirmed (within example) |
| POST | `/api/chat/turns` | Chat turn | Confirmed (within example) |
| GET | `/api/knowledge/search` | Hybrid/FTS search | Confirmed (within example) |
| GET | `/api/groups/{id}/schedules` | Schedules | Confirmed (within example) |

## Error format (example)

```json
{ "error": { "code": "not_found", "message": "Analysis not found" } }
```

Messages in English (API standard). Classification: Confirmed (within example).

## Related

- [external-api.md](external-api.md)
- [../application/flask-api.md](../application/flask-api.md)
