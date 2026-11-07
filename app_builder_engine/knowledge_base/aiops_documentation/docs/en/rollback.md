# Rollback

> Language: EN | [Português (pt-BR)](../pt-BR/rollback.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document rollback: returning to a prior known-good state after a bad change or failed recovery step.

## Core Rules

1. **Rollback is not always safe.** Some changes are one-way (schema migrations, data transforms, external side effects).
2. **Document irreversibility explicitly.** If rollback is impossible or partial, say so — do not imply a clean undo.
3. **Prefer project-evidenced steps.** Do not invent universal rollback commands.

## What to Document

| Topic | Question |
| --- | --- |
| Trigger | When rollback should be considered |
| Preconditions | State required before rollback |
| Procedure | Steps or link to runbook / deploy system |
| Validation | How to confirm the prior state is healthy |
| Data impact | Data loss, dual-write residue, poison messages |
| Irreversible items | What cannot be undone |
| Escalation | When rollback fails |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Irreversible and Partial Rollback

| Situation | Documentation stance |
| --- | --- |
| Fully reversible release | Document undo path and validation |
| Partially reversible | List what rolls back vs what remains |
| Irreversible | State **Not rollback-safe**; document forward-fix / restore / compensating action |
| Unknown | **Not Defined** — do not assume rollback exists |

## Relationship to Restore and DR

| Action | Typical use |
| --- | --- |
| Rollback | Undo a recent change (deploy, config, feature flag) |
| Restore | Recover data/state from backup ([backup-restore.md](backup-restore.md)) |
| DR failover / rebuild | Catastrophic recovery ([disaster-recovery.md](disaster-recovery.md)) |

Do not conflate the three. A successful rollback may still leave data inconsistency that needs a restore or compensating procedure.

## Safety

- State destructive effects before steps that delete or overwrite.
- Require confirmation of environment/target.
- Link severity and ownership when rollback is part of incident response.

## Related Documents

- [deployment-operations.md](deployment-operations.md)
- [change-management.md](change-management.md)
- [runbooks/README.md](runbooks/README.md)
- [templates/runbook.md](templates/runbook.md)
- [incident-management.md](incident-management.md)
