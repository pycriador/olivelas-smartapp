---
title: "Documentation Ownership Model"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Documentation Ownership Model

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Extends [ownership.md](ownership.md) with governance roles for who may propose, maintain, and approve documentation.

## Roles

| Role | Responsibility |
| --- | --- |
| **Owner** | Accountable for content accuracy and currency |
| **Reviewer** | Reviews for technical / operational / security accuracy |
| **Maintainer** | Accountable for documentation structure, standards, and tooling |
| **Contributor** | Proposes changes (human or AI agent under human direction) |

Roles may be held by the same team. Prefer durable team/role ids over personal names in metadata.

## Expectations

| Document class | Owner | Reviewer |
| --- | --- | --- |
| Authoritative | Required | Required for material change |
| Operational | Required | Operational review |
| Security-Sensitive | Required | Security review |
| Informational | Recommended | Optional |
| Historical / Deprecated | Last known owner retained | Optional |

## Unknown Ownership

Do not invent owners. Record Unknown and open a knowledge gap or ownership debt item.

## Related Documents

- [ownership.md](ownership.md)
- [ownership-matrix.md](ownership-matrix.md)
- [governance-roles.md](governance-roles.md)
