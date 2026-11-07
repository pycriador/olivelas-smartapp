---
title: "Runbook: catalog high error rate (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
runbook_id: "rb-catalog-high-error-rate"
severity: "SEV-2"
---

# Runbook: catalog high error rate

> Language: EN | [Português (pt-BR)](../pt-BR/runbook.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Runbook ID: rb-catalog-high-error-rate
>
> **Fictional example — not a real project.**

## Purpose

Reduce elevated lookup error rate on catalog-service and restore a Healthy or Degraded (cache-backed) operational state.

## Scope

| In scope | Out of scope |
| --- | --- |
| Diagnosis of error ratio, dependency timeouts, cache fallback | Changing catalog content, capacity planning projects |

## Severity

| Field | Value |
| --- | --- |
| Typical severity | SEV-2 |
| When to escalate severity | Lookups unavailable and cache empty → treat as SEV-1 |

## Symptoms

| Symptom | Where observed |
| --- | --- |
| Error ratio above alert threshold | Metrics / alert |
| Timeout errors mentioning inventory-store | Logs |
| Elevated p99 latency | Metrics |

## Impact

| Field | Value |
| --- | --- |
| User / capability impact | Browse and add-to-cart fail or slow |
| Operational state | Degraded or Unavailable |
| Blast radius | catalog-service consumers only (example) |

## Preconditions

| Precondition | How to verify |
| --- | --- |
| On-call access to service signals | Confirm metrics/logs available |
| Known deploy window status | Check recent change log |

## Safety Notes

- Confirm environment and target before acting.
- Do not invent vendor-specific CLI commands; use the project's evidenced tooling.
- Call out **destructive** steps (e.g. cache flush) before execution.
- Never embed secrets; reference secret **names** only.
- Rollback of a bad deploy may be safer than cache wipe — prefer the least destructive path.

## Diagnosis

1. Confirm alert still firing and note start time.
2. Compare error ratio before/after last deploy.
3. Check dependency health for inventory-store (timeouts vs hard errors).
4. Check catalog-cache hit rate and freshness.

| Check | Expected | If unexpected |
| --- | --- | --- |
| Error ratio | Below alert threshold | Continue mitigation |
| inventory-store latency | Within contract timeout | Follow dependency mitigation |
| Cache freshness | Within RPO | Consider recovery procedure |

## Mitigation

1. If a recent deploy correlates: pause further deploys; prepare rollback.
2. If inventory-store is slow: ensure timeouts and retries match the contract; enable cache-backed degraded mode if available.
3. Communicate Degraded state to stakeholders.

## Resolution

1. Restore dependency health **or** roll back the bad change.
2. Confirm error ratio returns below threshold for the monitoring window.
3. Leave degraded mode only when dependency is healthy.

## Validation

| Check | Expected result |
| --- | --- |
| Error ratio | Below alert threshold |
| Sample lookups | Succeed within timeout |
| Operational state | Healthy (or documented Degraded) |

## Rollback

1. If mitigation was a deploy rollback: re-deploy previous known-good version using project process.
2. If mitigation was cache restore: follow recovery-procedure validation; do not blindly re-wipe.

| Condition requiring rollback | Action |
| --- | --- |
| Resolution worsens error ratio | Abort; escalate; revert last change |

| Rollback stance | Notes |
| --- | --- |
| Safe / partial | App rollback safe; cache restore may be irreversible without prior snapshot |

## Escalation

| Condition | Escalate to | Information to provide |
| --- | --- |
| No improvement after mitigation | example-platform | Timeline, error ratio, last deploy, dependency status |
| Data loss suspected | example-platform + product | Scope of cache/data impact |

## Communication

| Audience | What to say | Channel |
| --- | --- | --- |
| Stakeholders | Catalog lookups degraded; mitigation in progress | Project status channel |
| On-call peer | Runbook rb-catalog-high-error-rate applied | Handoff note |

## Related Documentation

| Document | Path |
| --- | --- |
| Service profile | ../service-profile/ |
| Failure mode | ../failure-mode/ |
| SLO | ../slo/ |
| Recovery | ../recovery-procedure/ |
| Incident example | ../incident/ |
