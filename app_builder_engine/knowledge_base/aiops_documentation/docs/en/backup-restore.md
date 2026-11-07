# Backup and Restore

> Language: EN | [Português (pt-BR)](../pt-BR/backup-restore.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document backup and restore capabilities without inventing coverage that does not exist.

## When Not Applicable or Unknown

If the project has no backup/restore practice (or it is unknown):

| Situation | Statement |
| --- | --- |
| Intentionally none | **Not Applicable** — with a short reason (e.g. ephemeral compute with no durable state) |
| Unknown | **Not Defined** / Unknown — do not invent schedules, retention, or restore steps |
| Partial | Document what exists; mark gaps honestly |

Never invent backup frequency, retention, encryption, or restore runbooks.

## What to Document When Backups Exist

| Topic | Question |
| --- | --- |
| What is backed up | Datastores, object stores, config, secrets references (not values), artifacts |
| What is not | Explicit exclusions |
| Frequency / trigger | Schedule or event-driven — as actually configured |
| Retention | How long copies are kept |
| Location / isolation | Same account/region vs separate — without inventing isolation |
| Ownership | Who owns backup health and restore drills |
| Restore procedure | Link runbook or [templates/recovery-procedure.md](templates/recovery-procedure.md) |
| Last verified restore | Date / evidence if known; else Unknown |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Restore Notes

- Restore is a **recovery** action: document preconditions, validation, and whether it is destructive or irreversible ([rollback.md](rollback.md)).
- Align claimed RPO with actual backup cadence ([rpo-rto.md](rpo-rto.md)).
- Do not embed credentials or secret values — document secret **references** only ([standards.md](standards.md)).

## Suggested Inventory Table

| Asset | Backup? | Frequency | Retention | Restore runbook | Last tested | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| | yes / no / N/A | | | | | |

## Related Documents

- [disaster-recovery.md](disaster-recovery.md)
- [rpo-rto.md](rpo-rto.md)
- [operational-readiness.md](operational-readiness.md)
- [runbooks/README.md](runbooks/README.md)
- [templates/recovery-procedure.md](templates/recovery-procedure.md)
