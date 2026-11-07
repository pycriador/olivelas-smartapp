---
id: REF-AIOPS-TEAM-010
title: "AIOps — Observabilidade"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Observabilidade

> Language: pt-BR | [English (EN)](../../en/aiops-team/observability.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Práticas de observabilidade do time AIOps. **Pack completo:** [../loft-observability/README.md](../loft-observability/README.md).

## Plataforma

| Sinal | Ferramenta |
| --- | --- |
| Métricas, logs, traces | **Datadog** (padrão Loft) |
| Agent | Disponível nos nodes EKS (`loft-infra-cloud`) |

## Checklist por serviço

1. Chart `web-server` com Datadog habilitado — [../loft-observability/k8s-datadog-enablement.md](../loft-observability/k8s-datadog-enablement.md)
2. Logs JSON estruturados — [../loft-observability/structured-logging.md](../loft-observability/structured-logging.md)
3. APM por stack — [../loft-observability/application-instrumentation.md](../loft-observability/application-instrumentation.md)
4. Verificação pós-deploy — [../loft-observability/verification-checklist.md](../loft-observability/verification-checklist.md)

## Operadores

Guia de uso Datadog: [../loft-observability/datadog-usage-guide.md](../loft-observability/datadog-usage-guide.md).

## Relacionados

- [troubleshooting.md](troubleshooting.md)
- [technical-standards.md](technical-standards.md)
