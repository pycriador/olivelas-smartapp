---
title: "Security Incident: INC-20260805-01 lookup abuse (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
incident_id: "INC-20260805-01"
severity: "SEV-3"
incident_type: "Security"
---

# Security Incident: INC-20260805-01 lookup abuse

> Language: EN | [Português (pt-BR)](../pt-BR/incident.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Incident ID: INC-20260805-01
>
> **Fictional example — not a real project. No personal data.**

## Summary

Elevated public catalog lookup volume from a small set of client fingerprints, consistent with THR-001-style enumeration. No confirmed Internal field leakage.

## Status

| Field | Value |
| --- | --- |
| Incident status | Resolved |
| Incident type | Security |
| Operational state | Healthy |
| Severity | SEV-3 |
| Security owner / commander | example-oncall |
| Started | 2026-08-05T09:20:00Z |
| Detected | 2026-08-05T09:35:00Z |
| Contained | 2026-08-05T10:05:00Z |
| Resolved | 2026-08-05T10:40:00Z |

## Impact

| Field | Value |
| --- | --- |
| Assets affected | AST-001 (attempted inference; Public fields only observed) |
| Confidentiality impact | none (Internal fields not returned — Confirmed example) |
| Integrity impact | none |
| Availability impact | possible — elevated load on public edge |
| User / tenant scope | fictional storefront users in example region (degraded browse latency) |

## Timeline

| Time (UTC) | Type | Entry |
| --- | --- | --- |
| 09:20 | FACT | Public lookup rate began rising |
| 09:35 | FACT | Alert `catalog-public-lookup-spike` fired |
| 09:50 | HYPOTHESIS | Automated enumeration against public edge |
| 10:05 | CONFIRMED | Rate limit tightened; abusive fingerprints blocked at edge |
| 10:40 | FACT | Volume normal; incident closed |

## Containment and Response

| Action | Owner | Result |
| --- | --- | --- |
| Lowered `EDGE_LOOKUP_RATE_LIMIT` temporarily | example-oncall | Volume dropped |
| Blocked abusive client fingerprints at edge | example-oncall | Spike stopped |
| Verified Public field allowlist still enforced | example-oncall | No Internal leakage |

## Evidence

| Evidence ID / location | Supports | Integrity notes |
| --- | --- | --- |
| Alert history: `catalog-public-lookup-spike` | Detection time | Aggregate metrics only |
| Edge deny counters (config name) | Containment effectiveness | No request bodies stored in this record |

## Root Cause

| Field | Value |
| --- | --- |
| Root cause | Public read path under EXC-001 attracted automated scraping |
| Contributing factors | Rate limit initially sized for marketing burst, not sustained scrape |
| Detection gap | ~15 minutes |
| Control gap | Rate limit threshold too high for campaign window |
| Classification | Confirmed (example) |

## Follow-ups

| Action | Type | Owner | Status |
| --- | --- | --- | --- |
| Retune `EDGE_LOOKUP_RATE_LIMIT` for EXC-001 window | Control | example-team | done (example) |
| Review EXC-001 expiration still valid | Exception | example-team | open |
| Document THR-001 residual under campaign | Documentation | example-team | done (example) |

## Related Documentation

| Document | Path |
| --- | --- |
| Threat | ../threat/ |
| Exception | ../exception/ |
| Asset | ../asset/ |
| Control | ../control/ |
