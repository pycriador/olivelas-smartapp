# Supply-Chain Security

> Language: EN | [Português (pt-BR)](../pt-BR/supply-chain-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **integrity and trust of how software and artifacts are obtained, built, and delivered**.

Supply-chain security is broader than “run npm audit.” It covers sources, build integrity, distribution, and privileged automation. Remain technology-agnostic. Do not invent attestations, signing schemes, or compliance programs the project does not use.

## Scope (Conceptual)

| Area | Question |
| --- | --- |
| **Sources** | Where do code and packages come from? Who can publish? |
| **Build** | How are artifacts produced? Who/what can alter the build? |
| **Artifacts** | How are images/binaries/packages identified and protected? |
| **Distribution** | How do artifacts reach runtime environments? |
| **Automation privilege** | What can CI/CD and bots do? — [privileged-access.md](privileged-access.md) |
| **Dependencies** | How third-party components enter the chain — [dependency-security.md](dependency-security.md) |

Out of scope for this doc: inventing regulatory supply-chain certifications.

## What to Document

| Field | Meaning |
| --- | --- |
| **Pipeline / path** | Named build or delivery path (no secret tokens) |
| **Trust controls** | Reviews, approvals, isolation, signing — as evidenced |
| **Integrity mechanism** | Checksums, signatures, provenance — or **Not Defined** |
| **Privileged identities** | Roles/systems that can release (by name, not keys) |
| **Exposure** | Who can inject or alter artifacts |
| **Owner** | Who maintains supply-chain controls |
| **Evidence** | Links — [security-evidence.md](security-evidence.md) |
| **Classification** | Confirmed / Inferred / Unknown / Proposed |

## Relationship to Other Docs

| Topic | Link |
| --- | --- |
| Trust boundaries at CI/CD vs runtime | [trust-boundaries.md](trust-boundaries.md), [security-architecture.md](security-architecture.md) |
| Secrets in pipelines | [secrets-management.md](secrets-management.md), [secret-exposure.md](secret-exposure.md) |
| Change and deploy | [change-management.md](change-management.md), [deployment-operations.md](deployment-operations.md) |
| Dependency vulns | [dependency-security.md](dependency-security.md), [vulnerability-management.md](vulnerability-management.md) |

Document shared mechanisms once under [operations-security.md](operations-security.md) when the same control serves ops and security.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Who can merge/release; where secrets for deploy live (by reference) |
| Medium | Build/release trust notes; dependency intake stance |
| Large | Explicit integrity/provenance stance; privileged automation inventory |

## Anti-Patterns

- Claiming “signed and attested” without evidence.
- Documenting registry passwords or deploy keys in Markdown.
- Treating every transitive package as a full supply-chain case study.

## Related Documents

- [dependency-security.md](dependency-security.md)
- [secure-development.md](secure-development.md)
- [privileged-access.md](privileged-access.md)
- [security-controls.md](security-controls.md)
- [attack-surface.md](attack-surface.md)
