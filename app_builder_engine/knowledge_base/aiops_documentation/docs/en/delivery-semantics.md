# Delivery Semantics

> Language: EN | [Português (pt-BR)](../pt-BR/delivery-semantics.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document delivery and interaction guarantees for a contract. Record the **real** guarantee of the system, not the strongest marketing label.

## Delivery Modes

| Mode | Meaning |
| --- | --- |
| **at-most-once** | A message/operation is delivered zero or one time; loss is possible |
| **at-least-once** | Delivered one or more times; duplicates are possible |
| **exactly-once** | Effectively processed once end-to-end under stated conditions |
| **best effort** | No strong delivery guarantee; opportunistic |

## Sync and Async

| Style | Meaning |
| --- | --- |
| **Synchronous** | Caller waits for a result within the interaction |
| **Asynchronous** | Result may arrive later (event, callback, poll, outbox) |

A contract may combine styles (sync accept + async completion). Document both phases when that is the real design.

## Exactly-Once Caution

Do **not** claim **exactly-once** casually.

Deduplication, unique keys, or "at-least-once plus idempotent consumer" may produce an **effectively once** business outcome under conditions — that is not the same as claiming platform-wide exactly-once delivery without stating those conditions.

When documenting exactly-once or effectively-once:

1. State the scope (producer, broker, consumer, end-to-end).
2. State the conditions and failure modes.
3. Classify the claim (`Confirmed` only with evidence).
4. If unsure, prefer **at-least-once** + [idempotency](idempotency.md) description, or **Unknown**.

## What to Document

| Topic | Guidance |
| --- | --- |
| Declared mode | One of the modes above, or a precise project term mapped to them |
| Sync / async | Interaction style |
| Duplicate handling | Who dedupes, how |
| Loss handling | What happens if delivery fails |
| Evidence | Link to code, platform config, or tests |

## Related Documents

- [idempotency.md](idempotency.md)
- [retry-policy.md](retry-policy.md)
- [ordering.md](ordering.md)
- [event-contracts.md](event-contracts.md)
- [message-contracts.md](message-contracts.md)
