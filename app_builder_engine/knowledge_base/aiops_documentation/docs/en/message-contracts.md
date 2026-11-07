# Message Contracts

> Language: EN | [Português (pt-BR)](../pt-BR/message-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Guidance for documenting **message** contracts: discrete units of communication between a sender and a receiver.

Do **not** assume that all messaging systems share the same mechanisms (acknowledgement, dead-letter, transactions, keys). Document what **this** boundary actually provides.

## Document When Applicable

| Topic | Guidance |
| --- | --- |
| Message type | Stable type/name of the message |
| Sender | Who sends |
| Receiver | Who receives |
| Payload | Body schema + semantics |
| Metadata | Headers/attributes that are part of the agreement |
| Delivery | [delivery-semantics.md](delivery-semantics.md) |
| Acknowledgement | What ack/nack means here, if anything |
| Retry | Redelivery and client retry — [retry-policy.md](retry-policy.md) |
| Dead-letter / failure handling | Where poison/failed messages go, if applicable |
| Ordering | [ordering.md](ordering.md) |
| Idempotency | [idempotency.md](idempotency.md) |

## Heterogeneity

| Mechanism | Document only if used |
| --- | --- |
| Ack / nack | Meaning of success vs failure ack |
| Visibility timeout / lock | Concurrent receive behavior |
| Dead-letter / poison queue | Entry conditions and ownership |
| Priority | Whether priority is honored |
| TTL / expiry | Message lifetime |
| Transactions / outbox | Atomicity claims — with evidence |

If a mechanism does not exist, write Not Applicable — do not invent platform features.

## Overlap with Events and Commands

- An event may be carried as a message → Event + Message.
- A command may be carried as a message → Command + Message.
- State the primary intent (fact vs instruction) clearly.

## Related Documents

- [event-contracts.md](event-contracts.md)
- [delivery-semantics.md](delivery-semantics.md)
- [retry-policy.md](retry-policy.md)
- [idempotency.md](idempotency.md)
- [ordering.md](ordering.md)
