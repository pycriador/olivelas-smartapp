# Dependency Security

> Language: EN | [Português (pt-BR)](../pt-BR/dependency-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **security posture of dependencies** the system builds on or calls — libraries, services, images, plugins, and similar.

Companion to [dependency-reliability.md](dependency-reliability.md) (failure/impact) and [operational-dependencies.md](operational-dependencies.md) (dependency kinds). Do not invent SBOM tools or CVE SLAs the project does not use.

## What to Document

For material dependencies with security relevance:

| Field | Meaning |
| --- | --- |
| **Dependency** | Stable name; link architecture / contract |
| **Kind** | Library / service / image / plugin / other |
| **Trust posture** | Why we trust it (vendor, internal, signed, Unknown) |
| **Data / privilege shared** | What sensitive data or permissions it receives |
| **Known vulnerability process** | How findings are triaged — [vulnerability-management.md](vulnerability-management.md) |
| **Update / patch stance** | How updates are applied, or **Not Defined** |
| **Owner** | Who tracks security for this dependency |
| **Classification** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory Shape

| Dependency | Kind | Trust posture | Data / privilege | Vuln process | Update stance | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

Mark Unknown fields explicitly. Skip trivial transitive noise unless it is material.

## Relationship to Reliability and Supply Chain

| Concern | Document in |
| --- | --- |
| Dependency fails / times out | [dependency-reliability.md](dependency-reliability.md) |
| Dependency is malicious, tampered, or weakly attested | [supply-chain-security.md](supply-chain-security.md) |
| Known weakness in a component | [vulnerability-management.md](vulnerability-management.md) |
| Architecture coupling | [component-relationships.md](component-relationships.md), dependency maps |

## Rules

- Prefer links to lockfiles, image digests, or inventory systems by **reference** — do not paste secret registry credentials.
- Do not auto-declare “no vulnerable dependencies” without evidence.
- Critical dependencies with broad privilege and no owner are [security debt](security-debt.md) candidates.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Identity / data-store / payment-like deps called out |
| Medium | Inventory for runtime deps that process sensitive data or hold privilege |
| Large | Broader inventory + update/vuln stance + supply-chain links |

## Related Documents

- [supply-chain-security.md](supply-chain-security.md)
- [dependency-reliability.md](dependency-reliability.md)
- [security-architecture.md](security-architecture.md)
- [vulnerability-management.md](vulnerability-management.md)
- [security-risk-model.md](security-risk-model.md)
