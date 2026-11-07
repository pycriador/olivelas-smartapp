---
title: "Contract: inventory.adjusted (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
contract_type: "Event"
producer: "inventory-write"
consumer: "inventory-projector"
contract_id: "inventory.adjusted@v1"
---

# Contract: inventory.adjusted

> Language: EN | [Português (pt-BR)](../pt-BR/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: inventory.adjusted@v1
>
> **Fictional example — not a real project.**

## Purpose

Publish a fact when inventory quantity changes in the write model so consumers can update projections.

## Scope

| In scope | Out of scope |
| --- | --- |
| Event payload, delivery expectations, consumer handling | How the write model computes quantity |
| Per-SKU versioning | UI or reporting presentation |

## Participants

| Participant | Role | Notes | Classification |
| --- | --- | --- | --- |
| inventory-write | producer | Publishes the event | Confirmed (example) |
| inventory-projector | consumer | Applies to projection store | Confirmed (example) |

## Producer

| Field | Value | Classification |
| --- | --- | --- |
| System / component | inventory-write (fictional) | Confirmed (example) |
| Team / owner | example-team | Confirmed (example) |
| Evidence | fictional example | Confirmed (example) |

## Consumer

| Consumer | Notes | Classification |
| --- | --- | --- |
| inventory-projector (fictional) | Updates projection store | Confirmed (example) |

## Contract Type

- [ ] API
- [x] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Callback
- [ ] Library
- [ ] Data
- [ ] Integration
- [ ] Other:

## Protocol

| Field | Value | Classification |
| --- | --- | --- |
| Protocol | Event bus topic/stream (technology-agnostic) | Confirmed (example) |
| Interaction style | fire-and-forget (with at-least-once delivery assumption) | Confirmed (example) |

## Endpoint / Channel / Interface

| Field | Value | Classification |
| --- | --- | --- |
| Locator | topic/stream `inventory.adjusted` (logical) | Confirmed (example) |
| Method / operation / verb | Not Applicable | Confirmed (example) |
| Notes | Binding name is project-specific | Confirmed (example) |

## Request / Input

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| event_id | string | yes | Unique event identifier | Confirmed (example) |
| sku | string | yes | Item identifier | Confirmed (example) |
| quantity_delta | integer | yes | Signed adjustment | Confirmed (example) |
| occurred_at | string (ISO 8601) | yes | Event time | Confirmed (example) |
| version | integer | yes | Monotonic version per SKU | Confirmed (example) |

## Response / Output

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| n/a | — | — | Fire-and-forget; no response payload | Confirmed (example) |

## Schema

```text
inventory.adjusted.v1:
  event_id: string
  sku: string
  quantity_delta: integer
  occurred_at: string
  version: integer
```

| Topic | Value | Classification |
| --- | --- | --- |
| Schema location | embedded in this document (example) | Confirmed (example) |
| Schema format | illustrative text schema | Confirmed (example) |

## Semantics

| Concept | Meaning | Side effects | Classification |
| --- | --- | --- | --- |
| `quantity_delta` | Signed change; negative = decrease | Projection must apply delta, not replace absolute stock unless documented elsewhere | Confirmed (example) |
| `version` | Monotonic per SKU | Consumers detect gaps/regressions | Confirmed (example) |

## Authentication

| Mechanism | Notes | Classification |
| --- | --- | --- |
| Bus credentials | Documented by name/source only | Confirmed (example) |

## Authorization

| Rule | Notes | Classification |
| --- | --- | --- |
| Produce ACL | Only inventory-write may publish | Confirmed (example) |
| Consume ACL | Projector may subscribe | Confirmed (example) |

## Validation

| Rule | Applied where | Notes | Classification |
| --- | --- | --- | --- |
| Schema match | consumer | `schema_invalid` → dead-letter | Confirmed (example) |
| Version not regressing | consumer | `apply_conflict` handling | Confirmed (example) |

## Errors

| Error / Condition | Retryable | Consumer Action | Classification |
| --- | --- | --- | --- |
| `schema_invalid` | no | Dead-letter; alert producer owners | Confirmed (example) |
| `apply_conflict` | no | Ignore or dead-letter per policy | Confirmed (example) |
| transient store failure | yes | Retry with backoff | Confirmed (example) |

## Retry Behavior

| Topic | Value | Classification |
| --- | --- | --- |
| Retryable conditions | transient store failures | Confirmed (example) |
| Max attempts | 5 | Confirmed (example) |
| Backoff | exponential with jitter | Confirmed (example) |
| Non-retryable conditions | `schema_invalid`, version regression | Confirmed (example) |

## Timeout

| Timeout | Value | Classification |
| --- | --- | --- |
| Consumer processing timeout | 30s | Confirmed (example) |
| Other | response timeout N/A for event | Confirmed (example) |

## Idempotency

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes | Confirmed (example) |
| Idempotency key / strategy | `event_id` + per-SKU `version` checks | Confirmed (example) |

## Ordering

| Topic | Value | Classification |
| --- | --- | --- |
| Ordering guarantee | per-key (`sku`) | Confirmed (example) |
| Notes | Global order across SKUs not guaranteed | Confirmed (example) |

## Delivery Semantics

| Topic | Value | Classification |
| --- | --- | --- |
| Delivery guarantee | at-least-once | Confirmed (example) |
| Acknowledgement model | consumer ack after durable apply | Confirmed (example) |
| Notes | Duplicates expected; idempotency required | Confirmed (example) |

## Versioning

| Topic | Value | Classification |
| --- | --- | --- |
| Current version | v1 | Confirmed (example) |
| Version strategy | additive optional fields preferred | Confirmed (example) |
| Deprecation policy | dual-publish during migration | Confirmed (example) |
| Contract ID | inventory.adjusted@v1 | Confirmed (example) |

## Compatibility

| Change type | Compatible? | Notes |
| --- | --- | --- |
| Additive optional field | yes | Consumers ignore unknown fields |
| Field removal | no | Requires new version |
| Type change | no | Requires new version |
| Semantic change | no | Requires new version |

## Examples

### Example — success

```text
{
  "event_id": "evt-100",
  "sku": "SKU-42",
  "quantity_delta": -2,
  "occurred_at": "2026-08-07T12:00:00Z",
  "version": 17
}
```

### Example — error

```text
# Consumer-side handling (not a bus response):
# schema_invalid → dead-letter + alert
```

## Related Components

| Component | Relationship | Path / ID |
| --- | --- | --- |
| inventory-write | producer | fictional |
| inventory-projector | consumer | fictional |

## Related Architecture

| Document | Path |
| --- | --- |
| Architecture overview | Not Applicable (standalone contract example) |
| Methodology | [docs/en/event-contracts.md](../../../../docs/en/event-contracts.md) |
