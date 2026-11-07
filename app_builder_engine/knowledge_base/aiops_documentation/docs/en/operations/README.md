# Operations

> Language: EN | [Português (pt-BR)](../../pt-BR/operations/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Category for operations and reliability documentation in adopting projects, plus the Operations & Reliability methodology defined by this standard.

## Objective

Describe how to run, observe, detect, diagnose, respond, recover, learn, and improve — without inventing SLOs, alerts, DR, or commands that do not exist.

## Architecture and Contracts Integration

```text
Architecture
      │
      ├── Components
      ├── Dependencies
      └── Failure Domains
              │
              ▼
         Operations
              │
              └── Recovery
```

Contracts feed **Timeout / Retry / Idempotency / Delivery** into reliability behavior. Prefer links:

- Architecture docs name structure and failure domains — do **not** duplicate component descriptions in ops docs.
- Contract docs hold verifiable boundary rules — ops docs consume them for failure handling and runbooks.

See [../architecture-model.md](../architecture-model.md), [../failure-domains.md](../failure-domains.md), [../contract-model.md](../contract-model.md), [../operations-model.md](../operations-model.md).

## Guidance

- Write procedures as executable steps with preconditions, validation, and rollback/safety notes.
- Mark **Not Applicable** / **Not Defined** / Unknown honestly.
- When formal DR is absent: *Formal Disaster Recovery not defined.*
- Keep runbooks aligned with current architecture and contracts.
- Never embed secrets in operational examples.
- Do not invent universal deploy/chaos commands.

## Methodology (Documentation Standard)

### Model and ownership

| Document | Purpose |
| --- | --- |
| [../operations-model.md](../operations-model.md) | Operate→Observe→Detect→Diagnose→Respond→Recover→Learn→Improve |
| [../operational-ownership.md](../operational-ownership.md) | Service / technical / operational / on-call / escalation / dependency owners |
| [../criticality.md](../criticality.md) | Criticality levels and factors |
| [../templates/service-profile.md](../templates/service-profile.md) | Service operational identity card |

### Service levels

| Document | Purpose |
| --- | --- |
| [../service-levels.md](../service-levels.md) | SLI → SLO → SLA |
| [../error-budget.md](../error-budget.md) | Error budget policy |
| [../templates/sli.md](../templates/sli.md) | SLI template |
| [../templates/slo.md](../templates/slo.md) | SLO template (includes Error Budget) |

### Reliability

| Document | Purpose |
| --- | --- |
| [../reliability-model.md](../reliability-model.md) | Deps, SPOF, failure modes, degradation, recovery, limits |
| [../failure-modes.md](../failure-modes.md) | Failure mode catalog guidance |
| [../failure-propagation.md](../failure-propagation.md) | Start / propagate / isolate / impact |
| [../degradation.md](../degradation.md) | Graceful / hard / partial |
| [../dependency-reliability.md](../dependency-reliability.md) | Dependency reliability table |
| [../operational-dependencies.md](../operational-dependencies.md) | Runtime / build / deployment / operational deps |
| [../capacity.md](../capacity.md) | Capacity metrics (relevant only) |
| [../scaling.md](../scaling.md) | Scaling strategies |
| [../templates/failure-mode.md](../templates/failure-mode.md) | Failure mode template |
| [../templates/capacity-limit.md](../templates/capacity-limit.md) | Capacity limit template |

### Observability

| Document | Purpose |
| --- | --- |
| [../observability-model.md](../observability-model.md) | Metrics / logs / traces / events / health signals |
| [../health-checks.md](../health-checks.md) | Liveness / readiness / dependency / business |
| [../monitoring.md](../monitoring.md) | What / why / source / threshold / action |
| [../alerting.md](../alerting.md) | Actionable alerts |
| [../observability/README.md](../observability/README.md) | Observability category index |
| [../templates/observability.md](../templates/observability.md) | Project observability template |
| [../templates/alert.md](../templates/alert.md) | Alert template |

### Incidents and runbooks

| Document | Purpose |
| --- | --- |
| [../runbooks/README.md](../runbooks/README.md) | Runbook concept and safety rules |
| [../incident-management.md](../incident-management.md) | Incident lifecycle |
| [../incident-severity.md](../incident-severity.md) | Severity models |
| [../incident-timeline.md](../incident-timeline.md) | FACT / HYPOTHESIS / CONFIRMED / UNKNOWN |
| [../root-cause-analysis.md](../root-cause-analysis.md) | Root cause vs factors / gaps |
| [../post-incident-review.md](../post-incident-review.md) | Blameless PIR |
| [../corrective-actions.md](../corrective-actions.md) | Preventive / detective / mitigative / recovery / documentation |
| [../templates/runbook.md](../templates/runbook.md) | Runbook template |
| [../templates/incident.md](../templates/incident.md) | Incident record template |
| [../templates/troubleshooting.md](../templates/troubleshooting.md) | Troubleshooting guide |
| [../templates/recovery-procedure.md](../templates/recovery-procedure.md) | Recovery procedure template |

### Change, deploy, recovery

| Document | Purpose |
| --- | --- |
| [../deployment-operations.md](../deployment-operations.md) | Deploy → validate → rollback |
| [../change-management.md](../change-management.md) | Planned vs Emergency |
| [../rollback.md](../rollback.md) | Rollback safety and irreversibility |
| [../operational-state.md](../operational-state.md) | Healthy / Degraded / Unavailable / Recovering / Maintenance / Unknown |
| [../maintenance.md](../maintenance.md) | Planned maintenance |
| [../backup-restore.md](../backup-restore.md) | Backup and restore |
| [../rpo-rto.md](../rpo-rto.md) | RPO vs RTO |
| [../disaster-recovery.md](../disaster-recovery.md) | Disaster recovery |

### Readiness, testing, quality

| Document | Purpose |
| --- | --- |
| [../operational-readiness.md](../operational-readiness.md) | Readiness concept |
| [../operational-readiness-checklist.md](../operational-readiness-checklist.md) | Launch / operability checklist |
| [../reliability-testing.md](../reliability-testing.md) | Conceptual reliability test strategies |
| [../game-days.md](../game-days.md) | Game days (optional for small projects) |
| [../operational-drift.md](../operational-drift.md) | Ops docs ≠ actual operations |
| [../reliability-debt.md](../reliability-debt.md) | Reliability debt register |
| [../operational-metrics.md](../operational-metrics.md) | Operational metric purposes |
| [../reliability-metrics.md](../reliability-metrics.md) | MTTD / MTTR / MTBF |
| [../operations-checklist.md](../operations-checklist.md) | Ops documentation quality checklist |

## Templates (quick list)

| Template | Use for |
| --- | --- |
| [service-profile.md](../templates/service-profile.md) | Service operational profile |
| [runbook.md](../templates/runbook.md) | Operational procedure |
| [troubleshooting.md](../templates/troubleshooting.md) | Diagnostic index |
| [observability.md](../templates/observability.md) | Signals, alerts, health |
| [sli.md](../templates/sli.md) / [slo.md](../templates/slo.md) | Service levels |
| [failure-mode.md](../templates/failure-mode.md) | Single failure mode |
| [capacity-limit.md](../templates/capacity-limit.md) | Capacity limit |
| [alert.md](../templates/alert.md) | Single alert |
| [incident.md](../templates/incident.md) | Incident record |
| [recovery-procedure.md](../templates/recovery-procedure.md) | Restore / recovery procedure |

## Related

- [../quality-model.md](../quality-model.md) — operability dimensions
- [../ai-documentation.md](../ai-documentation.md) — AI operations / reliability / runbook rules
- [../standards.md](../standards.md) — ops naming conventions
