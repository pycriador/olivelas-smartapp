---
title: "Contract — rest-api (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "API"
---

# rest-api

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/contracts/rest-api.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional example.** Not a production contract. Illustrative stack ≠ standard.

## Purpose
Synchronous HTTP contract between clients (Live frontend, M2M) and `backend-api`.

## Scope
| In scope | Out of scope |
| --- | --- |
| Resources under `/api` and `/api/v1` | Async events / queues (N/A) |
| Envelope `{ ok, data\|error }` | GraphQL |

## Participants
| Participant | Role | Classification |
| --- | --- | --- |
| frontend-app / M2M | consumer | Confirmed (within example) |
| backend-api | producer | Confirmed (within example) |

## Versioning
Canonical `/api/v1/...`, legacy `/api/...`, illustrative rewrite `/api/v1` → `/api`.

## Spec
Stub: [openapi.yaml](openapi.yaml) — **not** a real production schema.

## Authentication
User JWT, API token, service-account JWT — see sibling auth contracts.

## Rate limit / audit
Illustrative rate limit; business audit vs technical logs kept separate.

