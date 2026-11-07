# Threat Modeling

> Language: EN | [Português (pt-BR)](../pt-BR/threat-modeling.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **threats against assets** in a technology-agnostic way.

Threat modeling is a structured way to answer: what can go wrong, how bad is it, and what do we do about it? Frameworks such as STRIDE, LINDDUN, or attack trees are **optional aids**, not requirements of this standard.

## Purpose

Produce a maintainable model that connects:

```text
System → Assets → Trust Boundaries → Threats → Risk → Mitigations
```

Outputs feed [security-requirements.md](security-requirements.md), [security-controls.md](security-controls.md), and [security-risk-model.md](security-risk-model.md).

## Recommended Flow

| Step | Question | Inputs |
| --- | --- | --- |
| **1. System** | What is in scope? | [security-scope.md](security-scope.md), [system-boundaries.md](system-boundaries.md), architecture overview |
| **2. Assets** | What must we protect? | [security-assets.md](security-assets.md) |
| **3. Trust boundaries** | Where does trust change? | [trust-boundaries.md](trust-boundaries.md), [attack-surface.md](attack-surface.md) |
| **4. Threats** | What adverse actions matter? | [threat-actors.md](threat-actors.md), optional STRIDE-style prompts |
| **5. Risk** | How severe, how likely, residual? | [security-risk-model.md](security-risk-model.md) |
| **6. Mitigations** | Requirements and controls | [security-requirements.md](security-requirements.md), [security-controls.md](security-controls.md) |

Revisit when architecture, contracts, or exposure change materially — or on the review cadence the project defines. Mark cadence **Not Defined** when none exists.

## Optional Prompt Techniques

Use only if helpful; do not force a full matrix for a tiny internal tool.

| Technique | Use |
| --- | --- |
| **STRIDE-style prompts** | Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege — as questions, not mandatory categories |
| **Data-flow review** | Follow sensitive assets across [trust-boundaries.md](trust-boundaries.md) |
| **Abuse cases** | Invert primary use cases for critical flows |
| **Dependency focus** | Threats via Critical dependencies — [operational-dependencies.md](operational-dependencies.md) |

## Suggested Threat Record

| Field | Meaning |
| --- | --- |
| **ID** | Stable short id |
| **Threat** | Concise description of the adverse scenario |
| **Actor** | Category or specific actor if known — [threat-actors.md](threat-actors.md) |
| **Asset** | Asset id/name |
| **Boundary / surface** | Where it applies |
| **Vulnerability** | Weakness if known; else Unknown |
| **Risk summary** | Likelihood/impact/severity/residual per project model |
| **Mitigations** | Requirements/controls (links) |
| **Status** | open / accepted / mitigated / Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| ID | Threat | Actor | Asset | Boundary | Risk | Mitigations | Status | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

## Architecture Integration

- Start from existing context/system diagrams; do not redraw the whole architecture for every threat.
- Show trust zones when they clarify crossings; keep diagrams readable — [architecture-diagrams.md](architecture-diagrams.md).
- Link failure domains when a threat is primarily availability/resilience — [failure-domains.md](failure-domains.md).
- Deep control catalogs belong in security docs, not architecture overviews — [trust-boundaries.md](trust-boundaries.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Narrative threats for the main edge and main data store |
| Medium | Inventory for critical paths + residual risks |
| Large | Structured records, review history, linkage to exceptions and incidents |

## Anti-Patterns

- Producing a framework checklist with no project-specific threats.
- Listing mitigations that do not exist as if they were Confirmed.
- Ignoring privileged and CI/CD paths.
- Inventing compliance-driven threats without evidence.

## Related Documents

- [security-model.md](security-model.md)
- [threat-actors.md](threat-actors.md)
- [attack-surface.md](attack-surface.md)
- [trust-boundaries.md](trust-boundaries.md)
- [security-risk-model.md](security-risk-model.md)
- [security-architecture.md](security-architecture.md)
