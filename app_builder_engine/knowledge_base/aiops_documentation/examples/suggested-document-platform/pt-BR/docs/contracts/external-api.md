---
title: "Contrato External API — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "CTR-NS-EXT-001"
type: "contract"
---

# External API (ilustrativa)

> Idioma: pt-BR | [English](../../../en/docs/contracts/external-api.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — clientes máquina com tokens escopados.

## Propósito

Permitir que integradores disparem analysis ou chat sem sessão de browser, usando tokens opacos armazenados com hash no servidor.

## Header de autenticação

`Authorization: Bearer tk_ex_<opaque>` (prefixo apenas ilustrativo).

| Rule | Classification |
| --- | --- |
| Token bound to a group + scopes | Confirmed (within example) |
| Rotate/revoke via admin UI/API | Confirmed (within example) |
| Never log raw tokens | Confirmed (within example) |

## Endpoints representativos

| Method | Path | Scope sketch | Classification |
| --- | --- | --- | --- |
| POST | `/external/v1/analyses` | `analyses:write` | Confirmed (within example) |
| GET | `/external/v1/analyses/{id}` | `analyses:read` | Confirmed (within example) |
| POST | `/external/v1/chat/turns` | `chat:write` | Confirmed (within example) |
| GET | `/external/v1/knowledge/search` | `knowledge:read` | Confirmed (within example) |

## Rate limits / quotas

Unknown neste pacote ficcional — adotantes devem documentar limites reais.

## Relacionados

- [http-api.md](http-api.md)
- [../security/overview.md](../security/overview.md)
