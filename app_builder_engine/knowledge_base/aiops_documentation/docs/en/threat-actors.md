# Threat Actors

> Language: EN | [Português (pt-BR)](../pt-BR/threat-actors.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects describe **who or what might act against assets**.

Actor categories below are **examples**, not a mandatory roster. Document only actors that are plausible for the project’s [security-scope.md](security-scope.md). Prefer coarse categories over speculative named adversaries.

## Purpose

Answer:

> Whose capabilities and motivations should we assume when modeling threats?

Actors inform [threat-modeling.md](threat-modeling.md) and [security-risk-model.md](security-risk-model.md). They are not accusations about real people.

## Example Categories (Non-Exhaustive)

| Category | Example intent / capability | Typical relevance |
| --- | --- | --- |
| **Anonymous external** | Unauthenticated probing of exposed surfaces | Public edges |
| **Authenticated user (malicious or compromised)** | Abuse of legitimate credentials or sessions | Multi-tenant / user-facing systems |
| **Insider (privileged)** | Misuse of elevated access | Admin planes, data stores |
| **Insider (non-privileged)** | Limited internal access misuse | Internal tools |
| **Service / automation identity** | Compromised workload or pipeline identity | Service-to-service, CI/CD |
| **Dependency / supplier path** | Abuse via third-party or library trust | Supply chain, SaaS integrations |
| **Physical / local access** | Access to devices or media | Only when in scope |

Add, rename, or drop categories to match the project. Mark **Not Applicable** when a category is irrelevant.

## Suggested Actor Record

| Field | Meaning |
| --- | --- |
| **Category** | Stable label used in threat records |
| **Assumptions** | Access, knowledge, and constraints assumed |
| **In scope?** | yes / no / Shared |
| **Notes** | Links to surfaces or trust zones |
| **Certainty** | Confirmed need / Inferred / Unknown / Proposed |

## Suggested Inventory

| Category | Assumptions | In scope? | Related surfaces | Certainty |
| --- | --- | --- | --- | --- |
| | | | | |

## Guidance

- Tie actors to [attack-surface.md](attack-surface.md) and [trust-boundaries.md](trust-boundaries.md).
- Do not inflate capability (e.g. nation-state) without a reason grounded in scope and criticality.
- Compromised benign users and malicious users may share a category if controls are the same; split when mitigations differ.
- Document automation identities explicitly when they can change production or read Confidential data.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | External vs authenticated vs privileged (if privileged exists) |
| Medium | Include service identities and Critical dependency paths |
| Large | Inventory with assumptions and scope flags |

## Related Documents

- [threat-modeling.md](threat-modeling.md)
- [attack-surface.md](attack-surface.md)
- [security-scope.md](security-scope.md)
- [privileged-access.md](privileged-access.md)
- [security-model.md](security-model.md)
