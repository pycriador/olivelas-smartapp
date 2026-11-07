# Security Architecture

> Language: EN | [Português (pt-BR)](../pt-BR/security-architecture.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document the **security view of the architecture** — what must be protected, where trust changes, and which control classes apply — without duplicating architecture diagrams or component catalogs.

Architecture docs own structure and diagrams ([architecture-model.md](architecture-model.md), [architecture-diagrams.md](architecture-diagrams.md)). Security architecture **references** them and adds the security lens.

## Lenses (Document What Applies)

| Lens | Question | Prefer linking |
| --- | --- | --- |
| **Trust Boundaries** | Where trust changes and what governs crossing | [trust-boundaries.md](trust-boundaries.md) |
| **Identity** | How principals are established | [identity.md](identity.md), [authentication.md](authentication.md) |
| **Access** | What principals may do | [authorization.md](authorization.md), [least-privilege.md](least-privilege.md), [privileged-access.md](privileged-access.md) |
| **Data Flow** | Where sensitive data moves and how it is protected | Architecture data-flow docs, [data-security.md](data-security.md), [encryption.md](encryption.md) |
| **Controls** | Which preventive/detective/corrective/compensating measures sit where | [security-controls.md](security-controls.md) |
| **Exposure** | What is exposed, internal, restricted, or unknown | [attack-surface.md](attack-surface.md) |
| **Dependencies** | Trusted/untrusted external and internal deps | [dependency-security.md](dependency-security.md), [supply-chain-security.md](supply-chain-security.md) |

## How to Write Security Architecture Docs

1. Link the canonical architecture overview / context / component docs.
2. List material trust boundaries with control class summaries (not full auth matrices).
3. Summarize identity and access patterns; link detailed matrices to security or contract docs.
4. Point to data-flow diagrams for sensitive paths; add classification and protection notes.
5. Inventory control placement at edges and privileged planes.
6. Summarize exposure and high-risk dependencies.
7. Mark Unknown / Not Defined honestly.

**Do not** redraw the same Mermaid diagrams “for security” unless the security-specific view adds information (for example, annotating trust zones). Prefer references.

## Architecture Boundary vs Trust Boundary vs Controls

| Concept | Owns | Doc home |
| --- | --- | --- |
| Architecture / system boundary | What is inside the system under documentation | [system-boundaries.md](system-boundaries.md) |
| Trust boundary | Where trust level changes | [trust-boundaries.md](trust-boundaries.md) |
| Security control | Mechanism enforcing requirements / reducing risk | [security-controls.md](security-controls.md) |

See also the distinction in [trust-boundaries.md](trust-boundaries.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Edge trust boundary + authn/authz summary + secrets rule |
| Medium | Trust map linked to architecture; sensitive data flows; privilege planes |
| Large | Full lenses above with control inventory and dependency trust notes |

## Anti-Patterns

- Duplicating component lists and sequence diagrams wholesale.
- Inventing enterprise zoning models for a single internal library.
- Claiming controls that exist only as Proposed design.
- Embedding secrets, private keys, or full network ACLs with credentials.

## Related Documents

- [security-model.md](security-model.md)
- [threat-modeling.md](threat-modeling.md)
- [architecture-model.md](architecture-model.md)
- [failure-domains.md](failure-domains.md)
- [contract-security.md](contract-security.md)
- [templates/security.md](templates/security.md)
