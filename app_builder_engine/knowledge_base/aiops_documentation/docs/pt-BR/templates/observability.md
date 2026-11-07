---
title: "Observabilidade"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
---

# Observabilidade

> Language: pt-BR | [English (EN)](../../en/templates/observability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Template de preenchimento do projeto. Metodologia: observability-model.md, health-checks.md, monitoring.md, alerting.md, service-levels.md. -->

Marque cada mecanismo com um de:

| Status | Significado |
| --- | --- |
| Implemented | Existe e é utilizado |
| Partial | Existe com lacunas conhecidas |
| Not Applicable | Intencionalmente não usado |
| Not Documented | Pode existir, mas ainda não está documentado / Unknown |

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| | |

## Logging

| Campo | Valor |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |
| O que é registrado | |
| O que não deve ser registrado | <!-- segredos, PII desnecessária --> |
| Identificadores de correlação | |
| Evidência | |

## Métricas

| Campo | Valor |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |
| Métricas-chave | |
| Evidência | |

| Métrica | Significado | Classificação |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown |

Veja [operational-metrics.md](../operational-metrics.md) para orientação de propósito de métricas.

## Tracing

| Campo | Valor |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |
| Propagação | |
| Evidência | |

## Dashboards

| Campo | Valor |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |

| Dashboard | Propósito | Link / localização |
| --- | --- | --- |
| | | |

## Alertas

| Campo | Valor |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |

| Alerta | Condição | Severidade | Ação / runbook |
| --- | --- | --- | --- |
| | | | |

Metodologia: [alerting.md](../alerting.md). Template de detalhe opcional: [alert.md](alert.md).

## SLOs / SLIs

| Campo | Valor |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |

| SLI | SLO | Janela | Classificação |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown / Proposed |

Metodologia: [service-levels.md](../service-levels.md). Templates: [sli.md](sli.md), [slo.md](slo.md).

## Health checks

| Campo | Valor |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |

| Verificação | Tipo | Esperado | Classificação |
| --- | --- | --- | --- |
| | liveness / readiness / dependency / business / other | | |

Metodologia: [health-checks.md](../health-checks.md).

## Resumo de monitoramento

| O quê | Por quê | Fonte | Frequência | Threshold | Owner | Ação |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

Metodologia: [monitoring.md](../monitoring.md). Visão do modelo: [observability-model.md](../observability-model.md).

## Plataforma organizacional (opcional)

<!-- O padrão NÃO exige vendor. Se a organização recomenda uma plataforma (ex.: Datadog na Olivelas), registre aqui como convenção org — não como requisito do framework. -->

| Campo | Valor |
| --- | --- |
| Plataforma esperada pela org (se houver) | <!-- e.g. Datadog / other / None / Unknown --> |
| Status no código deste projeto | Implemented / Partial / Not Applicable / Not Documented / Unknown |
| Gap documentado? | Yes → link knowledge-gaps / No / N/A |
| Notas | <!-- Nunca afirmar que o vendor é exigido pelo Engineering Documentation Standard --> |

Orientações: [observability-platform-notes.md](../observability-platform-notes.md).

## Sinais de troubleshooting

| Sintoma | Sinal a inspecionar | Runbook |
| --- | --- | --- |
| | | |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Modelo de observabilidade | |
| Perfil do serviço | |
| Arquitetura | |
| Operações / runbooks | |
| Segurança | |
| Componentes | |
