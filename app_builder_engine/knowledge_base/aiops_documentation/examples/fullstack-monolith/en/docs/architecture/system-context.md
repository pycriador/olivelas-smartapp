---
title: "System context — SheetLedger (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# System context

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/architecture/system-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional example.** Illustrative stack ≠ framework standard.

## Purpose

Place SheetLedger in the ecosystem: who uses it, what it depends on, and what stays outside the boundary.

## System

| Field | Value |
| --- | --- |
| Name | SheetLedger (fictional) |
| Purpose | Governed spreadsheet workspace |
| Owner | example-team |
| Boundary summary | FE + API + DB; storage and HTTP at the edge |

## Users

| User | Need | Interaction |
| --- | --- | --- |
| Admin / GroupAdmin / Editor / Viewer | Operate UI per illustrative RBAC | Browser → frontend |
| DataOps operator | Compare/reconcile projects | DataOps UI |

## Consumers

| Consumer | What they consume | Contract |
| --- | --- | --- |
| M2M integrations | Authenticated REST JSON | [../contracts/rest-api.md](../contracts/rest-api.md) |
| Frontend Live | Same API | REST |

## External systems

| System | Role | Direction | Classification |
| --- | --- | --- | --- |
| Object storage (Drive-like) | Evidence binaries | outbound | Confirmed (within example) |
| Configurable HTTP | Import source | outbound | Confirmed (within example) |
| AWS S3 | Provider | — | Proposed |

## Dependencies

| Dependency | Type | Purpose | Classification |
| --- | --- | --- | --- |
| Illustrative PostgreSQL | runtime | Metadata + typed data | Proposed (example only) |
| API process (e.g. Gunicorn) | runtime | Serve HTTP | Proposed (example only) |
| Frontend build (e.g. Vite) | build | UI bundle | Proposed (example only) |

## Trust boundaries

| Boundary | Inside | Outside |
| --- | --- | --- |
| Browser | Sandbox state, JWT in memory / refresh cookie | — |
| API process | JWT/token validation, rate limit, ORM | DB, storage, HTTP |
| Storage credentials | Illustrative encrypted config | Account JSON never sent to browser |

## Related

- [overview.md](overview.md)
- [../application/sandbox-live.md](../application/sandbox-live.md)
- [../contracts/object-storage.md](../contracts/object-storage.md)
