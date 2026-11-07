# Observability

> Language: EN | [Português (pt-BR)](../../pt-BR/observability/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Category for observability documentation in adopting projects.

## Objective

Describe logs, metrics, tracing, events, dashboards, alerts, SLOs/SLIs, and health checks when applicable.

## Guidance

- Not every project has every signal type.
- Mark each mechanism as Implemented, Partial, Not Applicable, or Not Documented.
- Do not invent SLOs, dashboards, or alerts.
- Link to operational runbooks that consume these signals.

## Methodology

| Document | Purpose |
| --- | --- |
| [../observability-model.md](../observability-model.md) | Metrics / logs / traces / events / health signals |
| [../health-checks.md](../health-checks.md) | Liveness / readiness / dependency / business health |
| [../monitoring.md](../monitoring.md) | What / why / source / frequency / threshold / owner / action |
| [../alerting.md](../alerting.md) | Actionable alerts; Condition → Alert → Owner → Action → Escalation |
| [../service-levels.md](../service-levels.md) | SLI → SLO → SLA |
| [../error-budget.md](../error-budget.md) | Error budget when SLOs are used |
| [../operational-metrics.md](../operational-metrics.md) | Purpose of common operational metrics |
| [../reliability-metrics.md](../reliability-metrics.md) | MTTD / MTTR / MTBF |

## Templates

| Template | Use for |
| --- | --- |
| [../templates/observability.md](../templates/observability.md) | Project observability inventory |
| [../templates/sli.md](../templates/sli.md) | Single SLI |
| [../templates/slo.md](../templates/slo.md) | Single SLO (+ Error Budget) |
| [../templates/alert.md](../templates/alert.md) | Single alert |

## Related

- [../operations/README.md](../operations/README.md) — full operations index
- [../operations-model.md](../operations-model.md) — Observe / Detect stages
- [../templates/runbook.md](../templates/runbook.md) — procedures driven by signals
