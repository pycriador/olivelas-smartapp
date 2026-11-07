---
title: "False Positive Management"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# False Positive Management

> Language: EN | [Português (pt-BR)](../pt-BR/false-positives.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Automation findings that are not real problems must not be ignored.

For each false positive:

```text
Fix Rule  OR  Document Exception
```

Record in [exceptions/](exceptions/) with rule id, reason, owner, and expiration when temporary.
