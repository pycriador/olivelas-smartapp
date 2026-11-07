---
title: "Documentation Quality Gates"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Documentation Quality Gates

> Language: EN | [Português (pt-BR)](../pt-BR/quality-gates.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

```text
Change → Validation → Quality Gate → Review → Merge
```

## Gate Levels

| Gate | Focus | Primary mode |
| --- | --- | --- |
| **Gate 1 — Structural** | Metadata, IDs, links, manifest | Automated |
| **Gate 2 — Semantic** | Meaning, architecture truth | Human |
| **Gate 3 — Security** | Security docs & secret hygiene | Automated + Human |
| **Gate 4 — Operational** | Runbooks, alerts, recovery | Human (+ lint) |
| **Gate 5 — AI Readiness** | Context, evidence, relationships | Automated + Human |

## CI Failure Policy

| Severity | CI |
| --- | --- |
| ERROR | FAIL |
| WARNING | PASS + warning |
| INFO | PASS |

Documented exceptions may waive specific rules ([exceptions.md](exceptions.md)).
