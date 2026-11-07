---
title: "Governance API (Conceptual)"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
---

# Governance API (Conceptual)

> Language: EN | [Português (pt-BR)](../pt-BR/governance-api.md)
>
> Documentation Standard v1.0

**Not implemented.** This interface describes future automation boundaries without coupling the standard to a runtime.

```text
validate() → findings + exit code
health()   → indicators + findings
report()   → written health/index artifacts
check()    → subset validation (links | manifest | …)
```

Today these map to [automation-commands.md](automation-commands.md) / `scripts/docs_lint.py`.
