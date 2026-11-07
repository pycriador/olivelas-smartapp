# Contract: inventory.adjusted

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/contracts/inventory-adjusted.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: inventory.adjusted@v1
>
> **Fictional example — not a real project.**

## Overview

Event published when inventory quantity changes in the write model.

## Producer

| Field | Value |
| --- | --- |
| System / component | inventory-write (fictional) |
| Team / owner | example-team |
| Evidence | fictional example |

## Consumer

| Consumer | Notes |
| --- | --- |
| inventory-projector | Updates projection store |

## Type

- [ ] API
- [x] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Interface
- [ ] Other:

## Protocol

| Field | Value | Classification |
| --- | --- | --- |
| Protocol | Event bus topic/stream (technology-agnostic) | Confirmed (example) |
| Interaction style | fire-and-forget (with at-least-once delivery assumption) | Confirmed (example) |

## Input

| Field / part | Type | Required | Description |
| --- | --- | --- | --- |
| event_id | string | yes | Unique event identifier |
| sku | string | yes | Item identifier |
| quantity_delta | integer | yes | Signed adjustment |
| occurred_at | string (ISO 8601) | yes | Event time |
| version | integer | yes | Monotonic version per SKU |

## Output

| Field / part | Type | Required | Description |
| --- | --- | --- | --- |
| n/a | — | — | Fire-and-forget event; no response payload |

## Schema

```text
inventory.adjusted.v1:
  event_id: string
  sku: string
  quantity_delta: integer
  occurred_at: string
  version: integer
```

## Authentication

| Mechanism | Notes | Classification |
| --- | --- | --- |
| Bus credentials | Documented by name/source only | Confirmed (example) |

## Authorization

| Rule | Notes | Classification |
| --- | --- | --- |
| Produce ACL | Only inventory-write may publish | Confirmed (example) |
| Consume ACL | Projector may subscribe | Confirmed (example) |

## Errors

| Error | Condition | Consumer guidance |
| --- | --- | --- |
| schema_invalid | Payload does not match contract | Dead-letter; alert producer owners |
| apply_conflict | Version regression | Ignore or dead-letter per policy |

## Retry Behavior

| Topic | Value | Classification |
| --- | --- | --- |
| Retryable errors | transient store failures | Confirmed (example) |
| Max attempts | 5 | Confirmed (example) |
| Backoff | exponential with jitter | Confirmed (example) |

## Timeout

| Timeout | Value | Classification |
| --- | --- | --- |
| Consumer processing timeout | 30s | Confirmed (example) |
| Not Applicable | response timeout N/A for event | Confirmed (example) |

## Idempotency

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes | Confirmed (example) |
| Idempotency key / strategy | `event_id` + per-SKU `version` checks | Confirmed (example) |

## Versioning

| Topic | Value |
| --- | --- |
| Current version | v1 |
| Version strategy | additive optional fields preferred |
| Deprecation policy | dual-publish during migration |

## Compatibility

| Change type | Compatible? | Notes |
| --- | --- | --- |
| Additive optional field | yes | Consumers ignore unknown fields |
| Field removal | no | Requires new version |
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
# Consumer-side handling example (not a bus response):
# schema_invalid → dead-letter + alert
```

## Related Documentation

| Document | Path |
| --- | --- |
| Integration | [../application/integration-inventory-adjusted.md](../application/integration-inventory-adjusted.md) |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| ADR | [../decisions/adr-001-async-projection.md](../decisions/adr-001-async-projection.md) |
