---
title: "Governance Auditability"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Governance Auditability

> Language: EN | [Português (pt-BR)](../pt-BR/governance-auditability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Traceability for **documentation governance events**. Distinct from security auditability ([auditability.md](auditability.md)) and AI change audit ([ai-auditability.md](ai-auditability.md)).

## Auditable Events

- documentation created / modified / deprecated;
- validation executed / failed;
- exception created / approved / expired;
- authoritative document changed;
- governance policy or validation-config changed;
- generated reports produced.

## Mechanisms

| Event | Mechanism |
| --- | --- |
| Content change | Git history + PR |
| Docs change proposal | [templates/documentation-change.md](templates/documentation-change.md) |
| AI-assisted change | [templates/ai-change-record.md](templates/ai-change-record.md) |
| Exception | [exceptions/](exceptions/) |
| Validation | CI logs + [reports/](reports/) |

Reuse existing change-record templates; do not invent a parallel audit store.
