---
title: "Limite de Capacidade"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
# limit_id: "limit-short-name"
---

# Limite de Capacidade

> Language: pt-BR | [English (EN)](../../en/templates/capacity-limit.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Limite

| Campo | Valor |
| --- | --- |
| Nome | |
| Recurso / dimensão | <!-- concurrency, RPS, storage, queue depth, payload size, … --> |
| Soft limit | |
| Hard limit | |
| Unidade | |
| Classificação | Confirmed / Inferred / Unknown / Proposed |

## Escopo

| Campo | Valor |
| --- | --- |
| Aplica-se a | service / endpoint / tenant / queue / other |
| Ambiente | |

## Comportamento no limite

| Campo | Valor |
| --- | --- |
| O que acontece ao exceder | reject / queue / throttle / degrade / Unknown |
| Efeito visível ao usuário | |
| Failure mode relacionado | |

## Observabilidade

| Métrica / sinal | Indicador de saturação | Alerta |
| --- | --- | --- |
| | | |

## Scaling / mitigação

| Campo | Valor |
| --- | --- |
| Como a capacidade é aumentada | <!-- or Not Applicable / Unknown — do not invent --> |
| Owner | |
| Docs relacionados | |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Política de capacidade | |
| Scaling | |
| Contratos (limites de taxa/tamanho) | |
