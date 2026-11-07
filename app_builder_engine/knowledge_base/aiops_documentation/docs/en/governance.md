---
title: "Documentation Governance"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Documentation Governance

> Language: EN | [Português (pt-BR)](../pt-BR/governance.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Governance makes documentation quality **enforceable**, not merely recommended.

```text
Standards → Ownership → Lifecycle → Validation → Quality Gates → Exceptions → Audit → Health
```

## Questions Governance Answers

| Question | Where |
| --- | --- |
| Who may change documentation? | [documentation-ownership.md](documentation-ownership.md), [governance-roles.md](governance-roles.md) |
| Who may approve? | [documentation-change-policy.md](documentation-change-policy.md), [review-policy.md](review-policy.md) |
| Which documents require review? | [document-classification.md](document-classification.md), [change-classification.md](change-classification.md) |
| Which documents are authoritative? | [source-of-truth.md](source-of-truth.md), [authority-levels.md](authority-levels.md) |
| Which changes require validation? | [quality-gates.md](quality-gates.md), [automation.md](automation.md) |
| What may be automated? | [automation.md](automation.md), [validation-rules.md](validation-rules.md) |
| What requires human approval? | Matrix in this doc + [documentation-change-policy.md](documentation-change-policy.md) |
| How are exceptions recorded? | [exceptions.md](exceptions.md) |
| How are deprecated docs handled? | [deprecation.md](deprecation.md), [history-model.md](history-model.md) |
| How are conflicts handled? | [contradiction-model.md](contradiction-model.md), [contradictions/](contradictions/) |

## Machine Validation vs Human Review

| Kind | Responsibility |
| --- | --- |
| **Machine validation** | Objective rules: metadata, IDs, links, manifest sync, expired exceptions, structural claim tokens |
| **Human review** | Semantic correctness: architecture truth, security adequacy, operational safety, evidence strength, contradiction resolution |

Automation must not silently change Authoritative knowledge.

## Official Workflow

```text
Change → Classify → Identify Impact → Update Documentation → Run Automation
→ Resolve Errors → Review → Approve → Merge → Generate Reports
```

## Automated vs Human Responsibility

| Activity | Automation | Human |
| --- | --- | --- |
| Metadata validation | Yes | Optional |
| Link validation | Yes | No |
| Duplicate IDs | Yes | No |
| Manifest validation | Yes | Optional |
| Semantic consistency | Partial | Yes |
| Architecture correctness | No | Yes |
| Security correctness | Partial | Yes |
| Ownership assignment | Partial | Yes |
| Evidence validity | Partial | Yes |
| Documentation freshness | Partial | Yes |
| Contradiction resolution | No | Yes |
| Exception approval | No | Yes |
| AI-generated content acceptance | Partial | Yes |

## Governance Boundaries

Automation must **not**:

- auto-approve Critical changes;
- invent evidence;
- silently modify Authoritative documents;
- remove history;
- hide errors;
- delete exceptions without record;
- ignore security findings;
- replace human ownership.

## Related Documents

- [principles.md](principles.md) (GV-* principles)
- [ownership.md](ownership.md)
- [change-policy.md](change-policy.md)
- [automation.md](automation.md)
- [quality-gates.md](quality-gates.md)
- [governance-auditability.md](governance-auditability.md)
