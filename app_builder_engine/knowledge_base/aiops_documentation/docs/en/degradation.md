# Degradation

> Language: EN | [Português (pt-BR)](../pt-BR/degradation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document degraded behavior when the system cannot provide full capability.

Degradation is a reliability and resilience concern: staying partially useful can be better than failing closed — or worse, if partial mode corrupts data. Document what the system **actually** does.

## Types

| Type | Meaning |
| --- | --- |
| **Graceful degradation** | Non-critical features shed; core path continues with reduced quality or options |
| **Hard failure** | Capability stops; callers get errors or no progress |
| **Partial degradation** | Some tenants, regions, endpoints, or features fail while others work |

These are documentation categories, not product requirements. A project may only have hard failure for a given path — mark graceful degradation **Not Applicable** for that path.

## What to Document

| Field | Question |
| --- | --- |
| Trigger | What causes degradation? |
| User-visible behavior | What still works / what does not? |
| Operator signals | How do we know we are degraded? |
| Data safety | Is degraded mode safe (no silent corruption)? |
| Exit criteria | What restores full service? |
| Duration expectations | Unknown / Not Defined if no target |
| Runbook | Link if operators must act |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Suggested Table

| Capability | Trigger | Mode | Still works | Stops / worsens | Detection | Recovery |
| --- | --- | --- | --- | --- | --- | --- |
| | | graceful / hard / partial | | | | |

## Design Honesty

- Do not document “graceful degradation” as Confirmed for Proposed designs.
- If the only behavior is crash-and-retry, say **hard failure** and point to [retry-policy.md](retry-policy.md).
- Partial outages that look “healthy” globally need explicit detection ([health-checks.md](health-checks.md), [monitoring.md](monitoring.md)).

## Relationship to Operational State

Degraded runtime state should align with [operations-model.md](operations-model.md) and any operational-state vocabulary the project adopts (e.g. Healthy / Degraded / Unavailable). Link rather than redefine.

## Related Documents

- [reliability-model.md](reliability-model.md)
- [failure-modes.md](failure-modes.md)
- [failure-propagation.md](failure-propagation.md)
- [health-checks.md](health-checks.md)
- [incident-management.md](incident-management.md)
