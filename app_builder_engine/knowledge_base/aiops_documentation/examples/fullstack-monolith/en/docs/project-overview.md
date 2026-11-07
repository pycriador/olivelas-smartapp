---
title: "SheetLedger (Fictional) — Project overview"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# SheetLedger (Fictional)

> Language: EN | [Português (pt-BR)](../../pt-BR/docs/project-overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional / illustrative example.** Does not describe a real project.
>
> The **suggested stack** in this example is illustrative and is **not** the framework standard nor the definitive adoption guide.

## Purpose

Provide a fictional corporate workspace for **governed spreadsheet ingestion, transformation, and delivery**, with web UI and authenticated API in one repository.

## Problem

Teams need to import CSV/XLSX, type columns, apply rules, export outputs, store evidence, and reconcile data — with RBAC and audit — without unmanaged ad-hoc spreadsheets.

## Scope

| In scope | Notes | Classification |
| --- | --- | --- |
| Projects (input/output/rules/history) | Domain hub | Confirmed (within example) |
| CSV/XLSX import + canonicals | File contract | Confirmed (within example) |
| Evidence storage (object storage) | Integration | Confirmed (within example) |
| Comparison / reconciliation | DataOps | Confirmed (within example) |
| Live and Sandbox modes | Execution boundary | Confirmed (within example) |

## Non-goals

| Non-goal | Rationale |
| --- | --- |
| Mandate a stack for the standard | The standard is technology-agnostic |
| Microservices / brokers | Outside this monolith shape |
| Real certifications or volumes | Fiction; Unknown |

## Suggested stack (ILLUSTRATIVE — non-normative)

| Layer | Illustrative suggestion | Classification |
| --- | --- | --- |
| Frontend | React + TanStack Start/Router/Query + Vite | Proposed (example only) |
| Backend | Flask + SQLAlchemy | Proposed (example only) |
| DB | PostgreSQL dual-schema `core`/`data` | Proposed (example only) |
| Auth | JWT + API tokens + service accounts | Proposed (example only) |
| Files | Drive-like adapter; S3 as Proposed stub | Proposed (example only) |
| API runtime | Gunicorn / container | Proposed (example only) |
| Observability | Health + audit; Datadog optional in Loft orgs | Proposed (example only) |

> If your project uses Kotlin, Node, legacy PHP, or another stack: **ignore this table** and document your real stack with correct Classification.

## Architecture

- Details: [architecture/overview.md](architecture/overview.md)
- Context: [architecture/system-context.md](architecture/system-context.md)

## Components

| Component | Responsibility | Doc |
| --- | --- | --- |
| frontend-app | UI, routes, Live/Sandbox | [application/frontend-app.md](application/frontend-app.md) |
| backend-api | HTTP API, auth, health | [application/backend-api.md](application/backend-api.md) |
| project-pipeline | Import/export/rules | [application/project-pipeline.md](application/project-pipeline.md) |
| storage-and-files | Evidence | [application/storage-and-files.md](application/storage-and-files.md) |
| data-ops | Comparison/reconciliation | [application/data-ops.md](application/data-ops.md) |
| catalog-and-people | Catalog / people | [application/catalog-and-people.md](application/catalog-and-people.md) |
| sandbox-live | Mode boundary | [application/sandbox-live.md](application/sandbox-live.md) |

## Security / Ops / Gaps

- [security/overview.md](security/overview.md)
- [operations/service-profile.md](operations/service-profile.md)
- [knowledge-gaps.md](knowledge-gaps.md)
