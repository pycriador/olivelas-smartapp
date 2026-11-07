# Operational State

> Language: EN | [Português (pt-BR)](../pt-BR/operational-state.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to describe the **operational state** of a service or capability in a consistent vocabulary.

Use these states (or map the project’s synonyms to them once and reuse):

| State | Meaning |
| --- | --- |
| **Healthy** | Serving within expected behavior; no material active incident |
| **Degraded** | Serving with reduced quality, capacity, or feature set |
| **Unavailable** | Material capability cannot be used |
| **Recovering** | Restoration in progress; not yet Healthy |
| **Maintenance** | Intentionally limited or offline for planned work |
| **Unknown** | State cannot be determined from available signals |

```text
Healthy ⇄ Degraded ⇄ Unavailable
    ↑         ↑           ↑
    └──── Recovering ─────┘
              ↑
         Maintenance (planned)
```

## Rules

- Prefer **Unknown** over guessing Healthy.
- **Degraded** should name *what* is degraded (latency, freshness, a feature path).
- **Maintenance** is planned; do not relabel incidents as maintenance after the fact.
- **Recovering** ends only when validation criteria for Healthy (or accepted Degraded) are met.

## What to Document

| Topic | Question |
| --- | --- |
| How state is determined | Signals, dashboards, health checks — [health-checks.md](health-checks.md), [monitoring.md](monitoring.md) |
| Who may declare state | Incident commander / on-call / automation — [operational-ownership.md](operational-ownership.md) |
| User-visible meaning | What customers or dependents experience in each state |
| Transitions | Notable automatic or manual transitions |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Suggested Status Block (for status pages or runbooks)

| Field | Value |
| --- | --- |
| Capability | |
| State | Healthy / Degraded / Unavailable / Recovering / Maintenance / Unknown |
| Since | ISO-8601 timestamp |
| Evidence | |
| Next update | |

## Related Documents

- [degradation.md](degradation.md)
- [health-checks.md](health-checks.md)
- [incident-management.md](incident-management.md)
- [maintenance.md](maintenance.md)
- [operations-model.md](operations-model.md)
