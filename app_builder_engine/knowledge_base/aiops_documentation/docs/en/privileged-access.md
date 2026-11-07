# Privileged Access

> Language: EN | [Português (pt-BR)](../pt-BR/privileged-access.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **elevated access** that can bypass normal limits, change security controls, or reach highly sensitive assets.

Privileged access is a specialization of [authorization.md](authorization.md) and [least-privilege.md](least-privilege.md). Treat admin planes, break-glass, data-store superusers, and deploy identities that can alter production as privileged when they exist.

## Purpose

Answer:

> Who can use privileged paths, how is elevation granted, how is it monitored, and how is it revoked?

## Privileged Path Examples (Non-Exhaustive)

- Administrative APIs or consoles
- Direct data-store administration
- Secret vault administration (by role name — never values)
- Production deploy or infrastructure mutation identities
- Break-glass / emergency access
- Impersonation of other tenants or users

Document only paths that exist. Mark others **Not Applicable**.

## Suggested Record

| Field | Meaning |
| --- | --- |
| **Path** | Name of privileged capability |
| **Who** | Roles / identities allowed |
| **How granted** | Standing vs request/approve vs break-glass |
| **Authn strength** | Extra proof if any — else Not Defined |
| **Logging / audit** | What is recorded — [auditability.md](auditability.md) |
| **Monitoring** | Alerts or reviews — link [monitoring.md](monitoring.md) |
| **Revocation** | How access ends |
| **Owner** | Security or system owner |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| Path | Who | Grant model | Audit | Monitoring | Revocation | Owner | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Operations Integration

Privileged misuse or failure often becomes an [incident](incident-management.md). Align severity expectations with [incident-severity.md](incident-severity.md) when the project defines them. Do not invent a separate security on-call if none exists — state **Not Defined** and point to operational ownership.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Name who can admin production and how break-glass works (or that it does not) |
| Medium | Inventory of privileged paths with audit notes |
| Large | Grant model, monitoring, revocation, and review cadence |

## Anti-Patterns

- Undocumented shared root credentials.
- Break-glass without logging or owner.
- Privileged CI identities with standing write to production and no review.
- Pasting private keys or connection strings into this document.

## Related Documents

- [least-privilege.md](least-privilege.md)
- [authorization.md](authorization.md)
- [identity.md](identity.md)
- [auditability.md](auditability.md)
- [secrets-management.md](secrets-management.md)
- [operational-ownership.md](operational-ownership.md)
