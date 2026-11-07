# Dependency Reliability

> Language: EN | [Português (pt-BR)](../pt-BR/dependency-reliability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document the reliability expectations and failure handling for dependencies the system relies on.

Use this as an operational companion to architecture dependency maps and to [operational-dependencies.md](operational-dependencies.md) (dependency *kinds*).

## Required Table Shape

Document material dependencies with at least:

| Dependency | Criticality | Failure Impact | Detection | Mitigation | Recovery |
| --- | --- | --- | --- | --- | --- |
| | See [criticality.md](criticality.md) | What breaks for users/us | How we notice | Automatic or manual soften | How we restore or wait |

Example row style (illustrative):

| Dependency | Criticality | Failure Impact | Detection | Mitigation | Recovery |
| --- | --- | --- | --- | --- | --- |
| Identity provider | Critical | Login and authenticated APIs fail | Auth error rate / health | Cache tokens if applicable; else hard fail | Wait for provider; status page; escalate |
| Analytics sink | Low | Loss of secondary metrics | Export lag alert | Drop or buffer events | Replay / backfill if supported |

Replace with project facts. Mark Unknown fields explicitly.

## Field Guidance

| Column | Guidance |
| --- | --- |
| Dependency | Stable name; link to architecture / contract |
| Criticality | Project scale; no auto-classify |
| Failure Impact | User journeys, data, SLOs affected |
| Detection | Metric, log, probe, synthetic, customer report |
| Mitigation | Timeout, circuit break, degrade, queue, fail fast — as implemented |
| Recovery | Failover, retry budget, manual runbook, restore |

## Owner and Contract Links

| Also record when useful | Where |
| --- | --- |
| Dependency owner | [operational-ownership.md](operational-ownership.md) |
| Interaction rules | Contract docs ([contract-model.md](contract-model.md)) |
| Retry / timeout | [retry-policy.md](retry-policy.md), [timing-contract.md](timing-contract.md) |
| Failure domain | [failure-domains.md](failure-domains.md) |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Table for critical runtime dependencies only |
| Medium | All runtime deps that can page someone |
| Large | Runtime + key operational deps; review on architecture change |

## Anti-Patterns

- Listing every library as a dependency row.
- Mitigation column filled with industry buzzwords not present in the system.
- Critical dependency with empty Detection and no owner.

## Related Documents

- [operational-dependencies.md](operational-dependencies.md)
- [reliability-model.md](reliability-model.md)
- [failure-propagation.md](failure-propagation.md)
- [criticality.md](criticality.md)
- [component-relationships.md](component-relationships.md)
