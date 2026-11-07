# Security Scope

> Language: EN | [Português (pt-BR)](../pt-BR/security-scope.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects declare **what security documentation and analysis cover** — and what they deliberately exclude.

Scope prevents false confidence. A threat model that silently omits admin planes, batch jobs, or third-party processors is incomplete, not “simpler.”

## Purpose

Answer:

> For this project (or subsystem), what is in security scope, what is out, and why?

Security scope should align with [system-boundaries.md](system-boundaries.md) and [security-model.md](security-model.md). When they diverge, say so explicitly.

## Suggested Structure

| Section | Content |
| --- | --- |
| **In scope** | Systems, data classes, interfaces, environments, identities, and processes covered |
| **Out of scope** | Explicit exclusions with rationale |
| **Shared / adjacent** | Dependencies owned elsewhere; what this project still must document at the boundary |
| **Environments** | Which of prod / non-prod / local / CI are covered |
| **Assumptions** | Trust assumptions that limit the analysis (mark certainty) |

## In Scope (Guidance)

Typical in-scope items when they exist for the project:

- Runtime services and jobs the team owns
- Data the system stores or processes (by classification — see [security-classification.md](security-classification.md))
- External-facing and internal interfaces with authn/authz expectations
- Secrets and keys **by name/reference**, never by value
- Privileged and operator access paths
- Build/deploy paths that can change production behavior (when material)

Document only what is real. Mark **Not Applicable** when a category does not exist.

## Out of Scope (Guidance)

Valid out-of-scope examples (adapt; do not invent):

- Platforms or products owned by another team, beyond the integration boundary
- Physical facility security (unless the project truly owns it)
- Legal/compliance program ownership outside engineering docs
- Speculative future systems marked Proposed elsewhere

Out of scope is **not** an excuse to hide Critical dependencies. For shared systems, document the **boundary contract** and residual risk — see [operational-dependencies.md](operational-dependencies.md) and [contract-model.md](contract-model.md).

## Suggested Inventory

| Item | In / Out / Shared | Rationale | Owner | Classification |
| --- | --- | --- | --- | --- |
| | | | | Confirmed / Inferred / Unknown |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Short in/out list tied to the system boundary |
| Medium | Environments + shared dependencies called out |
| Large | Inventory table; explicit admin/CI/data-plane scopes |

## Anti-Patterns

- Claiming “everything” is in scope with no inventory.
- Leaving Critical third parties out of scope without a boundary note.
- Treating out of scope as “we do not care about the risk.”
- Inventing regulatory scope the project has not defined.

## Related Documents

- [security-model.md](security-model.md)
- [system-boundaries.md](system-boundaries.md)
- [security-ownership.md](security-ownership.md)
- [security-assets.md](security-assets.md)
- [attack-surface.md](attack-surface.md)
- [architecture-model.md](architecture-model.md)
