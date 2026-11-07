# Ordering

> Language: EN | [Português (pt-BR)](../pt-BR/ordering.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document ordering guarantees for messages, events, or related operations under a contract.

## Ordering Modes

| Mode | Meaning |
| --- | --- |
| **Global order** | All items are totally ordered across the contract scope |
| **Key order** | Order preserved per partitioning key |
| **Entity order** | Order preserved per business entity (often similar to key order; name the entity) |
| **None / not guaranteed** | Consumers must not assume order |
| **Parallel processing** | Concurrent handling may reorder effects even if ingress had an order |

## Rules

1. **Declare explicitly when order is not guaranteed.** Silence is not a guarantee.
2. Do not imply FIFO from "queue" or "stream" without evidence of the actual keying and consumer concurrency model.
3. If producers emit in order but consumers process in parallel, document that **effect order may diverge**.
4. Classify claims (`Confirmed` / `Inferred` / `Unknown`).

## Documentation Form

| Topic | Value | Classification |
| --- | --- | --- |
| Ordering mode | global / key / entity / none / parallel / … | |
| Ordering key / entity | field or concept, if any | |
| Parallel consumers | yes / no / Unknown | |
| Reordering risk | description | |
| Not Applicable | reason if N/A | |

## Related Documents

- [delivery-semantics.md](delivery-semantics.md)
- [event-contracts.md](event-contracts.md)
- [message-contracts.md](message-contracts.md)
- [idempotency.md](idempotency.md)
