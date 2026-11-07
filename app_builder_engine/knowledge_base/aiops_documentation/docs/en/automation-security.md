---
title: "Automation Security"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Automation Security

> Language: EN | [Português (pt-BR)](../pt-BR/automation-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Requirements

- Scripts use stdlib only; no arbitrary code execution from Markdown.
- Do not print secret values — only rule id and location.
- Do not upload documentation to external services without authorization.
- CI tokens: least privilege; no secrets in docs or logs.
- Validate paths to prevent traversal outside the repository root.
- Avoid shell interpolation of document content.

## Secret Handling

If DOC-SEC-001 fires: treat as compromised until proven placeholder — rotate real credentials before history cleanup ([secure-handling practices](secrets-management.md)).

## External Integrations

Optional future integrations (issue tracker, chat, AI platform, portal) are **not** required by this standard.
