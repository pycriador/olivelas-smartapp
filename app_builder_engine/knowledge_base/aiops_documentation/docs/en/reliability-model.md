# Reliability Model

> Language: EN | [Português (pt-BR)](../pt-BR/reliability-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document the reliability posture of a system: what it depends on, how it fails, how it degrades, and how it recovers.

Ground claims in [architecture](architecture-model.md) and [failure domains](failure-domains.md). Do not invent redundancy or capacity that is not present.

## Scope

A project reliability model typically covers:

| Topic | Document here or link |
| --- | --- |
| Dependencies | Critical runtime deps; see also [dependency-reliability.md](dependency-reliability.md) |
| SPOFs | Single points of failure (Confirmed / Inferred / Unknown) |
| Failure modes | Catalog or summary — [failure-modes.md](failure-modes.md) |
| Degradation | Graceful / hard / partial — [degradation.md](degradation.md) |
| Recovery | Paths back to healthy — runbooks, failover, restore |
| Redundancy | What is actually replicated or multi-homed |
| Limits | Hard limits, quotas, saturation points |
| Capacity | Relevant metrics only — [capacity.md](capacity.md) |

Mark sections **Not Applicable** when they do not apply (e.g. no redundancy by design for a batch tool).

## Dependencies

List material dependencies and whether they are required for core paths. Prefer the architecture dependency map plus an operational view:

| Dependency | Type | Required for | Criticality | Notes |
| --- | --- | --- | --- | --- |
| | runtime / data / identity / … | | | |

Align types with [operational-dependencies.md](operational-dependencies.md).

## Single Points of Failure (SPOF)

A SPOF is a component whose failure makes a material capability unavailable with no effective alternate path.

| Candidate SPOF | Capability impacted | Mitigated? | How / why not | Classification |
| --- | --- | --- | --- | --- |
| | | yes / no / partial | | |

Do not claim “no SPOFs” without evidence. Prefer Unknown over false comfort.

## Failure Modes and Propagation

Summarize the important modes; detail in [failure-modes.md](failure-modes.md) and [failure-propagation.md](failure-propagation.md). Link architectural isolation to [failure-domains.md](failure-domains.md).

## Degradation and Recovery

| Capability | On dependency failure | Degradation type | Recovery path | Runbook |
| --- | --- | --- | --- | --- |
| | | graceful / hard / partial / Unknown | | |

See [degradation.md](degradation.md).

## Redundancy

Document **actual** redundancy:

| Layer | Redundancy present? | What it protects | What it does not protect |
| --- | --- | --- | --- |
| Process / instance | | | |
| Data store | | | |
| Region / site | | | Not Applicable if single-site |

Multiple instances behind one shared datastore still share that datastore as a failure domain.

## Limits and Capacity

Record known limits (payload size, concurrency, queue depth, rate limits) and point to [capacity.md](capacity.md) / [scaling.md](scaling.md). Contract-level limits may also appear in contracts — link rather than duplicate.

## Integration with Contracts

Reliability behavior at boundaries should match documented contract semantics:

- retries and timeouts — [retry-policy.md](retry-policy.md), [timing-contract.md](timing-contract.md)
- duplicate handling — [idempotency.md](idempotency.md)
- delivery guarantees — [delivery-semantics.md](delivery-semantics.md)

If operations assume “clients will retry” but the contract says otherwise, that is drift — fix one of them.

## Related Documents

- [operations-model.md](operations-model.md)
- [failure-domains.md](failure-domains.md)
- [failure-modes.md](failure-modes.md)
- [dependency-reliability.md](dependency-reliability.md)
- [capacity.md](capacity.md)
- [architecture-model.md](architecture-model.md)
