---
title: "Scheduler — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "APP-NS-SCHED-001"
type: "application"
---

# Internal scheduler (illustrative)

> Language: EN | [Português](../../../pt-BR/docs/application/scheduler.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** — in-app scheduler worker sharing the API image; not a mandate to avoid CronJobs.

## Responsibility

Poll group-defined schedules and run **Drive → analysis → knowledge** pipelines without a browser session. Runs in the API image’s `scheduler-worker` mode.

## Job types (example)

| Job | Description | Classification |
| --- | --- | --- |
| Drive folder sync | List/fetch new/changed files | Confirmed (within example) |
| Analysis enqueue | Create analysis jobs for synced files | Confirmed (within example) |
| Knowledge publish | Push completed analyses into `knowledge` | Confirmed (within example) |
| Embedding backfill | Optional vector refresh | Proposed (example only) |

## Design notes

| Topic | Approach | Classification |
| --- | --- | --- |
| Leader election | Single replica or DB lease | Inferred |
| Overlap prevention | Per-group lock | Proposed (example only) |
| vs K8s CronJob | Example prefers in-app for shared domain logic | Proposed (example only) |

## Related

- [document-analysis.md](document-analysis.md)
- [knowledge-platform.md](knowledge-platform.md)
- [../operations/feature-flags.md](../operations/feature-flags.md)
