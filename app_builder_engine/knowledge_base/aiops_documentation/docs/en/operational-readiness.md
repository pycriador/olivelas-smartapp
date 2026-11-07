# Operational Readiness

> Language: EN | [Português (pt-BR)](../pt-BR/operational-readiness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to decide whether a service or capability is **ready to operate** in a shared or production environment.

Operational readiness is not a marketing launch checklist. It asks: *Can we run, observe, detect, diagnose, and recover this safely?*

## Readiness Lens

| Area | Question |
| --- | --- |
| Ownership | Who owns service, on-call, escalation? — [operational-ownership.md](operational-ownership.md) |
| Criticality | Is impact class known? — [criticality.md](criticality.md) |
| Observability | Can we see health and failures? — [observability-model.md](observability-model.md) |
| Alerting | Are alerts actionable with owners? — [alerting.md](alerting.md) |
| Runbooks | Do critical paths have procedures? — [runbooks/README.md](runbooks/README.md) |
| Deploy / rollback | Can we release and undo safely when possible? — [deployment-operations.md](deployment-operations.md) |
| Failure modes | Are important modes known? — [failure-modes.md](failure-modes.md) |
| Recovery | Backup/restore/DR as applicable — [backup-restore.md](backup-restore.md), [disaster-recovery.md](disaster-recovery.md) |
| Contracts | Timeout/retry/idempotency known at boundaries? — [contract-model.md](contract-model.md) |

Use the item checklist: [operational-readiness-checklist.md](operational-readiness-checklist.md).

## Outcomes

| Outcome | Meaning |
| --- | --- |
| Ready | Material gaps closed or accepted with explicit risk |
| Conditionally ready | Time-boxed exceptions with owners |
| Not ready | Blockers remain; do not imply production operability |

Mark unknowns as **Unknown** / **Not Defined**. Do not invent SLOs, alerts, or DR to “pass” readiness.

## Progressive Disclosure

| Project size | Bar |
| --- | --- |
| Small | Owner, how to tell broken vs healthy, one recovery path |
| Medium | Alerts + runbooks for critical failures, deploy/validate clarity |
| Large | Full reliability model, dependency reliability, practiced recovery where claimed |

## Related Documents

- [operational-readiness-checklist.md](operational-readiness-checklist.md)
- [operations-checklist.md](operations-checklist.md)
- [templates/service-profile.md](templates/service-profile.md)
- [reliability-model.md](reliability-model.md)
- [operations-model.md](operations-model.md)
