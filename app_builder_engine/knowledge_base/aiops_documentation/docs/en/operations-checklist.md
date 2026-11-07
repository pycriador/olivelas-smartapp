# Operations Documentation Checklist

> Language: EN | [Português (pt-BR)](../pt-BR/operations-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Practical checklist for **operations and reliability documentation** quality. Use what applies — small projects are not expected to tick every item.

Classify uncertain claims (Confirmed / Inferred / Unknown / Proposed). Prefer current state over aspirational ops theater.

## Model and Ownership

- [ ] Operations loop understood ([operations-model.md](operations-model.md))
- [ ] Operational ownership defined ([operational-ownership.md](operational-ownership.md))
- [ ] Criticality defined or N/A ([criticality.md](criticality.md))
- [ ] Service profile (or equivalent) exists for material services

## Reliability

- [ ] Reliability model or summary present ([reliability-model.md](reliability-model.md))
- [ ] Important failure modes identified ([failure-modes.md](failure-modes.md))
- [ ] Failure propagation / domains linked ([failure-propagation.md](failure-propagation.md), [failure-domains.md](failure-domains.md))
- [ ] Degradation behavior documented or Unknown ([degradation.md](degradation.md))
- [ ] Dependency reliability considered ([dependency-reliability.md](dependency-reliability.md))
- [ ] Capacity / scaling documented only where relevant

## Observability

- [ ] Observability model or template filled ([observability-model.md](observability-model.md), [templates/observability.md](templates/observability.md))
- [ ] Health checks documented or N/A ([health-checks.md](health-checks.md))
- [ ] Monitoring and alerting actionable ([monitoring.md](monitoring.md), [alerting.md](alerting.md))
- [ ] SLI/SLO/SLA stance explicit — Defined / N/A / Not Defined ([service-levels.md](service-levels.md))

## Incidents and Runbooks

- [ ] Incident process documented at usable depth ([incident-management.md](incident-management.md))
- [ ] Severity model defined or project alternative documented ([incident-severity.md](incident-severity.md))
- [ ] Runbooks exist for critical paths ([runbooks/README.md](runbooks/README.md), [templates/runbook.md](templates/runbook.md))
- [ ] Runbooks include preconditions, validation, rollback/safety notes
- [ ] Timeline / RCA / PIR guidance followed when incidents occur
- [ ] Corrective actions tracked ([corrective-actions.md](corrective-actions.md))

## Change, Deploy, Recovery

- [ ] Deploy / validate / rollback documented without invented commands ([deployment-operations.md](deployment-operations.md))
- [ ] Planned vs emergency change expectations clear ([change-management.md](change-management.md))
- [ ] Operational states vocabulary known ([operational-state.md](operational-state.md))
- [ ] Backup/restore Defined or explicit N/A ([backup-restore.md](backup-restore.md))
- [ ] RPO/RTO Defined or **Not Defined** ([rpo-rto.md](rpo-rto.md))
- [ ] DR Defined or “Formal Disaster Recovery not defined.” ([disaster-recovery.md](disaster-recovery.md))

## Drift, Debt, Readiness

- [ ] Operational drift can be registered ([operational-drift.md](operational-drift.md))
- [ ] Reliability debt register usable ([reliability-debt.md](reliability-debt.md))
- [ ] Operational readiness considered for launches ([operational-readiness-checklist.md](operational-readiness-checklist.md))
- [ ] No secrets in ops docs
- [ ] Architecture and contract links used instead of duplicated component/schema prose

## How to Use

| Situation | Use |
| --- | --- |
| New service | Walk Model → Observability → Runbooks → Recovery |
| Ops doc review | Use as review backbone |
| Post-incident | Re-check Incidents/Runbooks and Reliability items that failed |
| AI-generated ops docs | Pair with [ai-documentation.md](ai-documentation.md) review expectations |

Unchecked material items should become reliability or documentation debt — not silent Confirmed gaps.

## Related Documents

- [operational-readiness-checklist.md](operational-readiness-checklist.md)
- [operations/README.md](operations/README.md)
- [quality-model.md](quality-model.md)
- [documentation-checklist.md](documentation-checklist.md)
- [architecture-checklist.md](architecture-checklist.md)
- [contract-checklist.md](contract-checklist.md)
