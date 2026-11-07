# Operational Readiness Checklist

> Language: EN | [Português (pt-BR)](../pt-BR/operational-readiness-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Practical checklist before treating a service as operable in a shared or production environment. Use what applies — mark N/A consciously.

Prefer current-state evidence over aspirational design. Unchecked material items become [reliability debt](reliability-debt.md) or [documentation debt](documentation-debt.md).

## Ownership and Criticality

- [ ] Service / capability owner defined
- [ ] Operational / on-call owner defined (may be same team)
- [ ] Escalation path defined
- [ ] Criticality (or equivalent) defined
- [ ] Dependency owners identifiable for critical deps

## Service Identity

- [ ] Purpose and scope clear ([templates/service-profile.md](templates/service-profile.md) or equivalent)
- [ ] Main dependencies listed (runtime / data / identity as applicable)
- [ ] Architecture and failure domains linked — not duplicated narratively

## Observability and Detection

- [ ] Health signals defined when applicable ([health-checks.md](health-checks.md))
- [ ] Key metrics / logs / traces documented or marked N/A ([observability-model.md](observability-model.md))
- [ ] Monitoring covers material failure modes ([monitoring.md](monitoring.md))
- [ ] Alerts are actionable and owned ([alerting.md](alerting.md))
- [ ] Alert → runbook (or explicit action) linkage exists for critical alerts

## Response and Recovery

- [ ] Runbooks exist for critical failure paths ([runbooks/README.md](runbooks/README.md))
- [ ] Incident severity model known or marked N/A ([incident-severity.md](incident-severity.md))
- [ ] Rollback or forward-fix stance documented for typical releases ([rollback.md](rollback.md))
- [ ] Backup / restore documented or explicit N/A ([backup-restore.md](backup-restore.md))
- [ ] RPO / RTO Defined or **Not Defined** ([rpo-rto.md](rpo-rto.md))
- [ ] Formal DR Defined or “Formal Disaster Recovery not defined.” ([disaster-recovery.md](disaster-recovery.md))

## Change and Deploy

- [ ] Deploy path documented at operable level ([deployment-operations.md](deployment-operations.md))
- [ ] Validation criteria for releases defined
- [ ] Planned vs emergency change expectations known ([change-management.md](change-management.md))
- [ ] Maintenance impact can be communicated ([maintenance.md](maintenance.md))

## Contracts and Reliability

- [ ] Critical boundary timeouts / retries / idempotency documented or Unknown
- [ ] Important failure modes catalogued or summarized ([failure-modes.md](failure-modes.md))
- [ ] Degradation behavior known or Unknown ([degradation.md](degradation.md))
- [ ] SLIs/SLOs Defined, N/A, or Not Defined — not invented ([service-levels.md](service-levels.md))

## Documentation Quality

- [ ] Ops docs have owners and fresh `updated` metadata
- [ ] No secrets in runbooks or examples
- [ ] Unknowns marked; no false Confirmed claims
- [ ] Links to architecture / contracts resolve

## How to Use

| Situation | Use |
| --- | --- |
| New service launch | Walk the full list |
| Major redesign | Re-check Observability, Recovery, Contracts |
| Incident follow-up | Re-check items that failed in practice |
| Periodic review | Sample critical services |

## Related Documents

- [operational-readiness.md](operational-readiness.md)
- [operations-checklist.md](operations-checklist.md)
- [reliability-debt.md](reliability-debt.md)
- [quality-model.md](quality-model.md)
