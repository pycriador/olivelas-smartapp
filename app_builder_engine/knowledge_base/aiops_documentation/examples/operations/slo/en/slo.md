---
title: "SLO: catalog-lookup-availability (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
slo_id: "slo-catalog-lookup-availability"
---

# Service Level Objective: catalog-lookup-availability

> Language: EN | [Português (pt-BR)](../pt-BR/slo.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> SLO ID: slo-catalog-lookup-availability
>
> **Fictional example — not a real project.**

## Purpose

Define the reliability target for catalog lookup availability used by example-team for release and incident prioritization.

## Objective

| Field | Value |
| --- | --- |
| SLI | catalog-lookup-availability (../sli/) |
| Target | 99.5% |
| Window | rolling 30 days |
| Scope | catalog-service lookups |
| Owner | example-team |
| Classification | Confirmed (example) |

## Error Budget

| Field | Value |
| --- | --- |
| Used? | yes |
| Budget definition | 0.5% unsuccessful lookups in the window |
| Measurement source | same as SLI |
| Burn visibility | multi-window burn alerts (fast/slow) |
| Policy when budget burns / exhausts | Freeze non-critical releases; prioritize reliability work |
| Policy owner | example-team |

## SLA Linkage

| Field | Value |
| --- | --- |
| Formal SLA? | no |
| Notes | Internal objective only; not a customer SLA |

## Alerting and Response

| Condition | Alert | Runbook / action |
| --- | --- | --- |
| Fast burn of error budget | slo-catalog-fast-burn | rb-catalog-high-error-rate |
| Error ratio spike | catalog-high-error-rate | rb-catalog-high-error-rate |

## Related Documentation

| Document | Path |
| --- | --- |
| SLI | ../sli/ |
| Error budget policy | docs/en/error-budget.md |
| Incident process | docs/en/incident-management.md |
| Service profile | ../service-profile/ |
