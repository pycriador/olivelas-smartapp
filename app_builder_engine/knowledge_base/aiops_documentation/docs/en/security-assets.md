# Security Assets

> Language: EN | [Português (pt-BR)](../pt-BR/security-assets.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Guidance for building and maintaining an **asset catalog** for security analysis.

An asset is something of value the system creates, stores, processes, or depends on. Asset catalogs feed [threat-modeling.md](threat-modeling.md) and [security-risk-model.md](security-risk-model.md). Keep entries coarse enough to stay maintainable.

## Purpose

Answer:

> What are we protecting, where does it live, who owns it, and how sensitive is it?

## Asset Categories (Non-Exhaustive Examples)

| Category | Examples (illustrative) |
| --- | --- |
| **Data** | Customer records, transaction history, configuration, analytics aggregates |
| **Identity** | User accounts, service identities, API clients, operator identities |
| **Credentials** | Secret *names/references*, certificates by identifier — never values |
| **Services / components** | Deployable units, critical jobs, admin planes |
| **Integrity-critical processes** | Approval workflows, financial posting, deploy pipelines |
| **Availability-critical capacity** | Primary serving path, failover dependency |

Use project vocabulary. Do not invent assets that do not exist.

## Suggested Catalog Fields

| Field | Meaning |
| --- | --- |
| **ID** | Stable short identifier |
| **Name** | Human-readable name |
| **Category** | Data, identity, credential reference, service, process, … |
| **Classification** | Per [security-classification.md](security-classification.md) |
| **Owner** | Data or system owner — [security-ownership.md](security-ownership.md) |
| **Location / store** | Where it resides (named system or path class, not secrets) |
| **Interfaces** | Contracts or components that touch it |
| **Criticality** | Link [criticality.md](criticality.md) when useful |
| **Notes** | Retention pointer, trust boundary, Unknown items |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| ID | Name | Category | Classification | Owner | Location | Interfaces | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Architecture and Contract Links

| Concern | Prefer |
| --- | --- |
| Where the asset sits structurally | Link [architecture-model.md](architecture-model.md) / component docs |
| How it crosses boundaries | Link [trust-boundaries.md](trust-boundaries.md), [data-security.md](data-security.md) |
| Field-level sensitivity on an interface | Link the canonical [contract](contract-model.md) |
| Operational impact if lost | Link [criticality.md](criticality.md), [failure-modes.md](failure-modes.md) |

Prefer links over duplicating schemas or diagrams.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | List the few assets that matter for the edge and for data at rest |
| Medium | Catalog with classification and owners |
| Large | IDs, interface links, periodic review of drift vs architecture |

## Anti-Patterns

- Cataloging every database column as a separate asset.
- Recording secret values or key material “for completeness.”
- Assets with no owner and no classification.
- Inventing assets for Proposed systems as if they were current.

## Related Documents

- [security-model.md](security-model.md)
- [security-classification.md](security-classification.md)
- [security-ownership.md](security-ownership.md)
- [threat-modeling.md](threat-modeling.md)
- [data-security.md](data-security.md)
- [architecture-model.md](architecture-model.md)
