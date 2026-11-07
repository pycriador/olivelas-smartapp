---
title: "SLI: catalog-lookup-availability (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
sli_id: "sli-catalog-lookup-availability"
---

# Service Level Indicator: catalog-lookup-availability

> Language: EN | [Português (pt-BR)](../pt-BR/sli.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> SLI ID: sli-catalog-lookup-availability
>
> **Fictional example — not a real project.**

## Purpose

Represent the fraction of catalog lookup attempts that succeed from the caller's perspective.

## Definition

| Field | Value |
| --- | --- |
| Name | catalog-lookup-availability |
| Formula / event set | successful lookups / total lookup attempts |
| Good event | Lookup returns success within timeout |
| Bad event / failure | Timeout, 5xx-equivalent, or explicit failure outcome |
| Exclusions | Synthetic probes marked as excluded in measurement config (if used) |
| Unit | ratio |

## Measurement

| Field | Value |
| --- | --- |
| Source | Request outcome metrics for catalog.lookup |
| Window default | rolling 30 days (aligned with SLO) |
| Scope | all lookup endpoints / flows for catalog-service |
| Owner | example-team |
| Classification | Confirmed (example) |

## Related SLOs

| SLO | Target | Link |
| --- | --- | --- |
| catalog-lookup-availability-slo | 99.5% | ../slo/ |

## Related Documentation

| Document | Path |
| --- | --- |
| Observability | project inventory |
| Service levels policy | docs/en/service-levels.md |
| Dashboards / metrics | request count, success count (names only) |
| Service profile | ../service-profile/ |
