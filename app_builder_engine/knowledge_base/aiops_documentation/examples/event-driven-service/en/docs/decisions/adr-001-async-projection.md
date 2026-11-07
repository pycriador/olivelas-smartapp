# ADR-001 — Use Asynchronous Projection for Inventory Reads

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/decisions/adr-001-async-projection.md)
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

Read-side consumers need inventory views, but coupling every read to the write model creates load and availability coupling.

## Problem

Should inventory read models be updated synchronously in the write path or projected asynchronously from domain events?

## Decision

Publish `inventory.adjusted` events and maintain inventory read state through an asynchronous projector.

## Alternatives Considered

| Alternative | Pros | Cons | Why not chosen |
| --- | --- | --- | --- |
| Synchronous update in write path | Stronger immediacy | Couples write availability to read store | Rejected for isolation goals |
| Request-time join across systems | No projector | Higher read latency/complexity | Rejected for current needs |

## Consequences

| Positive | Negative | Neutral |
| --- | --- | --- |
| Write path isolation | Eventual consistency | Requires idempotent consumers |

## Risks

| Risk | Mitigation | Classification |
| --- | --- | --- |
| Readers observe stale data | Document freshness expectations; monitor lag | Confirmed (example) |
| Duplicate events | Idempotent apply by event_id/version | Confirmed (example) |

## Related Decisions

| ADR | Relationship |
| --- | --- |
| — | none yet |

## References

| Reference | Location |
| --- | --- |
| Architecture doc | [../architecture/overview.md](../architecture/overview.md) |
| Contract | [../contracts/inventory-adjusted.md](../contracts/inventory-adjusted.md) |
| Integration | [../application/integration-inventory-adjusted.md](../application/integration-inventory-adjusted.md) |
