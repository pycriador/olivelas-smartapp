# Architecture Traceability

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-traceability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to connect requirements, architecture, components, contracts, and implementation so engineers can answer where a decision came from and what it affects.

Traceability does **not** need to be perfect or complete for every project. Prefer useful links over heavy matrices.

## Trace Chain

```text
Requirement
    ↓
Architecture
    ↓
Component
    ↓
Contract
    ↓
Implementation
```

| Stage | Typical artifact |
| --- | --- |
| **Requirement** | Product need, SLO, compliance constraint, platform mandate, ADR context |
| **Architecture** | Overview, boundaries, diagrams, quality attributes, constraints |
| **Component** | Component architecture docs, relationship maps |
| **Contract** | API/event/message/file/CLI contracts |
| **Implementation** | Code, config, IaC paths cited as evidence |

Related ADR chain often used in practice:

```text
Architecture → Decision (ADR) → Component → Contract
```

Architecture describes *what exists*. ADRs explain *why*. Contracts define *how parties communicate*. Implementation is evidence.

## Questions Traceability Must Support

1. **Origin:** Where did this architectural decision or structure come from?
2. **Impact:** Which components (and contracts) are affected by this decision or change?

Optional but valuable:

3. Which requirements or constraints still justify this structure?
4. Which implementation paths prove the documentation (Confirmed)?

## Lightweight Mechanisms

Use the lightest mechanism that works:

| Mechanism | When |
| --- | --- |
| Relative links in Related sections | Default for most projects |
| ADR `Affected components` / `Affected contracts` fields | Decisions with structural impact |
| Small trace table in architecture overview | Few critical requirements |
| Issue/ticket IDs | When the tracker is the requirement source of truth |
| Full RTM matrix | Only when compliance or scale demands it |

Example minimal table:

| Requirement / constraint | Architecture element | Components | Contract | Evidence |
| --- | --- | --- | --- | --- |
| Async inventory updates | Event boundary | `inventory-projector` | `inventory-adjusted@v1` | `src/...`, ADR-001 |

## Rules

1. Do not invent requirements to fill the chain. Mark Unknown.
2. Do not claim Confirmed implementation links without a path or test.
3. Prefer one canonical ADR link over repeating the decision rationale in every component doc.
4. When a contract changes, update reverse links from architecture/components as part of [architecture-review.md](architecture-review.md).
5. Proposed architecture must not be traced as if it were current state.

## Progressive Disclosure

| Project size | Expectation |
| --- | --- |
| Small | Links among overview, one ADR, main contract |
| Medium | ADR ↔ component ↔ contract links for material decisions |
| Large / regulated | Explicit trace tables for critical paths; still avoid documenting every class |

## Related Documents

- [architecture-model.md](architecture-model.md)
- [architecture-vs-implementation.md](architecture-vs-implementation.md)
- [architecture-review.md](architecture-review.md)
- [decisions/README.md](decisions/README.md)
- [contracts/README.md](contracts/README.md)
- [templates/adr.md](templates/adr.md)
