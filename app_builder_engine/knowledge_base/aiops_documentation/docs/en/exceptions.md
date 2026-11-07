---
title: "Documentation Exceptions"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Documentation Exceptions

> Language: EN | [Português (pt-BR)](../pt-BR/exceptions.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

No rule may be ignored silently. Exceptions are explicit, owned, and time-bounded when temporary.

## Required Fields

| Field | Meaning |
| --- | --- |
| ID | e.g. `EXC-DOC-001` |
| Rule | Validation rule id |
| Reason | Why needed |
| Scope | Paths / docs covered |
| Owner | Accountable team |
| Expiration | `YYYY-MM-DD` for temporary exceptions |
| Approval | Approver role |
| Status | `OPEN` / `APPROVED` / `EXPIRED` / `CLOSED` |

## Expiration

Temporary exceptions become **EXPIRED** after the date. Automation emits **DOC-EXC-001** if still open.

## Storage

Place records under [exceptions/](exceptions/). Use [templates/exception.md](templates/exception.md).

## Related Documents

- [false-positives.md](false-positives.md)
- [validation-rules.md](validation-rules.md)
