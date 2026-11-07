---
title: "API de Governança (Conceitual)"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
---

# API de Governança (Conceitual)

> Language: pt-BR | [English (EN)](../en/governance-api.md)
>
> Documentation Standard v1.0

**Não implementada.** Esta interface descreve limites futuros de automação sem acoplar o padrão a um runtime.

```text
validate() → findings + exit code
health()   → indicators + findings
report()   → written health/index artifacts
check()    → subset validation (links | manifest | …)
```

Hoje isso mapeia para [automation-commands.md](automation-commands.md) / `scripts/docs_lint.py`.
