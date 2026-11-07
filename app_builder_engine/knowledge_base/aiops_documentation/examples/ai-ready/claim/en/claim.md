---
title: "Claim: notify-bridge max delivery retries (Fictional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "CLAIM-NB-001"
type: "Evidence"
---

# Claim

> Language: EN | [Português (pt-BR)](../pt-BR/claim.md)
>
> **Fictional example — not a real project.**

Record a single technical assertion with evidence and classification.

Policy: [claims.md](../../../docs/en/claims.md), [evidence-model.md](../../../docs/en/evidence-model.md).

## ID

| Field | Value |
| --- | --- |
| Claim ID | CLAIM-NB-001 |
| Document / scope | ARCH-NB-001 / CMP-NB-001 |
| Owner | example-platform-team |

## Statement

notify-bridge retries a failed outbound notification delivery at most **3** times with exponential backoff before routing to the dead-letter path.

## Classification

| Field | Value |
| --- | --- |
| Classification | Confirmed |
| Confidence | High |
| Authority of sources | Authoritative |

## Evidence

| Source | Kind | Path / ID | Notes |
| --- | --- | --- | --- |
| Retry config constant | code | `src/notify-bridge/delivery/retry.go` (fictional path) | `MaxAttempts = 3` |
| Worker defaults | config | Config name: `NOTIFY_BRIDGE_MAX_ATTEMPTS` (source: env — value not a secret) | Documented default `3` |
| Unit test | test | `src/notify-bridge/delivery/retry_test.go` (fictional) | Asserts stop after 3 failures |

## Scope

| Field | Value |
| --- | --- |
| System / component | notify-bridge / CMP-NB-001 |
| Applies when | Outbound channel delivery returns retryable failure |
| Does not apply when | Permanent rejection (e.g. invalid recipient) — no retry |
| Time scope | Current |

## Related

| Relation | Target ID / path |
| --- | --- |
| supports | ARCH-NB-001 |
| contradicts | CONTRA-NB-001 (open conflict with older ops note) |
| related_to | GAP-NB-001 |

## Notes

CONTRA-NB-001 records an older ops page that still says “5 retries”. Do not silently pick a winner in answers until resolved.
