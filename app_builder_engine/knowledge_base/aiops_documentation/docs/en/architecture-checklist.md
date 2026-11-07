# Architecture Documentation Checklist

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Practical checklist for architecture documentation quality. Use what applies — small projects are not expected to tick every item.

Classify uncertain claims (Confirmed / Inferred / Unknown / Proposed). Prefer current state over aspirational design.

## Context

- [ ] Is the purpose clear?
- [ ] Is the context documented?
- [ ] Is the system boundary clear?
- [ ] Are relevant actors identified?

## Structure

- [ ] Are main components identified?
- [ ] Are responsibilities clear?
- [ ] Are dependencies documented?
- [ ] Is dependency direction clear (labeled relationships)?

## Behavior

- [ ] Are important flows documented?
- [ ] Are relevant interactions documented?
- [ ] Are important states documented (when the system has meaningful lifecycles)?

## Resilience

- [ ] Were failure domains considered?
- [ ] Were critical dependencies identified?

## Security

- [ ] Were trust boundaries identified when applicable?

## Decisions

- [ ] Were relevant trade-offs documented?
- [ ] Are related ADRs referenced?

## Quality

- [ ] Were relevant architectural quality attributes identified?
- [ ] Are constraints documented?

## Maintainability

- [ ] Are diagrams up to date?
- [ ] Do references work?
- [ ] Does the document have an owner?
- [ ] Is the status correct (`DRAFT` / `REVIEW` / `ACCEPTED` / `DEPRECATED` / `ARCHIVED`)?

## How to Use

| Situation | Use |
| --- | --- |
| New architecture overview | Walk the full list; skip N/A sections consciously |
| Small change | Check Structure / Behavior / Maintainability items touched by the change |
| Architecture review | Use as the review backbone ([architecture-review.md](architecture-review.md)) |
| PR for structural change | Pair with [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md) |

Unchecked items that matter should become documentation or [architecture debt](architecture-debt.md) — not silent gaps presented as Confirmed.

## Related Documents

- [architecture-model.md](architecture-model.md)
- [architecture-review.md](architecture-review.md)
- [architecture-drift.md](architecture-drift.md)
- [architecture-debt.md](architecture-debt.md)
- [documentation-checklist.md](documentation-checklist.md)
- [quality-model.md](quality-model.md)
