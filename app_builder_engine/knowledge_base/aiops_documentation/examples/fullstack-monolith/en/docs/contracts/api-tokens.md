---
title: "Contract — api-tokens (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "API"
---

# api-tokens

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/contracts/api-tokens.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional example.** Not a production contract. Illustrative stack ≠ standard.

## Purpose
User API tokens with least privilege (intersection with effective RBAC).

## Principles
| Principle | Notes |
| --- | --- |
| Least privilege | permissions ⊆ user |
| Secret once | plaintext only on create/rotate |
| Audit | illustrative usage event |

## Illustrative authentication
Bearer or dedicated header; illustrative `df_live_*` prefix.

## Project scope
Same visibility as owning user (shares/groups) — illustrative.

## Related

- [rest-api.md](rest-api.md)
- [../security/overview.md](../security/overview.md)
- [service-accounts.md](service-accounts.md)

