---
title: "Service profile — SheetLedger API (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
version: "1.0"
---

# Service profile

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/operations/service-profile.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> **Fictional example.**

## Ownership (must fill or Unknown)

| Role | Owner | Notes |
| --- | --- | --- |
| Service / product | example-team | Fictional |
| Technical | example-team | Fictional |
| Operational / on-call | Unknown | Must not be blank for real adopters |
| Escalation | Unknown | Must not be blank for real adopters |

## Criticality

| Field | Value |
| --- | --- |
| Level | Medium / Not Defined |
| Rationale | Example only; do not use as a real baseline |

## Observability

| Signal | Status |
| --- | --- |
| Metrics | Partial (illustrative; Datadog optional in Loft orgs — not required by the standard) |
| Logs | Partial |
| Traces | Not Applicable (in this example) |
| Health checks | Implemented (illustrative) |

## Service Levels

| SLI | SLO | Classification |
| --- | --- | --- |
| — | Not Defined | Unknown |

## Entry points

| Entry | Notes | Classification |
| --- | --- | --- |
| HTTP API `/api`, `/api/v1` | Illustrative | Confirmed (within example) |
| Health | Illustrative | Confirmed (within example) |
| OpenAPI stub | Not production | Confirmed (within example) |

## Critical dependencies

| Dependency | Typical failure | Runbook |
| --- | --- | --- |
| Illustrative PostgreSQL | Health database false | [rb-db-unavailable.md](rb-db-unavailable.md) |
| Bootstrap admin env | Login impossible on fresh env | [rb-auth-bootstrap.md](rb-auth-bootstrap.md) |

## Related

- [observability.md](observability.md)
- [../application/backend-api.md](../application/backend-api.md)

