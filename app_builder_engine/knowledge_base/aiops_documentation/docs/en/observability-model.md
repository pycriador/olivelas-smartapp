# Observability Model

> Language: EN | [Português (pt-BR)](../pt-BR/observability-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document what can be known about a system in production — signals used to Operate → Observe → Detect → Diagnose in the [operations model](operations-model.md).

This standard is technology-agnostic. For a fill-in project template, use [templates/observability.md](templates/observability.md).

## Signal Types

| Signal | Meaning | Typical use |
| --- | --- | --- |
| **Metrics** | Aggregated numeric measurements over time | SLIs, saturation, rates, gauges |
| **Logs** | Discrete event records | Diagnosis, audit of notable actions |
| **Traces** | Causal request / workflow spans across components | Latency and dependency path analysis |
| **Events** | Notable state changes (deploy, failover, config) | Correlate changes with symptoms |
| **Health signals** | Explicit liveness / readiness / dependency / business checks | Routing, probes, coarse status |

A project need not implement every type. Mark **Not Applicable** or **Not Documented** per [templates/observability.md](templates/observability.md).

## What to Document per Signal Type

| Topic | Question |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |
| Purpose | What decisions or diagnoses it supports |
| Cardinality / volume risks | If relevant |
| PII / secrets | What must never appear — never document secret values |
| Correlation | How to join metrics ↔ logs ↔ traces ↔ events |
| Owner | Who maintains the signal quality |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Correlation

Document identifiers used to stitch signals (request id, trace id, tenant id, deploy id — as actually used). If correlation is weak or absent, say **Unknown** or describe the gap.

## Relationship to Monitoring and Alerting

| Concern | Document |
| --- | --- |
| What signals exist | This model + observability template |
| What is watched continuously | [monitoring.md](monitoring.md) |
| What pages a human | [alerting.md](alerting.md) |
| Probe definitions | [health-checks.md](health-checks.md) |
| SLI measurement | [service-levels.md](service-levels.md) |

## Architecture and Contracts

- Trace and dependency views should match [component-relationships.md](component-relationships.md) and [failure-domains.md](failure-domains.md).
- Error and latency signals should be interpretable against [contract](contract-model.md) error and timing rules.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | How to tell healthy vs broken; where logs live; one key metric if any |
| Medium | Metrics + logs + alerts mapped to runbooks |
| Large | Metrics, logs, traces, events, health; correlation story; SLO instrumentation |

## Related Documents

- [templates/observability.md](templates/observability.md)
- [health-checks.md](health-checks.md)
- [monitoring.md](monitoring.md)
- [alerting.md](alerting.md)
- [operations-model.md](operations-model.md)
