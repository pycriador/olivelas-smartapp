# Contradiction Model

> Language: EN | [Português (pt-BR)](../pt-BR/contradiction-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How to detect, record, and resolve contradictory documentation claims.

## What Counts as a Contradiction

Two or more claims in scope that cannot all be true for the same timeframe/environment, including:

- Doc A vs Doc B
- Doc vs code/config/contract
- ADR vs current architecture doc
- Runbook vs actual tooling

## Record Shape

| Field | Meaning |
| --- | --- |
| ID | Optional `CONTRA-XXX` |
| Claim A | Statement + source |
| Claim B | Statement + source |
| Scope | Env / version / time |
| Detection date | `YYYY-MM-DD` |
| Status | Open / Investigating / Resolved / Accepted divergence |
| Resolution | SoT chosen, docs updated, or justified dual-state |

## Resolution Order

Follow [source-of-truth.md](source-of-truth.md). If unresolved, keep **Open** and lower confidence; do not invent a synthesis that denies the conflict.

## AI Rules

- Surface contradictions explicitly in answers.
- Do not delete one side without evidence-based resolution.
- Link to domain drift docs when the contradiction is drift.

## Related Documents

- [documentation-drift.md](documentation-drift.md)
- [knowledge-gaps.md](knowledge-gaps.md)
- [claims.md](claims.md)
