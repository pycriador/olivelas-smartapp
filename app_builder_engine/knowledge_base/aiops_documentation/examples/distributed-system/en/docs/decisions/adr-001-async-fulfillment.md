---
title: "ADR-001 — Use Asynchronous Fulfillment After Order Acceptance"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
---

# ADR-001 — Use Asynchronous Fulfillment After Order Acceptance

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/decisions/adr-001-async-fulfillment.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Date: 2026-08-07
> Deciders: example-team
>
> **Fictional example — not a real project.**

## Status

Accepted

## Date

2026-08-07

## Context

Order acceptance must remain fast and reliable for clients. Fulfillment work is slower and depends on warehouse-side capacity that can fail independently.

## Problem

Should fulfillment run in the same synchronous request path as order acceptance, or after an asynchronous handoff?

## Decision

Accept orders synchronously in `order-api`, then fulfill asynchronously via `order.accepted` consumed by `fulfillment-worker`.

## Alternatives Considered

| Alternative | Pros | Cons | Why not chosen |
| --- | --- | --- | --- |
| Sync fulfillment in accept path | Stronger immediate consistency | Couples failure domains; higher latency | Blocks acceptance on warehouse path |
| Shared database between API and worker | Simple reads | Tight coupling; unclear ownership | Violates service boundary goals |

## Consequences

| Positive | Negative | Neutral |
| --- | --- | --- |
| Acceptance stays available if worker is down | Eventual consistency between accept and fulfill | Event contract becomes a first-class dependency |

## Risks

| Risk | Mitigation | Classification |
| --- | --- | --- |
| Duplicate events | Idempotent worker applies | Confirmed (example) |
| Publish after persist fails | Retry publish + alert | Confirmed (example) |

## Affected Components

| Component | Impact | Documentation |
| --- | --- | --- |
| order-api | Publishes events after accept | [../application/order-api.md](../application/order-api.md) |
| fulfillment-worker | Consumes and applies | [../application/fulfillment-worker.md](../application/fulfillment-worker.md) |

## Affected Contracts

| Contract | Impact | Documentation |
| --- | --- | --- |
| order.accepted | Introduced as handoff | [../contracts/order-accepted.md](../contracts/order-accepted.md) |

## References

| Reference | Location |
| --- | --- |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| Data flow | [../architecture/data-flow.md](../architecture/data-flow.md) |
