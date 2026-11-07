---
title: "Security overview — SheetLedger (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Security overview

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/security/overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional example.** Formal threat model: Unknown.

## Purpose

Summary of authentication, authorization, trust boundaries, and controls observable **in the example**.

## Authn (Confirmed within example)

1. User JWT
2. User API token
3. Service-account login → JWT

## Authz (Confirmed within example)

Illustrative roles; scopes `global|group|own|none`; granular permission evaluation.

## Controls

| Control | Status | Classification |
| --- | --- | --- |
| Rate limiting | Implemented (illustrative) | Confirmed (within example) |
| Version rewrite | Implemented (illustrative) | Confirmed (within example) |
| Audit log | Implemented (illustrative) | Confirmed (within example) |
| Encrypted storage credentials | Implemented (illustrative) | Confirmed (within example) |
| Threat model | Unknown | Unknown |

## Secrets

Never in docs. Env/secret store only. Olivelas secrets practice may apply as org convention — not a requirement of this framework.

## Related

- [../contracts/api-tokens.md](../contracts/api-tokens.md)
- [../contracts/service-accounts.md](../contracts/service-accounts.md)
- [../knowledge-gaps.md](../knowledge-gaps.md)
