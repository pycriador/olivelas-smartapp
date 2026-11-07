# RPO and RTO

> Language: EN | [Português (pt-BR)](../pt-BR/rpo-rto.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document Recovery Point Objective (RPO) and Recovery Time Objective (RTO) clearly — and when to say they are not defined.

## Definitions

| Term | Meaning | Measures |
| --- | --- | --- |
| **RPO** (Recovery Point Objective) | Maximum acceptable **data loss**, measured backward from the failure moment | Time (or event gap) between last good recoverable point and failure |
| **RTO** (Recovery Time Objective) | Maximum acceptable **time to restore** a usable service after a failure is declared | Duration from failure (or declaration) until the capability meets the agreed recovery criteria |

```text
Timeline:  … last good point … [data loss window = RPO] … failure … [restore window = RTO] … usable again
```

They answer different questions:

- RPO → *How much data can we lose?*
- RTO → *How long can we be down (or degraded beyond acceptable)?*

Do **not** treat RPO and RTO as synonyms. Do not invent numeric targets.

## When Unknown

If the project has no agreed RPO or RTO, state:

> **Not Defined**

Optionally note whether a target is Proposed (future) vs Confirmed (accepted policy). Never present a Proposed target as current commitment.

## What to Document When Defined

| Field | Content |
| --- | --- |
| Capability / data set | What the objective applies to |
| RPO | Value + how it is achieved (e.g. backup interval, replication lag bound) |
| RTO | Value + recovery path that supports it |
| Recovery criteria | What “usable again” means |
| Owner | Who owns meeting or revising the objective |
| Evidence | Backup cadence, DR drill, replication config — as applicable |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Relationship to Other Docs

| Concern | Document |
| --- | --- |
| How backups support RPO | [backup-restore.md](backup-restore.md) |
| Broader catastrophe recovery | [disaster-recovery.md](disaster-recovery.md) |
| Routine incident restore | Runbooks / [incident-management.md](incident-management.md) |
| Contract timeouts | Timing contracts are **not** RTO — [timing-contract.md](timing-contract.md) |

## Anti-Patterns

- Publishing aggressive RTO without a practiced recovery path.
- Assuming backup frequency equals RPO without verifying restore usability.
- Copying industry “tier” numbers without project agreement.

## Related Documents

- [disaster-recovery.md](disaster-recovery.md)
- [backup-restore.md](backup-restore.md)
- [reliability-model.md](reliability-model.md)
- [criticality.md](criticality.md)
- [operations-model.md](operations-model.md)
