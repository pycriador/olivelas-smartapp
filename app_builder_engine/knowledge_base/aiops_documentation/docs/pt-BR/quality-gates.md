---
title: "Quality Gates da Documentação"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Quality Gates da Documentação

> Language: pt-BR | [English (EN)](../en/quality-gates.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

```text
Change → Validation → Quality Gate → Review → Merge
```

## Níveis de gate

| Gate | Foco | Modo principal |
| --- | --- | --- |
| **Gate 1 — Structural** | Metadados, IDs, links, manifest | Automated |
| **Gate 2 — Semantic** | Significado, verdade arquitetural | Human |
| **Gate 3 — Segurança** | Docs de segurança e higiene de secrets | Automated + Human |
| **Gate 4 — Operational** | Runbooks, alerts, recovery | Human (+ lint) |
| **Gate 5 — Prontidão para IA** | Context, evidence, relationships | Automated + Human |

## Política de falha no CI

| Severidade | CI |
| --- | --- |
| ERROR | FAIL |
| WARNING | PASS + warning |
| INFO | PASS |

Exceções documentadas podem dispensar regras específicas ([exceptions.md](exceptions.md)).
