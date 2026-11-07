---
title: "Gestão de Falsos Positivos"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Gestão de Falsos Positivos

> Language: pt-BR | [English (EN)](../en/false-positives.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Achados da automação que não são problemas reais não devem ser ignorados.

Para cada falso positivo:

```text
Fix Rule  OR  Document Exception
```

Registre em [exceptions/](exceptions/) com rule id, reason, owner e expiration quando temporário.
