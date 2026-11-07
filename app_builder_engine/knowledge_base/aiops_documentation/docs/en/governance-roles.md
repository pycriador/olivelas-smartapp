---
title: "Governance Roles"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Governance Roles

> Language: EN | [Português (pt-BR)](../pt-BR/governance-roles.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Minimum governance roles. One person/team may accumulate several.

| Role | Focus |
| --- | --- |
| **Documentation Owner** | Domain content accuracy |
| **Architecture Owner** | Architecture SoT and related ADRs |
| **Security Owner** | Security docs, exceptions, classifications |
| **Operations Owner** | Runbooks, SLOs, incident/recovery docs |
| **Repository Maintainer** | Standard structure, validation config, CI gates |

## Authority

Owners propose and maintain. Approvers (when used) accept. Maintainers control validation rules and generated artifacts policy.

AI contributors are never implicit owners ([ai-task-boundaries.md](ai-task-boundaries.md)).

## Related Documents

- [documentation-ownership.md](documentation-ownership.md)
- [governance.md](governance.md)
