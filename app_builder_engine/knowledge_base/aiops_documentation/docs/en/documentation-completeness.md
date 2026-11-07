# Documentation Completeness

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-completeness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Completeness measures whether a **document** includes the sections and fields required for its type — without inventing missing facts.

## Principles

1. Empty required sections must say `Not applicable` or `Unknown`, not disappear silently.
2. Completeness never requires fabricating Confirmed content.
3. A short Confirmed doc beats a long invented one ([quality-model.md](quality-model.md)).

## Type Expectations (Summary)

| Type | Minimum complete when |
| --- | --- |
| Context | Purpose, scope, actors, links to deeper docs |
| Architecture | Boundaries, components, relationships, key flows or Unknown |
| Contract | Participants, schema/semantics, errors, version |
| Operation | Ownership, criticality/state signals, failure/ops links as applicable |
| Security | Scope, assets/threats/controls as in-scope — or explicit Unknown |
| Runbook | Trigger, steps, evidence of tooling, rollback/safety notes |
| Incident | ID, timeline, severity model used, open Unknowns allowed |
| Decision | Status, context, decision, consequences |
| Evidence | Claim links, references, collection date |
| Reference | Clear scope; not a dumping ground for missing Architecture |

Use existing checklists for depth:

- [architecture-checklist.md](architecture-checklist.md)
- [contract-checklist.md](contract-checklist.md)
- [operations-checklist.md](operations-checklist.md)
- [security-checklist.md](security-checklist.md)
- [documentation-checklist.md](documentation-checklist.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)

## Related Documents

- [documentation-coverage.md](documentation-coverage.md)
- [knowledge-gaps.md](knowledge-gaps.md)
