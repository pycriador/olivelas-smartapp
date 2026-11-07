---
title: "Documentation Change Policy (Governance)"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Documentation Change Policy (Governance)

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-change-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Extends [change-policy.md](change-policy.md) with validation, approval, evidence, and ADR triggers for governed documentation.

## When Validation Is Required

Run `docs:validate` (see [automation-commands.md](automation-commands.md)) for any change that touches:

- `docs/**`
- `examples/**` (when adopting projects use them as SoT samples)
- `docs/validation-config.yaml`
- `scripts/docs_lint.py`
- manifests

## When Review / Approval Is Required

| Trigger | Review |
| --- | --- |
| Authoritative content change | Domain owner / reviewer |
| Security-Sensitive change | Security review |
| Operational procedure change | Operations review |
| Validation rule / gate change | Repository maintainer (+ impact note) |
| Exception create/approve | Exception approver |
| AI-proposed Authoritative edit | Human acceptance required |

## When Evidence Is Required

Material claims that move to Confirmed need evidence references ([claims.md](claims.md)).

## When Changelog / ADR Is Required

| Trigger | Artifact |
| --- | --- |
| Standard version bump | [versioning.md](versioning.md) + root README |
| Architecture decision | ADR |
| Breaking documentation standard change | Migration notes ([migration-policy.md](migration-policy.md)) |

## Related Documents

- [change-policy.md](change-policy.md)
- [change-classification.md](change-classification.md)
- [quality-gates.md](quality-gates.md)
- [templates/documentation-change.md](templates/documentation-change.md)
- [templates/ai-change-record.md](templates/ai-change-record.md)
