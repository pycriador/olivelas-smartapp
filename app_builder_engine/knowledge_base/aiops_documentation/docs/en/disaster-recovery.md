# Disaster Recovery

> Language: EN | [Português (pt-BR)](../pt-BR/disaster-recovery.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document disaster recovery (DR) when the project has — or deliberately does not have — a formal DR posture.

DR is about recovering from **severe loss of capability or site** (region failure, catastrophic data loss, prolonged outage), not routine incident mitigation. Routine recovery belongs in runbooks and [rollback.md](rollback.md).

## When Formal DR Is Not Defined

If the project has no formal DR plan, strategy, or drill practice, state exactly:

> Formal Disaster Recovery not defined.

Do **not** invent multi-region failover, secondary sites, or RTO targets to fill the template. Prefer honesty over theater.

## What to Document When DR Exists

| Topic | Question |
| --- | --- |
| Scope | Which capabilities / data are in scope? |
| Threats covered | Site loss, datastore loss, ransomware, prolonged dependency outage — as actually planned |
| Strategy | Active-active, active-passive, rebuild-from-backup, manual rebuild, other |
| Dependencies | What must be available for recovery to succeed |
| Roles | Who declares DR, who executes, who communicates — [operational-ownership.md](operational-ownership.md) |
| Runbooks / procedures | Links to recovery procedures |
| Validation | How recovery success is verified |
| RPO / RTO | Link [rpo-rto.md](rpo-rto.md); mark **Not Defined** if unknown |
| Backups | Link [backup-restore.md](backup-restore.md) |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Progressive Disclosure

| Project size | Expectation |
| --- | --- |
| Small / non-critical | Explicit N/A statement is enough |
| Medium | Document actual backup/rebuild path; avoid fake multi-site claims |
| Large / critical | Formal strategy, owners, drills or game days when practiced |

## Anti-Patterns

- Claiming DR coverage without a tested recovery path.
- Copying cloud vendor “best practice” as Confirmed project policy.
- Treating every outage as a DR event (dilutes the term).

## Related Documents

- [backup-restore.md](backup-restore.md)
- [rpo-rto.md](rpo-rto.md)
- [reliability-model.md](reliability-model.md)
- [incident-management.md](incident-management.md)
- [templates/recovery-procedure.md](templates/recovery-procedure.md)
- [operations-model.md](operations-model.md)
