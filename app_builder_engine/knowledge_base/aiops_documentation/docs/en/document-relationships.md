# Document Relationships

> Language: EN | [Português (pt-BR)](../pt-BR/document-relationships.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Controlled vocabulary for relationships between documents and between documents and architectural units.

Complements (does not replace) runtime component relationship verbs in [component-relationships.md](component-relationships.md).

## Vocabulary (Documents)

| Predicate | Meaning | Inverse (typical) |
| --- | --- | --- |
| `describes` | A narrates or specifies B | `described_by` |
| `summarizes` | A is a shorter view of B | `detailed_by` |
| `depends_on` | Understanding/maintaining A requires B | `required_by` |
| `references` | A cites B without depending for correctness | `referenced_by` |
| `supersedes` | A replaces B as current | `superseded_by` |
| `constrains` | A (usually ADR/policy) limits B | `constrained_by` |
| `implements` | A realizes decision/requirement B | `implemented_by` |
| `evidences` / `evidenced_by` | A supports claims in B | — |
| `operates` | Ops/runbook doc A applies to unit B | `operated_by` |
| `secures` | Security doc A covers asset/unit B | `secured_by` |
| `related_to` | Weak link; prefer a stronger predicate | `related_to` |

## Vocabulary (Doc ↔ Component/Service/Contract)

| Predicate | Meaning |
| --- | --- |
| `includes` | Architecture doc lists component |
| `exposes` | Component/service offers contract |
| `consumes` | Component/service uses contract |
| `owns` | Owner doc/team owns unit |
| `monitors` | Ops doc defines signals for unit |
| `maps_to` | Doc id maps to runtime contract key |

## Rules

1. Prefer the strongest accurate predicate over `related_to`.
2. Keep a small project-allowed subset if needed; do not invent contradictory synonyms (`depends` vs `depends_on`).
3. Document edges in tables or metadata lists for machine readability.
4. Relationship ≠ evidence classification.

## Example Table

| From | Predicate | To |
| --- | --- | --- |
| `ARCH-001` | `includes` | `CMP-001` |
| `CONTRACT-001` | `maps_to` | `order-created@v1` |
| `ADR-012` | `constrains` | `ARCH-001` |
| `RB-014` | `operates` | `SVC-001` |

## Related Documents

- [documentation-graph.md](documentation-graph.md)
- [component-relationships.md](component-relationships.md)
- [documentation-dependencies.md](documentation-dependencies.md)
