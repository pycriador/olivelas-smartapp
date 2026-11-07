---
title: "Document Classification (Control)"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Document Classification (Control)

> Language: EN | [Português (pt-BR)](../pt-BR/document-classification.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Control classification determines how strictly a document is governed. Distinct from claim classification (`Confirmed` / `Inferred` / …) and from security data classification.

| Class | Meaning | Control level |
| --- | --- | --- |
| **Informational** | Helpful context; not SoT | Low |
| **Operational** | Used to operate or recover | High |
| **Authoritative** | Source of truth for a domain | Highest |
| **Security-Sensitive** | Security-relevant content (still no secrets) | Highest |
| **Historical** | Past state; not current | Medium (label clearly) |
| **Deprecated** | Superseded; do not use as primary | Medium |

## Rules

1. Authoritative and Security-Sensitive changes require review per [documentation-change-policy.md](documentation-change-policy.md).
2. Historical/Deprecated must remain distinguishable ([history-model.md](history-model.md)).
3. Classification may appear in metadata `tags` or prose; authority uses `authority` field.

## Related Documents

- [authority-levels.md](authority-levels.md)
- [source-of-truth.md](source-of-truth.md)
