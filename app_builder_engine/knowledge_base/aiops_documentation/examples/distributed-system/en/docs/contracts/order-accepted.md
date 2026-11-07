---
title: "Contract: order.accepted (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
---

# Contract: order.accepted

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/contracts/order-accepted.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: order.accepted@v1
>
> **Fictional example — not a real project.**

## Overview

Event published when an order has been accepted by `order-api` and is ready for asynchronous fulfillment.

## Producer

| Field | Value |
| --- | --- |
| System / component | order-api |
| Team / owner | example-team |
| Evidence | fictional example |

## Consumer

| Consumer | Notes |
| --- | --- |
| fulfillment-worker | Starts / updates fulfillment |

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
| Interaction style | fire-and-forget (at-least-once assumed) | Confirmed (example) |

## Input

| Field / part | Type | Required | Description |
| --- | --- | --- | --- |
| event_id | string | yes | Unique event identifier |
| order_id | string | yes | Accepted order identifier |
| customer_id | string | yes | Customer identifier |
| accepted_at | string (ISO 8601) | yes | Acceptance time |
| line_items | array | yes | SKU + quantity pairs |

## Output

| Field / part | Type | Required | Description |
| --- | --- | --- | --- |
| — | — | — | Event payload is the contract body |

## Schema

```text
order.accepted@v1:
  event_id: string
  order_id: string
  customer_id: string
  accepted_at: string
  line_items: [{ sku: string, quantity: integer }]
```

## Retry Behavior

| Topic | Value | Classification |
| --- | --- | --- |
| Delivery | at-least-once | Confirmed (example) |
| Consumer retries | yes, with backoff | Confirmed (example) |
| Idempotency | by `event_id` / `order_id` | Confirmed (example) |

## Versioning

| Topic | Value |
| --- | --- |
| Current version | v1 |
| Version strategy | additive changes preferred |
| Deprecation policy | announce before removal |

## Related Documentation

| Document | Path |
| --- | --- |
| Producer | [../application/order-api.md](../application/order-api.md) |
| Consumer | [../application/fulfillment-worker.md](../application/fulfillment-worker.md) |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| ADR | [../decisions/adr-001-async-fulfillment.md](../decisions/adr-001-async-fulfillment.md) |
