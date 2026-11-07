---
title: "Documentation Automation"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Documentation Automation

> Language: EN | [Português (pt-BR)](../pt-BR/automation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Conceptual automation architecture for in-repo documentation validation.

```text
Documentation → Parser → Rules → Validation → Report → Quality Gate
```

## Principles

1. Prefer objective, automatable rules.
2. Local and CI use the **same** tool and config.
3. Do not call external services by default.
4. Never execute arbitrary content from documents.
5. Generated outputs are clearly marked ([generated-policy.md](generated-policy.md)).

## Validation Categories

| Category | Examples |
| --- | --- |
| Structure | Required sections when templates declare them |
| Metadata | status, owner, authority enums |
| Links | Broken relative Markdown targets |
| References | Manifest paths, relationship targets |
| Manifest | Missing/duplicate entries |
| Relationships | Source/target existence |
| Consistency | ID uniqueness per language tree |
| Security | Secret-pattern scan (no value logging) |
| Freshness | Stale dates → WARNING |
| Ownership | Authoritative without owner → ERROR |
| AI Readiness | `ai-context.md` present |

## Implementation in This Repository

| Piece | Location |
| --- | --- |
| Linter | [../../scripts/docs_lint.py](../../scripts/docs_lint.py) |
| Config | [../validation-config.yaml](../validation-config.yaml) |
| Rules registry | [validation-rules.md](validation-rules.md) |
| Commands | [automation-commands.md](automation-commands.md) |
| Security | [automation-security.md](automation-security.md) |

## Related Documents

- [quality-gates.md](quality-gates.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
