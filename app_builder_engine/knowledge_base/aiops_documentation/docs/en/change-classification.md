---
title: "Change Classification"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Change Classification

> Language: EN | [Português (pt-BR)](../pt-BR/change-classification.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Classify documentation (and docs-impacting) changes by impact.

| Level | Meaning | Examples |
| --- | --- | --- |
| **Low** | Editorial / non-semantic | Typos, formatting, link text |
| **Medium** | Documented behavior change | Clarify retry semantics, update SLO target text |
| **High** | Architectural, contractual, or operational change | New component boundary, contract field, runbook steps |
| **Critical** | Material security, availability, or integrity impact | Authn/authz change, secret handling, recovery path |

## Mapping to Gates

| Level | Validation | Human review |
| --- | --- | --- |
| Low | Lint | Optional |
| Medium | Lint + targeted review | Recommended |
| High | Lint + domain review | Required |
| Critical | Lint + security/ops as applicable | Required |

See [change-impact-matrix.md](change-impact-matrix.md).
