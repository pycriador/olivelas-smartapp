---
title: "Observability platform notes"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-10"
updated: "2026-08-19"
review_date: "2026-11-10"
version: "1.0"
---

# Observability platform notes

> Language: EN | [Português (pt-BR)](../pt-BR/observability-platform-notes.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

## What the standard requires

The standard requires **honest signal reporting** (metrics / logs / traces / health / alerts) with status:

`Implemented` | `Partial` | `Not Applicable` | `Not Documented`

Methodology: [observability-model.md](observability-model.md), template [templates/observability.md](templates/observability.md).

The standard does **not** require a specific vendor, agent, or telemetry backend.

## Organizational conventions (optional)

Some organizations (e.g. Loft) adopt **Datadog** as the default platform for metrics, logs, and traces.

| Claim | Classification |
| --- | --- |
| “Datadog is required by the Engineering Documentation Standard” | **False** — not a framework requirement |
| “Datadog is the expected platform in org X” | May be Confirmed **in the org**, documented in the project as a convention |
| “A project without Datadog is outside the documentation standard” | **False** — document Partial/Unknown/N/A with evidence |

## How to document in Loft projects (suggestion, not a framework mandate)

1. Fill the observability template with what the code actually emits.
2. If the org expects Datadog and the code does not instrument it: record a **gap** in `knowledge-gaps.md` (Confirmed gap vs org convention).
3. Do not invent dashboards, monitors, or SLOs.
4. Local health checks and audit logs count as Partial evidence — say so explicitly.

## Loft implementation pack (as-is)

For **how to enable Datadog on Loft EKS** (chart `web-server`, structured logs, APM, operator usage), use the as-is pack — not this generic page:

- [loft-observability/README.md](loft-observability/README.md)
- [loft-observability/documentation-prerequisites.md](loft-observability/documentation-prerequisites.md) — **logs in Datadog** as Loft documentation gate

The framework still does not mandate Datadog; the pack documents **org convention and implementation** for Loft Kubernetes services.

## Relation to the fullstack-monolith example

The example illustrates a monolith with health + audit + ring buffers and marks Datadog as an optional gap vs org convention. The stack and vendor choice there are **illustrative**.

## Related

- [templates/observability.md](templates/observability.md)
- [loft-observability/README.md](loft-observability/README.md)
- [adoption-path.md](adoption-path.md)
- [examples/fullstack-monolith/](../../examples/fullstack-monolith/)
