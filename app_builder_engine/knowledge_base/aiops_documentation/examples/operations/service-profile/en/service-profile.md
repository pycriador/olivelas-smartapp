---
title: "Service Profile: catalog-service (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
service_id: "catalog-service"
criticality: "High"
---

# Service Profile: catalog-service

> Language: EN | [Português (pt-BR)](../pt-BR/service-profile.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Service ID: catalog-service
>
> **Fictional example — not a real project.**

## Purpose

Serve product catalog lookups for storefront and ordering flows. Illustrates an operational identity card without prescribing infrastructure or vendors.

## Scope

| In scope | Out of scope |
| --- | --- |
| Lookup availability, ownership, deps, service levels, recovery stance | Catalog content authoring, pricing rules |

## Ownership

| Role | Owner | Notes |
| --- | --- | --- |
| Service / product | example-product | Fictional |
| Technical | example-team | Fictional |
| Operational / on-call | example-team | Same team |
| Escalation | example-platform | Fictional platform contact |

## Criticality

| Field | Value |
| --- | --- |
| Level | High |
| Rationale | Storefront browse depends on catalog lookups |
| User / business impact if down | Browse and add-to-cart degrade; checkout may still complete for known SKUs |

## Architecture Links

| Concern | Link |
| --- | --- |
| Architecture overview / component | fictional `docs/architecture/overview.md` (not in this sample tree) |
| Failure domains | dependency domain: inventory-store |
| Dependency map | see Dependencies below |

## Dependencies

| Dependency | Type | Criticality | Failure impact | Detection | Mitigation / recovery |
| --- | --- | --- | --- | --- | --- |
| inventory-store | runtime | High | Elevated latency / errors on lookup | Error rate + latency signals | Timeout, degrade to cached snapshot, runbook |
| catalog-cache | runtime | Medium | Stale or empty browse results | Cache hit / miss + freshness | Restore from backup procedure |

## Contracts (Reliability-Relevant)

| Contract | Timeout | Retry | Idempotency | Notes |
| --- | --- | --- | --- | --- |
| catalog.lookup (API, fictional) | 500 ms | 2 retries, backoff | yes (read) | Link only; schema not duplicated |

## Service Levels

| SLI | SLO | Window | Error budget | Classification |
| --- | --- | --- | --- | --- |
| catalog-lookup-availability | 99.5% successful lookups | 30 days | 0.5% | Confirmed (example) |

## Failure Modes (Summary)

| Failure mode | Impact | Detection | Runbook / recovery |
| --- | --- | --- | --- |
| inventory-store timeout | Degraded lookups | Latency + timeout errors | rb-catalog-high-error-rate; FM inventory timeout |

## Observability

| Signal type | Status | Notes / link |
| --- | --- | --- |
| Metrics | Implemented | request count, error ratio, latency |
| Logs | Implemented | request id, outcome |
| Traces | Partial | entry span only |
| Health checks | Implemented | liveness + dependency probe |
| Alerts | Implemented | high error rate, SLO burn |

## Operational State

| How state is determined | Healthy / Degraded / Unavailable signals |
| --- | --- |
| Error ratio + dependency health + cache freshness | Healthy: error ratio below threshold; Degraded: dependency timeouts with cache serving; Unavailable: lookups failing and cache empty |

## Deploy and Change

| Topic | Link / notes |
| --- | --- |
| Deploy / validate | Deploy → smoke lookup → watch error ratio |
| Rollback stance | Safe for app version; cache restore is separate |
| Maintenance | Planned window documented in maintenance notes |

## Recovery

| Topic | Status | Link |
| --- | --- | --- |
| Backup / restore | Defined | recovery-procedure example |
| RPO / RTO | Defined | RPO 1 h / RTO 30 min (example values) |
| Disaster recovery | Formal Disaster Recovery not defined. | — |

## Related Runbooks and Incidents

| Artifact | ID / path |
| --- | --- |
| Runbooks | rb-catalog-high-error-rate |
| Troubleshooting | — |
| Recent material incidents | INC-20260801-01 |

## Related Documentation

| Document | Path |
| --- | --- |
| Architecture | (adopting project) |
| Contracts | catalog.lookup (fictional) |
| Observability | project observability inventory |
| Reliability model | docs/en/reliability-model.md |
