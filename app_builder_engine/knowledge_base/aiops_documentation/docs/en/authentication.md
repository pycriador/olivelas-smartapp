# Authentication

> Language: EN | [Português (pt-BR)](../pt-BR/authentication.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **authentication** — establishing who or what an identity is — without assuming a particular protocol or token format.

This document answers **Who are you?** It does **not** answer **What are you allowed to do?** — see [authorization.md](authorization.md) and [identity.md](identity.md).

## Purpose

For each material entry point, record how identity is verified, under which trust assumptions, and what happens on failure.

## Mechanism Classes (Examples, Not Requirements)

Document the class the project actually uses. Do **not** assume OAuth, OIDC, JWT, mTLS, API keys, or passwords are present.

| Class (example) | What to capture |
| --- | --- |
| Shared secret / key presentation | Key *name/reference*, rotation owner — never the value |
| Password / credential challenge | Policy summary if defined; storage is a secret concern |
| Proof-of-possession / mutual auth | What is proven (certificate identity, etc.) at a conceptual level |
| Federated / delegated assertion | Who issues the assertion; what is trusted from it |
| Platform / infrastructure identity | Cloud or runtime identity mechanism by project name |
| Step-up / multi-factor | When additional proof is required |
| None (anonymous) | Explicitly document if anonymous access is allowed |

If the project uses a named standard, link to the contract or ADR; do not paste secrets or full private configs.

## Suggested Entry-Point Record

| Field | Meaning |
| --- | --- |
| **Entry point** | Interface / surface id — link [attack-surface.md](attack-surface.md) |
| **Identity type** | Human, service, operator, … |
| **Mechanism** | Class + project-specific name |
| **Issuer / source** | Who vouches for the identity (if any) |
| **Failure behavior** | Reject, degrade, challenge — link contracts for wire errors when applicable |
| **Session / replay notes** | Only if defined; else Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Not Applicable |

## Suggested Inventory

| Entry point | Identity type | Mechanism | Issuer / source | Failure behavior | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Contract Integration

Authentication expectations that peers must meet belong in the canonical [contract](contract-model.md) (or a clear link from it). Security docs summarize and point; they should not fork conflicting rules.

## Trust Boundary Notes

State when authentication at the edge is reused inside another zone, and whether inner components re-authenticate. See [trust-boundaries.md](trust-boundaries.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Mechanism for the primary Exposed entry; note anonymous if allowed |
| Medium | All Exposed + Restricted admin entries |
| Large | Service-to-service and pipeline authentication included |

## Anti-Patterns

- Writing “JWT/OAuth” as the entire authentication story with no entry-point map.
- Documenting authorization rules under an Authentication heading.
- Embedding token samples that contain real secrets or PII.
- Claiming multi-factor or federation that is not implemented.

## Related Documents

- [identity.md](identity.md)
- [authorization.md](authorization.md)
- [secrets-management.md](secrets-management.md)
- [attack-surface.md](attack-surface.md)
- [contract-model.md](contract-model.md)
- [security-requirements.md](security-requirements.md)
