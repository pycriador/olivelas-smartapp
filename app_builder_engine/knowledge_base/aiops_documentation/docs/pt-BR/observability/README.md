# Observability

> Language: pt-BR | [English (EN)](../../en/observability/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Categoria para documentação de observabilidade em projetos em adoção.

## Objetivo

Descrever logs, métricas, tracing, eventos, dashboards, alertas, SLOs/SLIs e health checks quando aplicável.

## Orientação

- Nem todo projeto tem todo tipo de sinal.
- Marque cada mecanismo como Implemented, Partial, Not Applicable ou Not Documented.
- Não invente SLOs, dashboards ou alertas.
- Linke runbooks operacionais que consomem esses sinais.

## Metodologia

| Documento | Propósito |
| --- | --- |
| [../observability-model.md](../observability-model.md) | Metrics / logs / traces / events / health signals |
| [../health-checks.md](../health-checks.md) | Liveness / readiness / dependency / business health |
| [../monitoring.md](../monitoring.md) | What / why / source / frequency / threshold / owner / action |
| [../alerting.md](../alerting.md) | Alertas acionáveis; Condition → Alert → Owner → Action → Escalation |
| [../service-levels.md](../service-levels.md) | SLI → SLO → SLA |
| [../error-budget.md](../error-budget.md) | Error budget quando SLOs são usados |
| [../operational-metrics.md](../operational-metrics.md) | Propósito das métricas operacionais comuns |
| [../reliability-metrics.md](../reliability-metrics.md) | MTTD / MTTR / MTBF |

## Templates

| Template | Uso |
| --- | --- |
| [../templates/observability.md](../templates/observability.md) | Inventário de observabilidade do projeto |
| [../templates/sli.md](../templates/sli.md) | Um SLI |
| [../templates/slo.md](../templates/slo.md) | Um SLO (+ Error Budget) |
| [../templates/alert.md](../templates/alert.md) | Um alerta |

## Relacionados

- [../operations/README.md](../operations/README.md) — índice completo de operations
- [../operations-model.md](../operations-model.md) — estágios Observe / Detect
- [../templates/runbook.md](../templates/runbook.md) — procedimentos dirigidos por sinais
