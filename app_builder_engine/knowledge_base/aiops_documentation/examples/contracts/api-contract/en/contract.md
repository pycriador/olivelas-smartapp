---
title: "Contract: notify.send (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
contract_type: "API"
producer: "notify-service"
consumer: "ordering-system"
contract_id: "notify-send-api@v1"
---

# Contract: notify.send

> Language: EN | [Português (pt-BR)](../pt-BR/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: notify-send-api@v1
>
> **Fictional example — not a real project.**

## Purpose

Accept a notification send request and return an acceptance identifier. Illustrates an API-style contract without mandating HTTP.

## Scope

| In scope | Out of scope |
| --- | --- |
| Request/response shape, errors, retry, versioning | Actual delivery to end channels (email/SMS/etc.) |
| Idempotent acceptance | Template content authoring |

## Participants

| Participant | Role | Notes | Classification |
| --- | --- | --- | --- |
| notify-service | producer / provider | Accepts send requests | Confirmed (example) |
| ordering-system | consumer / client | Fictional caller | Confirmed (example) |

## Producer

| Field | Value | Classification |
| --- | --- | --- |
| System / component | notify-service (fictional) | Confirmed (example) |
| Team / owner | example-team | Confirmed (example) |
| Evidence | fictional example | Confirmed (example) |

## Consumer

| Consumer | Notes | Classification |
| --- | --- | --- |
| ordering-system (fictional) | Order lifecycle notifications | Confirmed (example) |
| support-tooling (fictional) | Manual triggers | Confirmed (example) |

## Contract Type

- [x] API
- [ ] Event
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
| Protocol | Any request-response transport (RPC, HTTP-like, in-process — not prescribed) | Confirmed (example) |
| Interaction style | request-response | Confirmed (example) |

## Endpoint / Channel / Interface

| Field | Value | Classification |
| --- | --- | --- |
| Locator | operation `notify.send` (logical name) | Confirmed (example) |
| Method / operation / verb | `send` | Confirmed (example) |
| Notes | Transport binding is project-specific; do not assume a URL path | Confirmed (example) |

## Request / Input

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| recipient_id | string | yes | Target recipient identifier | Confirmed (example) |
| channel | string | yes | Channel key (e.g. `email`) | Confirmed (example) |
| template_id | string | yes | Template identifier | Confirmed (example) |
| attributes | object | no | Template attributes | Confirmed (example) |
| idempotency_key | string | no | Consumer-provided dedupe key | Confirmed (example) |

## Response / Output

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| acceptance_id | string | yes | Acknowledgement identifier | Confirmed (example) |
| status | string | yes | `accepted` on success | Confirmed (example) |

## Schema

```text
notify.send.request.v1:
  recipient_id: string
  channel: string
  template_id: string
  attributes?: object
  idempotency_key?: string

notify.send.response.v1:
  acceptance_id: string
  status: "accepted"
```

| Topic | Value | Classification |
| --- | --- | --- |
| Schema location | embedded in this document (example) | Confirmed (example) |
| Schema format | illustrative text schema | Confirmed (example) |

## Semantics

| Concept | Meaning | Side effects | Classification |
| --- | --- | --- | --- |
| `accepted` | Request validated and queued for delivery | May enqueue async work; delivery itself is out of scope | Confirmed (example) |
| `channel` | Logical delivery channel key | Selects routing rules | Confirmed (example) |

## Authentication

| Mechanism | Notes | Classification |
| --- | --- | --- |
| Caller credential (project-defined) | Token/secret values never documented | Confirmed (example) |

## Authorization

| Rule | Notes | Classification |
| --- | --- | --- |
| Tenant-scoped send | Caller limited to own tenant | Confirmed (example) |

## Validation

| Rule | Applied where | Notes | Classification |
| --- | --- | --- | --- |
| Required fields present | producer | Fail with `invalid_request` | Confirmed (example) |
| Known `channel` / `template_id` | producer | Fail with `invalid_request` | Confirmed (example) |

## Errors

| Error / Condition | Retryable | Consumer Action | Classification |
| --- | --- | --- | --- |
| `invalid_request` | no | Fix payload and resubmit | Confirmed (example) |
| `unauthorized` | no | Refresh credentials | Confirmed (example) |
| `dependency_unavailable` | yes | Retry with backoff | Confirmed (example) |

## Retry Behavior

| Topic | Value | Classification |
| --- | --- | --- |
| Retryable conditions | `dependency_unavailable` | Confirmed (example) |
| Max attempts | 3 | Confirmed (example) |
| Backoff | exponential | Confirmed (example) |
| Non-retryable conditions | `invalid_request`, `unauthorized` | Confirmed (example) |

## Timeout

| Timeout | Value | Classification |
| --- | --- | --- |
| Client / consumer timeout | 3s (illustrative) | Confirmed (example) |
| Server / producer timeout | Unknown | Unknown |

## Idempotency

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes, when `idempotency_key` provided | Confirmed (example) |
| Idempotency key / strategy | consumer-provided key; same key returns same `acceptance_id` | Confirmed (example) |

## Ordering

| Topic | Value | Classification |
| --- | --- | --- |
| Ordering guarantee | none | Confirmed (example) |
| Notes | Concurrent sends are independent | Confirmed (example) |

## Delivery Semantics

| Topic | Value | Classification |
| --- | --- | --- |
| Delivery guarantee | Not Applicable (sync acceptance only) | Confirmed (example) |
| Acknowledgement model | response payload = acceptance | Confirmed (example) |
| Notes | End-channel delivery is a separate concern | Confirmed (example) |

## Versioning

| Topic | Value | Classification |
| --- | --- | --- |
| Current version | v1 | Confirmed (example) |
| Version strategy | additive optional fields preferred | Confirmed (example) |
| Deprecation policy | announce before field/operation removal | Confirmed (example) |
| Contract ID | notify-send-api@v1 | Confirmed (example) |

## Compatibility

| Change type | Compatible? | Notes |
| --- | --- | --- |
| Additive optional field | yes | Preferred |
| Field removal | no | Requires major version |
| Type change | no | Requires major version |
| Semantic change | no | Requires major version |

## Examples

### Example — success

```text
operation: notify.send
request:
  recipient_id: "user-123"
  channel: "email"
  template_id: "order-shipped"
  attributes: { order_id: "o-1" }
  idempotency_key: "9f3c-demo"

response:
  acceptance_id: "acc-456"
  status: "accepted"
```

### Example — error

```text
operation: notify.send
error:
  code: "invalid_request"
  message: "channel is required"
```

## Related Components

| Component | Relationship | Path / ID |
| --- | --- | --- |
| notify-service | producer | fictional |
| ordering-system | consumer | fictional |

## Related Architecture

| Document | Path |
| --- | --- |
| Architecture overview | Not Applicable (standalone contract example) |
| Methodology | [docs/en/api-contracts.md](../../../../docs/en/api-contracts.md) |
