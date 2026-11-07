# Document Types

> Language: EN | [Português (pt-BR)](../pt-BR/document-types.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Controlled vocabulary for the `type` metadata field and for classifying knowledge nodes in the documentation graph.

## Allowed Types

| Type | Purpose | Typical ID prefix |
| --- | --- | --- |
| **Context** | Problem, scope, actors, AI entry, progressive overview | `CTX-` |
| **Architecture** | Structure, boundaries, components, diagrams, constraints | `ARCH-` |
| **Contract** | API / event / message / file and related boundary specs | `CONTRACT-` |
| **Operation** | How the system is run, observed, scaled, changed | `OPS-` |
| **Security** | Assets, threats, controls, identity, data protection | `SEC-` |
| **Decision** | ADRs and significant choices | `ADR-` / `DEC-` |
| **Requirement** | Functional or non-functional requirements | `REQ-` |
| **Runbook** | Executable operational procedure | `rb-` |
| **Incident** | Incident record / timeline / PIR linkage | `INC-` |
| **Evidence** | Evidence packs, verification records | `EVD-` |
| **Reference** | Glossaries, indexes, standards pointers, cheat-sheets | `REF-` |

## Type Selection Rules

1. Choose the **primary** purpose of the document. A security runbook is `Runbook` with security tags/links — or `Security` if it is policy, not a procedure.
2. Do not invent parallel type names (`ArchDoc`, `ops-guide`).
3. Templates and README hubs may omit `type` when they are navigational only; prefer `Reference` when inventoried.
4. AI-ready standard pages in this repository use `Reference` (meta-standard) unless they are Context (`ai-context.md`).

## Mapping to Existing Categories

| Category | Primary types |
| --- | --- |
| Governance / lifecycle | Reference, Decision |
| Architecture methodology | Architecture, Context |
| Contracts methodology | Contract |
| Operations & reliability | Operation, Runbook, Incident |
| Security methodology | Security, Evidence, Requirement |
| AI-ready | Context, Reference, Evidence |

## Anti-Patterns

- One file claiming every type
- Using `Reference` to hide missing Architecture or Contract docs
- Treating chat transcripts as `Evidence` without an evidence record

## Related Documents

- [document-identity.md](document-identity.md)
- [document-metadata.md](document-metadata.md)
- [documentation-graph.md](documentation-graph.md)
