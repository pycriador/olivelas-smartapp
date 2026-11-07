---
title: "Contrato HTTP API — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "CTR-NS-HTTP-001"
type: "contract"
---

# HTTP API (esboço ilustrativo)

> Idioma: pt-BR | [English](../../../en/docs/contracts/http-api.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — não é fonte OpenAPI de um serviço real.

## URL base (placeholder)

`https://api.docs.example.com`

## Autenticação

| Mechanism | Use | Classification |
| --- | --- | --- |
| Session / bearer for UI | Browser via BFF | Confirmed (within example) |
| External API token | `/external/*` | Confirmed (within example) |

## Endpoints representativos

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

## Formato de erro (exemplo)

```json
{ "error": { "code": "not_found", "message": "Analysis not found" } }
```

Mensagens em inglês (padrão de API). Classification: Confirmed (within example).

## Relacionados

- [external-api.md](external-api.md)
- [../application/flask-api.md](../application/flask-api.md)
