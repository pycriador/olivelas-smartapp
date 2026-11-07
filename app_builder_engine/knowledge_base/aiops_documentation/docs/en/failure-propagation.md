# Failure Propagation

> Language: EN | [Português (pt-BR)](../pt-BR/failure-propagation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How failures start, spread, get isolated, and create impact — and how to document that path.

Architectural blast radius belongs with [failure-domains.md](failure-domains.md). This document focuses on **propagation behavior** for operations and reliability analysis.

## Propagation Model

```text
Start → Propagate → Isolate (or fail to) → Impact
```

| Stage | Question |
| --- | --- |
| **Start** | Where does the failure originate? |
| **Propagate** | Through what paths does it spread? |
| **Isolate** | What limits blast radius (if anything)? |
| **Impact** | What is visible to users, integrators, or operators? |

If isolation is Unknown, say so. Do not invent circuit breakers or bulkheads that are not implemented.

## Common Propagation Paths (Examples)

| Path | Example |
| --- | --- |
| Synchronous call chain | A → B → C; C fails → A errors |
| Shared datastore | One noisy neighbor locks or saturates storage |
| Shared thread / worker pool | One stuck task blocks others |
| Poison event / message | Bad payload crashes consumers repeatedly |
| Retry amplification | Client retries overload a struggling dependency |
| Config / feature flag blast | Bad global config hits all instances |
| Identity / platform dependency | Auth provider outage blocks many apps |

Relate retry amplification to [retry-policy.md](retry-policy.md) and [idempotency.md](idempotency.md).

## Documentation Shape

| Origin | Propagation path | Isolation mechanism | Residual impact | Failure domain link | Classification |
| --- | --- | --- | --- | --- | --- |
| | | or None / Unknown | | [failure-domains.md](failure-domains.md) | |

## Start Conditions

Document typical starters when known:

- dependency outage;
- deploy / config change;
- traffic spike;
- data skew / poison input;
- resource exhaustion;
- Unknown (symptom-only incidents).

## Isolation vs Impact

| Situation | Document as |
| --- | --- |
| Failure contained to one domain | Isolation effective; limited impact |
| Failure crosses domains | Propagation path + missing isolation |
| Capability continues degraded | See [degradation.md](degradation.md) |
| Full stop | Hard failure; recovery path required |

## Link to Architecture

| Architecture view | Use for |
| --- | --- |
| [failure-domains.md](failure-domains.md) | What is inside a domain; intended isolation |
| [component-relationships.md](component-relationships.md) | Edges that can carry failure |
| [system-boundaries.md](system-boundaries.md) | External systems you do not control |
| [trust-boundaries.md](trust-boundaries.md) | Security boundaries (may or may not isolate failures) |

## Related Documents

- [failure-domains.md](failure-domains.md)
- [failure-modes.md](failure-modes.md)
- [reliability-model.md](reliability-model.md)
- [degradation.md](degradation.md)
- [dependency-reliability.md](dependency-reliability.md)
