# Runbook: High Error Rate

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/operations/rb-high-error-rate.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Runbook ID: rb-high-error-rate
>
> **Fictional example — not a real project.**

## Purpose

Restore acceptable error rates for `notification-api` acceptance requests.

## Scope

| In scope | Out of scope |
| --- | --- |
| API acceptance errors | Downstream delivery failures |

## Preconditions

| Precondition | How to verify |
| --- | --- |
| Access to service logs/metrics | Observability access granted |
| Ability to check store health | Dependency health check available |

## Symptoms

| Symptom | Where observed |
| --- | --- |
| Elevated 5xx or `store_unavailable` | Metrics / logs |
| Consumer retry storms | Consumer dashboards |

## Diagnosis

1. Check API error rate and top error codes.
2. Check acknowledgement-store health.
3. Check recent deployments.

| Check | Expected | If unexpected |
| --- | --- | --- |
| Store health | healthy | Continue to resolution for dependency failure |
| Error code mix | mostly client errors | Investigate validation changes |

## Resolution

1. If store is unhealthy, follow store recovery procedure for the environment.
2. If caused by a bad deployment, roll back the API deployment.
3. If auth failures dominate, verify token source configuration **name/source only** — do not paste secrets.

## Validation

| Check | Expected result |
| --- | --- |
| Error rate | Back within normal band |
| Synthetic acceptance request | Returns `accepted` |

## Rollback

1. Roll back API deployment to previous known-good version.
2. Re-check error rate.

| Condition requiring rollback | Action |
| --- | --- |
| Error rate remains high after dependency recovery | Roll back API |

## Escalation

| Condition | Escalate to | Information to provide |
| --- | --- | --- |
| Store outage > 15 minutes | platform on-call (fictional) | timeline, error samples without secrets |

## Related Documentation

| Document | Path |
| --- | --- |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| Component | [../application/notification-api.md](../application/notification-api.md) |
| Contract | [../contracts/send-notification.md](../contracts/send-notification.md) |
