# ADR-001 — Prefer Synchronous Request/Response for Acceptance

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/decisions/adr-001-sync-request-response.md)
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

Consumers need a simple way to submit notification requests and know whether the request was accepted.

## Problem

Should notification acceptance be exposed as a synchronous API or as an asynchronous command/event interface?

## Decision

Use a synchronous request/response contract for acceptance. Delivery lifecycle remains outside this service.

## Alternatives Considered

| Alternative | Pros | Cons | Why not chosen |
| --- | --- | --- | --- |
| Async command queue only | Decouples spikes | Harder immediate feedback | Consumers need immediate acceptance ID |
| Dual sync+async APIs | Flexibility | Higher complexity | Unnecessary for current scope |

## Consequences

| Positive | Negative | Neutral |
| --- | --- | --- |
| Simple consumer integration | Acceptance may be confused with delivery | Delivery tracked elsewhere |

## Risks

| Risk | Mitigation | Classification |
| --- | --- | --- |
| Consumers assume delivery success | Document semantics in contract | Confirmed (example) |

## Related Decisions

| ADR | Relationship |
| --- | --- |
| — | none yet |

## References

| Reference | Location |
| --- | --- |
| Architecture doc | [../architecture/overview.md](../architecture/overview.md) |
| Contract | [../contracts/send-notification.md](../contracts/send-notification.md) |
