---
title: "Failure Mode: inventory-store timeout (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
failure_mode_id: "fm-inventory-store-timeout"
---

# Failure Mode: inventory-store timeout

> Language: EN | [Português (pt-BR)](../pt-BR/failure-mode.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Failure mode ID: fm-inventory-store-timeout
>
> **Fictional example — not a real project.**

## Summary

catalog-service lookups time out when inventory-store latency exceeds the configured client timeout.

## Category

| Field | Value |
| --- | --- |
| Category | dependency |
| Related component(s) | catalog-service, inventory-store |
| Related failure domain | runtime dependency domain |
| Classification | Confirmed (example) |

## Trigger

| Field | Value |
| --- | --- |
| How it starts | inventory-store latency rises above timeout, or timeout config is set too low |
| Known preconditions | Sustained load or bad timeout change |

## Propagation and Impact

| Field | Value |
| --- | --- |
| How it propagates | Timeouts surface as lookup errors to storefront consumers |
| Isolation boundaries | Other services not calling inventory-store via catalog are unaffected |
| User / capability impact | Browse / add-to-cart degrade or fail |
| Operational state when active | Degraded (if cache serves) or Unavailable |

## Detection

| Signal | Where | Threshold / pattern |
| --- | --- | --- |
| Timeout error count | Logs / metrics | Rise above baseline |
| Client latency p99 | Metrics | Approaches or exceeds timeout |
| Dependency health probe | Health checks | Failing or slow |

## Mitigation and Recovery

| Field | Value |
| --- | --- |
| Immediate mitigation | Cache-backed degrade; pause related changes |
| Recovery path | Restore dependency health or correct timeout; validate error ratio |
| Runbook | rb-catalog-high-error-rate |
| Rollback applicable? | yes (for bad timeout config) |

## Prevention

| Field | Value |
| --- | --- |
| Preventive controls | Align timeout with measured p99; pre-change check |
| Related reliability debt | Missing automated dependency latency gate (example) |

## Related Documentation

| Document | Path |
| --- | --- |
| Reliability model | docs/en/reliability-model.md |
| Dependency reliability | docs/en/dependency-reliability.md |
| Contracts | catalog.lookup (fictional) |
| Alerts | high error rate / SLO burn |
| Runbook | ../runbook/ |
| Incident | ../incident/ |
