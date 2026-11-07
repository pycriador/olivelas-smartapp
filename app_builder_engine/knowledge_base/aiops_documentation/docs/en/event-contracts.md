# Event Contracts

> Language: EN | [Português (pt-BR)](../pt-BR/event-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Guidance for documenting **event** contracts: facts about something that **happened**.

## Event vs Command

| | Event | Command |
| --- | --- | --- |
| Nature | Past fact | Request that something happen |
| Intent | Inform interested parties | Instruct a handler |
| Naming | Often past tense (`OrderAccepted`) | Often imperative (`AcceptOrder`) |
| Failure meaning | Emission/delivery/handling issues | Handler may reject the request |

Do not document a command as an "event" because it travels on a bus. If the payload asks for work to be done, treat it as a Command (possibly Message + Command).

## Document When Applicable

| Topic | Guidance |
| --- | --- |
| Event name | Stable identifier |
| Producer | Who emits |
| Consumer | Who handles (list known; Unknown if not identified) |
| Event schema | Payload fields ([schema-documentation.md](schema-documentation.md)) |
| Event semantics | What occurrence the event represents |
| Timestamp | Event time vs emission time; clock assumptions |
| Identifier | Event id uniqueness and stability |
| Correlation | Ties to a business/transaction conversation |
| Causation | Links to the causing message/event/command |
| Ordering | [ordering.md](ordering.md) |
| Delivery | [delivery-semantics.md](delivery-semantics.md) |
| Retry | Producer republish vs consumer retry — [retry-policy.md](retry-policy.md) |
| Duplication | Duplicate emission/delivery expectations — [idempotency.md](idempotency.md) |
| Versioning | [contract-versioning.md](contract-versioning.md) |

## Minimal Clarity Bar

An event contract should make clear:

1. What happened (semantics).
2. What data accompanies the fact (schema).
3. What consumers may assume about delivery, order, and duplicates.
4. How the event version evolves.

## Related Documents

- [contract-types.md](contract-types.md)
- [message-contracts.md](message-contracts.md)
- [delivery-semantics.md](delivery-semantics.md)
- [ordering.md](ordering.md)
- [semantic-contracts.md](semantic-contracts.md)
