---
title: "External API contract — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "CTR-NS-EXT-001"
type: "contract"
---

# External API (illustrative)

> Language: EN | [Português](../../../pt-BR/docs/contracts/external-api.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** — machine clients with scoped tokens.

## Purpose

Allow integrators to trigger analysis or chat without a browser session, using opaque tokens stored hashed on the server.

## Auth header

`Authorization: Bearer tk_ex_<opaque>` (prefix is illustrative only).

| Rule | Classification |
| --- | --- |
| Token bound to a group + scopes | Confirmed (within example) |
| Rotate/revoke via admin UI/API | Confirmed (within example) |
| Never log raw tokens | Confirmed (within example) |

## Representative endpoints

| Method | Path | Scope sketch | Classification |
| --- | --- | --- | --- |
| POST | `/external/v1/analyses` | `analyses:write` | Confirmed (within example) |
| GET | `/external/v1/analyses/{id}` | `analyses:read` | Confirmed (within example) |
| POST | `/external/v1/chat/turns` | `chat:write` | Confirmed (within example) |
| GET | `/external/v1/knowledge/search` | `knowledge:read` | Confirmed (within example) |

## Rate limits / quotas

Unknown in this fictional package — adopters must document real limits.

## Related

- [http-api.md](http-api.md)
- [../security/overview.md](../security/overview.md)
