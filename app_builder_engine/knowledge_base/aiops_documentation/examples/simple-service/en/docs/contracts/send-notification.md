# Contract: send-notification

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/contracts/send-notification.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: send-notification@v1
>
> **Fictional example — not a real project.**

## Overview

Synchronous contract for accepting a notification request and returning an acceptance ID.

## Producer

| Field | Value |
| --- | --- |
| System / component | notification-api |
| Team / owner | example-team |
| Evidence | fictional example |

## Consumer

| Consumer | Notes |
| --- | --- |
| ordering-system (fictional) | Sends order-related notifications |
| support-tooling (fictional) | Manual triggers |

## Type

- [x] API
- [ ] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Interface
- [ ] Other:

## Protocol

| Field | Value | Classification |
| --- | --- | --- |
| Protocol | HTTP-like request/response (illustrative) | Confirmed (example) |
| Interaction style | request-response | Confirmed (example) |

## Input

| Field / part | Type | Required | Description |
| --- | --- | --- | --- |
| recipient_id | string | yes | Target recipient identifier |
| channel | string | yes | Notification channel key |
| template_id | string | yes | Template identifier |
| attributes | object | no | Template attributes |

## Output

| Field / part | Type | Required | Description |
| --- | --- | --- | --- |
| acceptance_id | string | yes | Acknowledgement identifier |
| status | string | yes | `accepted` |

## Schema

```text
request:
  recipient_id: string
  channel: string
  template_id: string
  attributes?: object

response:
  acceptance_id: string
  status: "accepted"
```

## Authentication

| Mechanism | Notes | Classification |
| --- | --- | --- |
| Bearer token | Token value never documented | Confirmed (example) |

## Authorization

| Rule | Notes | Classification |
| --- | --- | --- |
| Tenant-scoped send | Consumer limited to own tenant | Confirmed (example) |

## Errors

| Error | Condition | Consumer guidance |
| --- | --- | --- |
| `invalid_request` | Payload validation failed | Fix request and retry |
| `unauthorized` | Auth failed | Refresh credentials |
| `store_unavailable` | Dependency failure | Retry with backoff |

## Retry Behavior

| Topic | Value | Classification |
| --- | --- | --- |
| Retryable errors | `store_unavailable` | Confirmed (example) |
| Max attempts | 3 | Confirmed (example) |
| Backoff | exponential | Confirmed (example) |

## Timeout

| Timeout | Value | Classification |
| --- | --- | --- |
| Client / consumer timeout | 3s | Confirmed (example) |
| Server / producer timeout | Unknown | Unknown |

## Idempotency

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes, when `Idempotency-Key` provided | Confirmed (example) |
| Idempotency key / strategy | consumer-provided key | Confirmed (example) |

## Versioning

| Topic | Value |
| --- | --- |
| Current version | v1 |
| Version strategy | additive changes preferred |
| Deprecation policy | announce before removal |

## Compatibility

| Change type | Compatible? | Notes |
| --- | --- | --- |
| Additive optional field | yes | Preferred |
| Field removal | no | Requires major version |
| Semantic change | no | Requires major version |

## Examples

### Example — success

```text
POST /notifications
Idempotency-Key: 9f3c...

{
  "recipient_id": "user-123",
  "channel": "email",
  "template_id": "order-shipped",
  "attributes": { "order_id": "o-1" }
}

→ 200
{
  "acceptance_id": "acc-456",
  "status": "accepted"
}
```

### Example — error

```text
→ 400
{
  "error": "invalid_request",
  "message": "channel is required"
}
```

## Related Documentation

| Document | Path |
| --- | --- |
| Component | [../application/notification-api.md](../application/notification-api.md) |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| ADR | [../decisions/adr-001-sync-request-response.md](../decisions/adr-001-sync-request-response.md) |
