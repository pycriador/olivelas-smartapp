---
title: "Documentation Standard Migration Policy"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Documentation Standard Migration Policy

> Language: EN | [Português (pt-BR)](../pt-BR/migration-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

```text
New Standard → Compatibility Analysis → Migration Plan → Migration → Validation → Review
```

1. Compare versions in [versioning.md](versioning.md).
2. List breaking vs additive changes.
3. Update manifests, metadata, and gates.
4. Run `docs:validate`.
5. Resolve ERROR; track WARNING as debt/exceptions.
6. Human review for Authoritative docs.
