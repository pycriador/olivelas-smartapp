---
title: "Contract — service-accounts (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "API"
---

# service-accounts

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/contracts/service-accounts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional example.** Not a production contract. Illustrative stack ≠ standard.

## Purpose
M2M identities with explicit project/group scope.

## Illustrative authentication
`POST.../auth/service-account` with client_id/secret → JWT.

## Security
Secret once; illustrative ACTIVE/DISABLED/REVOKED status; no implicit shares.

## Permissions
RBAC matrix subset; admin-only keys not assignable to SA (illustrative).

## Related

- [rest-api.md](rest-api.md)
- [api-tokens.md](api-tokens.md)
- [../security/overview.md](../security/overview.md)

