---
title: "SLO: catalog-lookup-availability (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
slo_id: "slo-catalog-lookup-availability"
---

# Service Level Objective: catalog-lookup-availability

> Language: pt-BR | [English](../en/slo.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> SLO ID: slo-catalog-lookup-availability
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Definir o alvo de confiabilidade de disponibilidade de lookup de catálogo usado pelo example-team para priorizar releases e incidentes.

## Objetivo

| Campo | Valor |
| --- | --- |
| SLI | catalog-lookup-availability (../sli/) |
| Target | 99,5% |
| Janela | 30 dias rolling |
| Escopo | lookups do catalog-service |
| Owner | example-team |
| Classificação | Confirmed (example) |

## Error Budget

| Campo | Valor |
| --- | --- |
| Usado? | sim |
| Definição do budget | 0,5% de lookups sem sucesso na janela |
| Fonte de medição | a mesma do SLI |
| Visibilidade de burn | alertas de burn multi-janela (rápido/lento) |
| Política quando o budget queima / esgota | Congelar releases não críticos; priorizar confiabilidade |
| Owner da política | example-team |

## Ligação com SLA

| Campo | Valor |
| --- | --- |
| SLA formal? | não |
| Notas | Objetivo interno apenas; não é SLA de cliente |

## Alertas e resposta

| Condição | Alerta | Runbook / ação |
| --- | --- | --- |
| Burn rápido do error budget | slo-catalog-fast-burn | rb-catalog-high-error-rate |
| Spike de ratio de erro | catalog-high-error-rate | rb-catalog-high-error-rate |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| SLI | ../sli/ |
| Política de error budget | docs/pt-BR/error-budget.md |
| Processo de incidente | docs/pt-BR/incident-management.md |
| Service profile | ../service-profile/ |
