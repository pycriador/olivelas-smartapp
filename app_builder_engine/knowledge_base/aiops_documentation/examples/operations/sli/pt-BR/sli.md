---
title: "SLI: catalog-lookup-availability (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
sli_id: "sli-catalog-lookup-availability"
---

# Service Level Indicator: catalog-lookup-availability

> Language: pt-BR | [English](../en/sli.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> SLI ID: sli-catalog-lookup-availability
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Representar a fração de tentativas de lookup de catálogo que têm sucesso do ponto de vista do chamador.

## Definição

| Campo | Valor |
| --- | --- |
| Nome | catalog-lookup-availability |
| Fórmula / conjunto de eventos | lookups bem-sucedidos / total de tentativas |
| Evento bom | Lookup retorna sucesso dentro do timeout |
| Evento ruim / falha | Timeout, equivalente a 5xx, ou outcome de falha explícito |
| Exclusões | Probes sintéticos marcados como excluídos na medição (se usados) |
| Unidade | ratio |

## Medição

| Campo | Valor |
| --- | --- |
| Fonte | Métricas de outcome de request para catalog.lookup |
| Janela padrão | 30 dias rolling (alinhada ao SLO) |
| Escopo | todos os endpoints / fluxos de lookup do catalog-service |
| Owner | example-team |
| Classificação | Confirmed (example) |

## SLOs relacionados

| SLO | Target | Link |
| --- | --- | --- |
| catalog-lookup-availability-slo | 99,5% | ../slo/ |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Observabilidade | inventário do projeto |
| Política de service levels | docs/pt-BR/service-levels.md |
| Dashboards / metrics | request count, success count (apenas nomes) |
| Service profile | ../service-profile/ |
