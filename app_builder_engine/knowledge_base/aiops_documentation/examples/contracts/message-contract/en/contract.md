---
title: "Contract: fulfillment.start (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
contract_type: "Message"
# Also Command intent — primary type Message with command semantics
producer: "order-api"
consumer: "fulfillment-worker"
contract_id: "fulfillment.start@v1"
---

# Contract: fulfillment.start

> Language: EN | [Português (pt-BR)](../pt-BR/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: fulfillment.start@v1
>
> **Fictional example — not a real project.**

## Purpose

Instruct the fulfillment worker to start fulfillment for an accepted order. This is a **command/message** (instruction), not a domain event (fact).

## Scope

| In scope | Out of scope |
| --- | --- |
| Message payload, ack/retry, idempotency | Warehouse execution details |
| Sender → receiver agreement | Order acceptance API |

## Participants

| Participant | Role | Notes | Classification |
| --- | --- | --- | --- |
| order-api | sender / producer | Emits the command message | Confirmed (example) |
| fulfillment-worker | receiver / consumer | Executes fulfillment start | Confirmed (example) |

## Producer

| Field | Value | Classification |
| --- | --- | --- |
| System / component | order-api (fictional) | Confirmed (example) |
| Team / owner | example-team | Confirmed (example) |
| Evidence | fictional example | Confirmed (example) |

## Consumer

| Consumer | Notes | Classification |
| --- | --- | --- |
| fulfillment-worker (fictional) | Starts fulfillment workflow | Confirmed (example) |

## Contract Type

- [ ] API
- [ ] Event
- [x] Message
- [ ] File
- [x] Command
- [ ] Callback
- [ ] Library
- [ ] Data
- [ ] Integration
- [ ] Other:

Primary intent: **Command** carried as a **Message**.

## Protocol

| Field | Value | Classification |
| --- | --- | --- |
| Protocol | Message queue / channel (technology-agnostic) | Confirmed (example) |
| Interaction style | fire-and-forget with acknowledgement | Confirmed (example) |

## Endpoint / Channel / Interface

| Field | Value | Classification |
| --- | --- | --- |
| Locator | queue/channel `fulfillment.commands` (logical) | Confirmed (example) |
| Method / operation / verb | `start` | Confirmed (example) |
| Notes | Message type name: `fulfillment.start` | Confirmed (example) |

## Request / Input

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| message_id | string | yes | Unique message identifier | Confirmed (example) |
| order_id | string | yes | Order to fulfill | Confirmed (example) |
| warehouse_code | string | yes | Target warehouse key | Confirmed (example) |
| requested_at | string (ISO 8601) | yes | Command issuance time | Confirmed (example) |
| correlation_id | string | no | Trace / saga correlation | Confirmed (example) |

## Response / Output

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| n/a | — | — | No sync response; ack is transport-level | Confirmed (example) |

## Schema

```text
fulfillment.start.v1:
  message_id: string
  order_id: string
  warehouse_code: string
  requested_at: string
  correlation_id?: string
```

| Topic | Value | Classification |
| --- | --- | --- |
| Schema location | embedded in this document (example) | Confirmed (example) |
| Schema format | illustrative text schema | Confirmed (example) |

## Semantics

| Concept | Meaning | Side effects | Classification |
| --- | --- | --- | --- |
| `fulfillment.start` | Instruction to begin fulfillment | Worker may create fulfillment job | Confirmed (example) |
| Duplicate `message_id` | Same instruction | Must not create duplicate jobs | Confirmed (example) |

## Authentication

| Mechanism | Notes | Classification |
| --- | --- | --- |
| Channel credentials | Documented by name/source only | Confirmed (example) |

## Authorization

| Rule | Notes | Classification |
| --- | --- | --- |
| Produce ACL | Only order-api may send | Confirmed (example) |
| Consume ACL | Only fulfillment-worker may receive | Confirmed (example) |

## Validation

| Rule | Applied where | Notes | Classification |
| --- | --- | --- | --- |
| Required fields | consumer | Reject → dead-letter | Confirmed (example) |
| Known `warehouse_code` | consumer | Reject → dead-letter | Confirmed (example) |

## Errors

| Error / Condition | Retryable | Consumer Action | Classification |
| --- | --- | --- | --- |
| `schema_invalid` | no | Dead-letter; alert sender owners | Confirmed (example) |
| `unknown_warehouse` | no | Dead-letter | Confirmed (example) |
| `dependency_unavailable` | yes | Nack / redelivery with backoff | Confirmed (example) |

## Retry Behavior

| Topic | Value | Classification |
| --- | --- | --- |
| Retryable conditions | `dependency_unavailable`, transient lock failures | Confirmed (example) |
| Max attempts | 5 | Confirmed (example) |
| Backoff | exponential with jitter | Confirmed (example) |
| Non-retryable conditions | `schema_invalid`, `unknown_warehouse` | Confirmed (example) |

## Timeout

| Timeout | Value | Classification |
| --- | --- | --- |
| Visibility / processing lock | 60s (illustrative) | Confirmed (example) |
| Other | Not Applicable if platform has no visibility timeout | Confirmed (example) |

## Idempotency

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes | Confirmed (example) |
| Idempotency key / strategy | `message_id` (and/or `order_id` uniqueness for start) | Confirmed (example) |

## Ordering

| Topic | Value | Classification |
| --- | --- | --- |
| Ordering guarantee | per-key (`order_id`) preferred; not globally required | Confirmed (example) |
| Notes | Parallel processing across different orders is allowed | Confirmed (example) |

## Delivery Semantics

| Topic | Value | Classification |
| --- | --- | --- |
| Delivery guarantee | at-least-once | Confirmed (example) |
| Acknowledgement model | ack after durable accept of the command | Confirmed (example) |
| Notes | Poison messages → dead-letter after max attempts | Confirmed (example) |

## Versioning

| Topic | Value | Classification |
| --- | --- | --- |
| Current version | v1 | Confirmed (example) |
| Version strategy | additive optional fields preferred | Confirmed (example) |
| Deprecation policy | dual-consume during migration | Confirmed (example) |
| Contract ID | fulfillment.start@v1 | Confirmed (example) |

## Compatibility

| Change type | Compatible? | Notes |
| --- | --- | --- |
| Additive optional field | yes | Preferred |
| Field removal | no | Requires new message version |
| Type change | no | Requires new message version |
| Semantic change | no | Requires new message version |

## Examples

### Example — success

```text
{
  "message_id": "msg-778",
  "order_id": "ord-1001",
  "warehouse_code": "WH-SP-01",
  "requested_at": "2026-08-07T15:30:00Z",
  "correlation_id": "corr-55"
}
# → consumer acks after starting fulfillment job
```

### Example — error

```text
# Consumer handling:
# unknown_warehouse → dead-letter (no retry)
```

## Related Components

| Component | Relationship | Path / ID |
| --- | --- | --- |
| order-api | sender | fictional |
| fulfillment-worker | receiver | fictional |

## Related Architecture

| Document | Path |
| --- | --- |
| Architecture overview | Not Applicable (standalone contract example) |
| Methodology | [docs/en/message-contracts.md](../../../../docs/en/message-contracts.md) |
