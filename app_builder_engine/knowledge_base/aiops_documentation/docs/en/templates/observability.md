---
title: "Observability"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
---

# Observability

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/observability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Project fill-in template. Methodology: observability-model.md, health-checks.md, monitoring.md, alerting.md, service-levels.md. -->

Mark each mechanism with one of:

| Status | Meaning |
| --- | --- |
| Implemented | Exists and is relied upon |
| Partial | Exists with known gaps |
| Not Applicable | Intentionally not used |
| Not Documented | May exist, but not documented yet / Unknown |

## Scope

| In scope | Out of scope |
| --- | --- |
| | |

## Logging

| Field | Value |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |
| What is logged | |
| What must not be logged | <!-- secrets, unnecessary PII --> |
| Correlation identifiers | |
| Evidence | |

## Metrics

| Field | Value |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |
| Key metrics | |
| Evidence | |

| Metric | Meaning | Classification |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown |

See [operational-metrics.md](../operational-metrics.md) for metric-purpose guidance.

## Tracing

| Field | Value |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |
| Propagation | |
| Evidence | |

## Dashboards

| Field | Value |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |

| Dashboard | Purpose | Link / location |
| --- | --- | --- |
| | | |

## Alerts

| Field | Value |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |

| Alert | Condition | Severity | Action / runbook |
| --- | --- | --- | --- |
| | | | |

Methodology: [alerting.md](../alerting.md). Optional detail template: [alert.md](alert.md).

## SLOs / SLIs

| Field | Value |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |

| SLI | SLO | Window | Classification |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown / Proposed |

Methodology: [service-levels.md](../service-levels.md). Templates: [sli.md](sli.md), [slo.md](slo.md).

## Health Checks

| Field | Value |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |

| Check | Type | Expected | Classification |
| --- | --- | --- | --- |
| | liveness / readiness / dependency / business / other | | |

Methodology: [health-checks.md](../health-checks.md).

## Monitoring Summary

| What | Why | Source | Frequency | Threshold | Owner | Action |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

Methodology: [monitoring.md](../monitoring.md). Model overview: [observability-model.md](../observability-model.md).

## Organizational platform (optional)

<!-- The standard does NOT require a vendor. If the organization recommends a platform (e.g. Datadog at Loft), record it here as an org convention — not as a framework requirement. -->

| Field | Value |
| --- | --- |
| Platform expected by org (if any) | <!-- e.g. Datadog / other / None / Unknown --> |
| Status in this project's code | Implemented / Partial / Not Applicable / Not Documented / Unknown |
| Gap documented? | Yes → link knowledge-gaps / No / N/A |
| Notes | <!-- Never claim the vendor is required by the Engineering Documentation Standard --> |

Guidance: [observability-platform-notes.md](../observability-platform-notes.md).

## Troubleshooting Signals

| Symptom | Signal to inspect | Runbook |
| --- | --- | --- |
| | | |

## Related Documentation

| Document | Path |
| --- | --- |
| Observability model | |
| Service profile | |
| Architecture | |
| Operations / runbooks | |
| Security | |
| Components | |
