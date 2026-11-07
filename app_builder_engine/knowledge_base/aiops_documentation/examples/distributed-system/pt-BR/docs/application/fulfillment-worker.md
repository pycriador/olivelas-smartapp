---
title: "fulfillment-worker (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
---

# fulfillment-worker

> Language: pt-BR | [English](../../../en/docs/application/fulfillment-worker.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Component ID: fulfillment-worker
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Consumir eventos `order.accepted` e avançar o estado de fulfillment sem bloquear a aceitação de pedidos.

## Responsabilidades

| Responsabilidade | Notas |
| --- | --- |
| Consumir eventos de aceitação | Do event-bus |
| Fazer upsert do estado de fulfillment | Applies idempotentes |
| Emitir sinais de progresso | Métricas/logs básicos |

## Não-responsabilidades

| Não-responsabilidade | Owner / elsewhere |
| --- | --- |
| Aceitar novos pedidos | order-api |
| UI de booking de transportadora | Fora do escopo |

## Entradas

| Entrada | Origem | Formato / contrato |
| --- | --- | --- |
| `order.accepted` | event-bus | [../contracts/order-accepted.md](../contracts/order-accepted.md) |

## Saídas

| Saída | Destino | Formato / contrato |
| --- | --- | --- |
| Estado de fulfillment | fulfillment-store | interno |

## Dependências

| Dependência | Propósito | Obrigatória | Classification |
| --- | --- | --- | --- |
| event-bus | Entregar eventos | sim | Confirmed (example) |
| fulfillment-store | Persistir estado | sim | Confirmed (example) |

## Tratamento de falhas

| Falha | Detecção | Resposta | Classification |
| --- | --- | --- | --- |
| Evento poison / inválido | Erro de validação | Dead-letter / alerta (exemplo) | Confirmed (example) |
| Store indisponível | Erros de apply | Retry com backoff | Confirmed (example) |
