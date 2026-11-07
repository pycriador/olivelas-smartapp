---
title: "Runbook — Bootstrap admin (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Runbook: bootstrap admin

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/operations/rb-auth-bootstrap.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / Fictional example.**

## When to use
Fresh environment with no Admin user; login impossible.

## Illustrative behavior
Bootstrap creates the first Admin when dedicated environment variables exist and no admin is present.

## Procedure
1. Set env in the secret store (never committed)
2. Start/restart the API
3. Validate UI login
4. Rotate/remove bootstrap password
5. Create additional users via the project operational procedure

## Security
Do not log the password. Do not document values.

## Related

- [service-profile.md](service-profile.md)
- [../security/overview.md](../security/overview.md)

