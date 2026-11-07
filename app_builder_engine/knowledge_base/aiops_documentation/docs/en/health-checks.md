# Health Checks

> Language: EN | [Português (pt-BR)](../pt-BR/health-checks.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document health checks and similar probes used for routing, orchestration, and operator status.

Not every project has all check types. Mark unused types **Not Applicable**.

## Check Types

| Type | Meaning |
| --- | --- |
| **Liveness** | Process/component should be restarted or marked dead if failing |
| **Readiness** | Component should not receive new work yet (or anymore) |
| **Dependency health** | Critical dependency reachability or shallow capability check |
| **Business health** | Domain-level signal that core business capability works (beyond “process up”) |

Liveness ≠ readiness. A process can be alive but not ready; a dependency can be down while the process is live.

## What to Document

| Field | Question |
| --- | --- |
| Name / endpoint / job | How the check is invoked (technology-agnostic description) |
| Type | Liveness / Readiness / Dependency / Business / other |
| Success criteria | What “healthy” means |
| Failure criteria | What fails the check |
| Dependencies touched | Shallow vs deep checks — deep checks can amplify outages |
| Side effects | Must be safe (no dangerous writes) |
| Frequency / timeout | As configured, or Not Defined |
| Action on failure | Restart, remove from pool, alert, ignore |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Suggested Table

| Check | Type | Expected | On failure | Depth | Classification |
| --- | --- | --- | --- | --- | --- |
| | liveness / readiness / dependency / business | | | shallow / deep / Unknown | |

## Guidance

- Prefer shallow dependency checks for readiness when deep checks create cascading failures.
- Business health should reflect user-meaningful capability when Critical paths need it; otherwise Not Applicable.
- Health green + user pain often means missing business health or wrong SLI — see [degradation.md](degradation.md).

## Related Documents

- [observability-model.md](observability-model.md)
- [monitoring.md](monitoring.md)
- [alerting.md](alerting.md)
- [templates/observability.md](templates/observability.md)
- [reliability-model.md](reliability-model.md)
