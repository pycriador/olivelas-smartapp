# Scaling

> Language: EN | [Português (pt-BR)](../pt-BR/scaling.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document scaling strategies for demand, data growth, and operational load.

Scaling is **not only adding machines**. Prefer documenting the strategies the project actually uses (or explicitly does not use).

## Strategy Types (Examples)

| Strategy | Meaning |
| --- | --- |
| **Horizontal scale-out** | More workers / instances |
| **Vertical scale-up** | Larger instances / more resources per unit |
| **Partitioning / sharding** | Split work or data by key |
| **Queueing / buffering** | Absorb spikes; smooth processing |
| **Caching** | Reduce load on expensive paths |
| **Throttling / admission control** | Shed or delay excess demand |
| **Async offload** | Move work off the synchronous path |
| **Read replicas / CQRS-style split** | Scale read vs write differently when used |
| **Backpressure** | Slow producers when consumers saturate |
| **Do not scale (finite capacity)** | Hard limit with explicit rejection — valid when documented |

Mark unused strategies **Not Applicable**. Mark unknown intent **Not Defined**.

## What to Document per Strategy

| Field | Question |
| --- | --- |
| Trigger | Manual decision, metric threshold, schedule? |
| Mechanism | What changes (count, size, partition map, limit)? |
| Limits | Ceiling, cost, coupling constraints |
| Risks | Hot keys, consistency, stampeding reconnects |
| Verification | How we know scaling helped |
| Rollback | How we scale back |
| Owner | Who may execute |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Coordination with Capacity and Reliability

```text
Demand → Capacity signals → Scaling (or throttle) → Observe result
```

- Limits: [capacity.md](capacity.md)
- Failure under load: [failure-modes.md](failure-modes.md)
- Degradation under load: [degradation.md](degradation.md)
- Contract expectations under load: retries/timeouts must not amplify overload — [retry-policy.md](retry-policy.md)

## Anti-Patterns

- “We scale horizontally” with a single-writer datastore that does not.
- Scaling runbooks without verification or rollback.
- Ignoring hot-key / skew limits that make scale-out ineffective.

## Related Documents

- [capacity.md](capacity.md)
- [reliability-model.md](reliability-model.md)
- [runbooks/README.md](runbooks/README.md)
- [operations-model.md](operations-model.md)
