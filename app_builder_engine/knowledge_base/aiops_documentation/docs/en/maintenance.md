# Maintenance

> Language: EN | [Português (pt-BR)](../pt-BR/maintenance.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document planned maintenance that intentionally affects availability, capacity, or operability.

## Purpose

Maintenance is **planned** work with an expected operational impact window. It is distinct from incidents ([incident-management.md](incident-management.md)) and from emergency changes ([change-management.md](change-management.md)).

## What to Document

| Topic | Question |
| --- | --- |
| Scope | Systems, environments, user journeys affected |
| Window | Start / end (timezone explicit) or duration |
| Impact | Expected state: Degraded / Unavailable / Maintenance — [operational-state.md](operational-state.md) |
| Reason | Why the work is needed |
| Owner | Who executes and who communicates |
| Procedure | Steps or link to runbook / change ticket |
| Validation | How return to Healthy is confirmed |
| Rollback / abort | How to stop if the window goes badly |
| Communication | Audience and channels |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Guidance

- Announce impact honestly; do not schedule “zero impact” maintenance that routinely breaks users.
- Prefer linking to the deploy/change procedure over duplicating commands ([deployment-operations.md](deployment-operations.md)).
- Record whether SLOs/error budgets treat the window as exclusion — only if that is true ([error-budget.md](error-budget.md), [service-levels.md](service-levels.md)).
- After maintenance, update docs if the change altered architecture, contracts, or runbooks ([change-policy.md](change-policy.md)).

## When Not Applicable

Batch jobs or libraries with no shared runtime may mark formal maintenance windows **Not Applicable**. Still document how upgrades are performed if operators need that knowledge.

## Related Documents

- [operational-state.md](operational-state.md)
- [change-management.md](change-management.md)
- [deployment-operations.md](deployment-operations.md)
- [rollback.md](rollback.md)
- [operational-ownership.md](operational-ownership.md)
