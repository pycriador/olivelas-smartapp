# Least Privilege

> Language: EN | [Português (pt-BR)](../pt-BR/least-privilege.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document the principle that **identities receive only the access required for their function** — and no more.

Least privilege applies to humans, services, pipelines, and operators. It is a requirement posture; enforcement mechanisms belong under [authorization.md](authorization.md) and [security-controls.md](security-controls.md).

## Purpose

Answer:

> For each material identity, what is the minimum access it needs, and how do we prevent silent privilege growth?

## What to Document

| Topic | Guidance |
| --- | --- |
| **Baseline grants** | Default permissions for each identity type |
| **Justifications** | Why a broad grant exists (if it must) |
| **Separation** | Distinct identities for distinct duties when required |
| **Time bounds** | Temporary elevation vs standing privilege — see [privileged-access.md](privileged-access.md) |
| **Review** | Who reviews grants and how often — or **Not Defined** |
| **Dependencies** | Privileges required on upstream systems — link owners |

## Suggested Inventory

| Identity / role | Necessary access | Explicitly excluded | Standing / temporary | Review | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | Not Defined if unknown | |

## Relationship to Other Controls

| Concern | Link |
| --- | --- |
| Decision rules | [authorization.md](authorization.md) |
| Elevated paths | [privileged-access.md](privileged-access.md) |
| Secret reachability | [secrets-management.md](secrets-management.md) — who can *read* a secret reference |
| Blast radius | [failure-domains.md](failure-domains.md), [criticality.md](criticality.md) |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | State that service and human roles are separated if true; note any shared admin |
| Medium | Inventory of broad grants with owners |
| Large | Review cadence, temporary elevation pattern, dependency privileges |

## Anti-Patterns

- Shared “superuser” identity for all automation “for convenience.”
- Copying production admin rights into non-production without noting risk.
- Documenting least privilege while deny-by-default is false and unstated.
- Grant reviews claimed but never performed (mark Not Defined instead).

## Related Documents

- [authorization.md](authorization.md)
- [privileged-access.md](privileged-access.md)
- [identity.md](identity.md)
- [security-requirements.md](security-requirements.md)
- [security-ownership.md](security-ownership.md)
