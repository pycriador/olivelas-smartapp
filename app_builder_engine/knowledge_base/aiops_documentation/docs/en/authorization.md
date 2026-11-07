# Authorization

> Language: EN | [Português (pt-BR)](../pt-BR/authorization.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **authorization** — what an authenticated (or anonymous) identity is allowed to do.

## Core Distinction

| Question | Document |
| --- | --- |
| **Who are you?** | [authentication.md](authentication.md), [identity.md](identity.md) |
| **What are you allowed to do?** | This document |

Authentication success is not authorization. Anonymous identities, if allowed, still need an explicit authorization story (including “deny all non-public actions”).

## What to Document

| Topic | Guidance |
| --- | --- |
| **Subjects** | Identity types, roles, groups, attributes — project vocabulary |
| **Actions** | Operations that matter (read, write, admin, approve, deploy, …) |
| **Resources** | Objects or scopes protected (tenant data, admin APIs, jobs, …) |
| **Decision point** | Where enforcement happens (edge, service, data layer) |
| **Default posture** | Deny-by-default vs allow-by-default — state honestly |
| **Delegation / impersonation** | If present; else Not Applicable |
| **Failure behavior** | Denied vs not-found policies when defined; link contracts for errors |

## Model Styles (Examples, Not Requirements)

Projects may use any model that matches reality:

| Style (example) | Notes |
| --- | --- |
| Role-based | Roles → permissions |
| Attribute-based | Decisions from attributes/context |
| Resource policies | Per-resource rules |
| Capability / ACL lists | Explicit grants |
| Coarse environment gates | Network or stage gates as *partial* control — declare residual risk |

Do not force a style name if the project only has a simple allowlist.

## Suggested Authorization Record

| Field | Meaning |
| --- | --- |
| **Action / resource** | What is protected |
| **Who is allowed** | Subject rule |
| **Enforcement point** | Component / boundary |
| **Related authn** | Required identity strength if any |
| **Contract link** | Canonical interface doc |
| **Certainty** | Confirmed / Inferred / Unknown / Not Applicable |

## Suggested Inventory

| Action / resource | Who is allowed | Enforcement point | Authn prerequisite | Contract | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Least Privilege and Privilege

- Default grants should follow [least-privilege.md](least-privilege.md).
- Elevated paths belong in [privileged-access.md](privileged-access.md).
- Cross-tenant rules must be explicit when multi-tenancy exists — link [trust-boundaries.md](trust-boundaries.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Who can call the main write APIs and who can admin |
| Medium | Matrix for Critical resources + tenant isolation note if applicable |
| Large | Enforcement points per boundary; impersonation and break-glass |

## Anti-Patterns

- “Authorized if authenticated.”
- Documenting only UI visibility, not server-side enforcement.
- Conflicting rules between contract and security doc.
- Hiding deny rules that are load-bearing for isolation.

## Related Documents

- [identity.md](identity.md)
- [authentication.md](authentication.md)
- [least-privilege.md](least-privilege.md)
- [privileged-access.md](privileged-access.md)
- [security-controls.md](security-controls.md)
- [contract-model.md](contract-model.md)
