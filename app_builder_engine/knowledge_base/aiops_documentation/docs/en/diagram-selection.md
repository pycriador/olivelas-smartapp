# Diagram Selection Guide

> Language: EN | [Português (pt-BR)](../pt-BR/diagram-selection.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Choose diagrams by the question you need to answer — not by a quota of diagram types.

## Selection Matrix

| Question | Recommended diagram |
| --- | --- |
| Where does the system fit? | Context |
| What are its main units? | Container / Deployable Unit |
| How do components relate? | Component |
| How does an operation happen? | Sequence |
| How does data move through the system? | Data Flow |
| How does a process change state? | State |
| How is infrastructure organized? | Infrastructure |

Definitions and standards: [architecture-diagrams.md](architecture-diagrams.md). Mermaid conventions: [mermaid-standards.md](mermaid-standards.md).

## Decision Rules

1. **Start from a question.** If you cannot state the question in one sentence, you probably do not need a new diagram yet.
2. **One purpose per diagram.** Do not merge context, sequence, and infrastructure into one figure.
3. **Prefer fewer accurate diagrams.** A stale mega-diagram is worse than a short table.
4. **Reuse levels.** Context stays coarse; put internal structure in container/component views.
5. **Skip what does not apply.** A library may need component + public API diagrams and never need infrastructure. A CLI may need sequence of command execution and never need a state diagram.

## Combining with Prose and Tables

| Need | Prefer |
| --- | --- |
| Inventory of dependencies | Table ([component-relationships.md](component-relationships.md)) |
| Topology / collaboration | Diagram |
| Exact ordering of an operation | Sequence diagram or numbered steps |
| Contract fields | Contract document, not a diagram |

## Progressive Disclosure by Project Size

| Project | Typical diagrams |
| --- | --- |
| Small / simple | Context (optional) + one component or sequence if non-obvious |
| Medium | Context + component or deployable-unit; add sequence for critical paths |
| Large / distributed | Context + deployable units + selective component/sequence/data-flow; infrastructure when ops risk warrants it |

## Related Documents

- [architecture-diagrams.md](architecture-diagrams.md)
- [mermaid-standards.md](mermaid-standards.md)
- [architecture-model.md](architecture-model.md)
- [architecture-checklist.md](architecture-checklist.md)
