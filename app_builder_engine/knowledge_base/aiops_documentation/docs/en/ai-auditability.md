# AI Auditability

> Language: EN | [Português (pt-BR)](../pt-BR/ai-auditability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Make AI-assisted documentation changes and answers reconstructible.

## What to Record

| Item | Example |
| --- | --- |
| Task | “Update contract after field add” |
| Inputs loaded | `ai-context.md`, `CONTRACT-001`, schema path |
| Evidence used | file paths, ADR ids, dates |
| Classifications applied | Confirmed/Inferred/… |
| Outputs touched | paths + diff summary |
| Validation | ERROR/WARNING list |
| Human decisions | acceptance, deferrals |

## Rules

1. Prefer repository history (PR descriptions, commits) as the durable audit trail.
2. Do not store secrets in audit notes.
3. Link contradiction/debt ids when deferring.
4. Distinguish AI-suggested vs human-accepted status changes.

## Related Documents

- [ai-documentation-workflow.md](ai-documentation-workflow.md)
- [changelog-policy.md](changelog-policy.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
