# Architecture

> Language: EN | [Português (pt-BR)](../../pt-BR/architecture/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Category for architecture documentation in adopting projects, plus pointers to the methodology defined by this standard.

## Objective

Describe structure and architectural behavior of the system: boundaries, components, communication, data flow, failure domains, trust boundaries, and trade-offs.

## Guidance

- Document **current state** first.
- Link decisions to ADRs in `docs/decisions/`.
- Keep proposals labeled Proposed; never present them as existing architecture.
- Prefer diagrams when they clarify relationships.
- Use progressive disclosure — small projects do not need every document or diagram type.

## Methodology (Documentation Standard)

| Document | Purpose |
| --- | --- |
| [../architecture-model.md](../architecture-model.md) | Documentation levels (Context → Implementation) and audience depth (Levels 1–4) |
| [../system-boundaries.md](../system-boundaries.md) | In/out of scope; what the system does not control |
| [../component-relationships.md](../component-relationships.md) | Relationship types and labeled dependency direction |
| [../architecture-diagrams.md](../architecture-diagrams.md) | Diagram standards and types |
| [../diagram-selection.md](../diagram-selection.md) | Which diagram answers which question |
| [../mermaid-standards.md](../mermaid-standards.md) | Mermaid naming, direction, complexity |
| [../failure-domains.md](../failure-domains.md) | Blast radius, isolation, recovery |
| [../trust-boundaries.md](../trust-boundaries.md) | Architectural trust edges |
| [../architecture-traceability.md](../architecture-traceability.md) | Requirement → … → Implementation links |
| [../architecture-vs-implementation.md](../architecture-vs-implementation.md) | Architecture vs design vs implementation |
| [../architecture-by-project-type.md](../architecture-by-project-type.md) | Guidance by project shape (not requirements) |
| [../architecture-checklist.md](../architecture-checklist.md) | Quality checklist |
| [../architecture-review.md](../architecture-review.md) | When/who/what/how to review; lifecycle status |
| [../architecture-drift.md](../architecture-drift.md) | Documented ≠ actual; register and treat |
| [../architecture-debt.md](../architecture-debt.md) | Architecture debt vs technical and documentation debt |

## Suggested Project Contents

| Document | Purpose |
| --- | --- |
| `overview.md` (or architecture overview) | Architecture overview for the system |
| Component architecture docs | Deeper views when needed |
| Diagrams | Mermaid or other text-based diagrams |

## Templates

Use [../templates/architecture.md](../templates/architecture.md) and related architecture templates under [../templates/](../templates/) as they are adopted by the project.

## Related Templates

- [../templates/component.md](../templates/component.md)
- [../templates/diagram.md](../templates/diagram.md)
- [../templates/adr.md](../templates/adr.md)
- [../templates/review-record.md](../templates/review-record.md)
