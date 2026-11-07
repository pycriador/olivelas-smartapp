# Contract Checklist

> Language: EN | [Português (pt-BR)](../pt-BR/contract-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Practical checklist for technical contract documentation quality. Use what applies — not every contract needs every item.

Classify uncertain claims (`Confirmed` / `Inferred` / `Unknown` / `Proposed`). Prefer current state over aspirational design.

## General

- [ ] Purpose defined
- [ ] Participants defined
- [ ] Owner defined
- [ ] Contract type defined
- [ ] Protocol defined when applicable

## Data

- [ ] Schema documented
- [ ] Semantics documented
- [ ] Required fields defined
- [ ] Validations documented

## Behavior

- [ ] Errors documented
- [ ] Retry documented
- [ ] Timeout documented
- [ ] Idempotency documented
- [ ] Ordering documented when applicable
- [ ] Delivery semantics documented when applicable

## Evolution

- [ ] Versioning defined
- [ ] Compatibility assessed
- [ ] Breaking changes identified
- [ ] Deprecation defined when needed

## Security

- [ ] Authentication documented when applicable
- [ ] Authorization documented when applicable
- [ ] Sensitive data identified

## Operations

- [ ] Observability defined
- [ ] Failure scenarios documented

## How to Use

| Situation | Use |
| --- | --- |
| New contract | Walk the full list; mark N/A consciously |
| Small change | Check Data / Behavior / Evolution items touched by the change |
| Contract review | Use as review backbone with [contract-lifecycle.md](contract-lifecycle.md) |
| Drift found | Re-check items that contradict runtime |

Unchecked items that matter should become [contract debt](contract-debt.md) or [documentation debt](documentation-debt.md) — not silent gaps presented as Confirmed.

## Related Documents

- [contract-model.md](contract-model.md)
- [contract-lifecycle.md](contract-lifecycle.md)
- [contract-debt.md](contract-debt.md)
- [quality-model.md](quality-model.md)
- [documentation-checklist.md](documentation-checklist.md)
- [templates/contract.md](templates/contract.md)
