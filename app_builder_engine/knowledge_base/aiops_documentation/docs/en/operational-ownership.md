# Operational Ownership

> Language: EN | [Português (pt-BR)](../pt-BR/operational-ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Who is accountable for keeping a system running, diagnosing it, and escalating when it fails.

This extends [ownership.md](ownership.md) (documentation ownership) into **runtime and incident accountability**. Doc owner and operational owner may be the same team — or different. State both when they differ.

## Roles

The same team, squad, or role **may hold multiple roles**. Do not invent separate people for every column.

| Role | Meaning |
| --- | --- |
| **Service owner** | Accountable for the capability end-to-end (product/technical outcome) |
| **Technical owner** | Accountable for implementation, architecture fitness, and technical changes |
| **Operational owner** | Accountable for day-to-day operability: runbooks, monitoring, readiness |
| **On-call owner** | First responder for alerts and incidents in the defined window |
| **Escalation owner** | Next level when on-call cannot resolve or severity requires it |
| **Dependency owner** | Owner of an upstream/downstream dependency the service relies on (may be another team) |

Prefer durable identifiers (team / squad / role), not personal names that vanish after a reorg. See [ownership.md](ownership.md).

## Suggested Inventory

| Component / service | Service | Technical | Operational | On-call | Escalation | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

For each **material dependency**, record who owns it when failure impacts you:

| Dependency | Dependency owner | How to reach | Criticality | Notes |
| --- | --- | --- | --- | --- |
| | | | | See [criticality.md](criticality.md) |

Mark **Not Defined** when a role is intentionally unset (small projects often collapse roles into one team). Mark **Not Applicable** when a role does not make sense (e.g. no formal on-call).

## Responsibilities Snapshot

| Role | Typical duties |
| --- | --- |
| Service owner | Prioritize reliability work; accept risk trade-offs |
| Technical owner | Keep design and code aligned with reliability expectations |
| Operational owner | Keep signals, runbooks, and operational docs accurate |
| On-call | Detect → diagnose → respond; follow runbooks; escalate when stuck |
| Escalation | Unblock, coordinate, communicate externally when needed |
| Dependency owner | Own fixes on their side; share status during shared incidents |

## Integration with Documentation Ownership

| Concern | Document / field |
| --- | --- |
| Who maintains the *doc* | `owner` in frontmatter — [ownership.md](ownership.md) |
| Who owns the *service at runtime* | This document / project ops inventory |
| Who owns a *contract* | [contract-ownership.md](contract-ownership.md) |
| Who owns *architecture accuracy* | Architecture doc `owner` + [architecture-review.md](architecture-review.md) |

When operational ownership changes, update this inventory in the same change that transfers responsibility.

## Anti-Patterns

- Listing a person with no team backup as the only owner of a critical service.
- Claiming on-call coverage that does not exist.
- Leaving dependency owners blank when a dependency is Critical.
- Separating “doc owner” and “ops owner” without either knowing the other exists.

## Related Documents

- [ownership.md](ownership.md)
- [operations-model.md](operations-model.md)
- [alerting.md](alerting.md)
- [incident-management.md](incident-management.md)
- [criticality.md](criticality.md)
- [contract-ownership.md](contract-ownership.md)
