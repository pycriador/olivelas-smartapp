---
title: "Incident: INC-20260801-01 catalog latency (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
incident_id: "INC-20260801-01"
severity: "SEV-2"
---

# Incident: INC-20260801-01 catalog latency

> Language: EN | [Português (pt-BR)](../pt-BR/incident.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Incident ID: INC-20260801-01
>
> **Fictional example — not a real project.**

## Summary

Elevated latency and timeout errors on catalog-service lookups for approximately 40 minutes. Users experienced slow or failed browse.

## Status

| Field | Value |
| --- | --- |
| Incident status | Resolved |
| Operational state | Healthy |
| Severity | SEV-2 |
| Commander / owner | example-oncall |
| Started | 2026-08-01T14:10:00Z |
| Detected | 2026-08-01T14:18:00Z |
| Resolved | 2026-08-01T14:50:00Z |

## Impact

| Field | Value |
| --- | --- |
| Capabilities affected | catalog lookup / browse |
| User / tenant scope | all fictional storefront users in example region |
| Data impact | none |

## Timeline

| Time (UTC) | Type | Entry |
| --- | --- | --- |
| 14:10 | FACT | Error ratio began rising |
| 14:18 | FACT | Alert fired; on-call acknowledged |
| 14:25 | HYPOTHESIS | Recent config change to inventory-store timeout |
| 14:32 | CONFIRMED | inventory-store p99 above contract timeout |
| 14:40 | FACT | Rolled back timeout config; cache-backed degrade enabled |
| 14:50 | FACT | Error ratio below threshold; incident closed |

## Root Cause

| Field | Value |
| --- | --- |
| Root cause | inventory-store timeout config reduced below sustainable latency |
| Contributing factors | Missing pre-change validation of dependency p99 |
| Trigger | Config change at 14:05 UTC |
| Detection gap | ~8 minutes to alert |
| Recovery gap | ~32 minutes from detect to resolve |
| Classification | Confirmed (example) |

## Response

| Action | Owner | Result |
| --- | --- | --- |
| Applied rb-catalog-high-error-rate | example-oncall | Diagnosis completed |
| Rolled back timeout config | example-oncall | Latency improved |
| Enabled cache-backed degrade | example-oncall | User impact reduced during recovery |

## Related Runbooks

| Runbook | Applied? |
| --- | --- |
| rb-catalog-high-error-rate | yes |

## Follow-ups

| Action | Type | Owner | Status |
| --- | --- | --- |
| Add pre-change check for dependency p99 vs timeout | Preventive | example-team | open |
| Document failure mode for dependency timeout | Documentation | example-team | done (example) |
| Review alert threshold for faster MTTD | Detective | example-team | open |

## Related Documentation

| Document | Path |
| --- | --- |
| Service profile | ../service-profile/ |
| Runbook | ../runbook/ |
| Failure mode | ../failure-mode/ |
| SLO | ../slo/ |
