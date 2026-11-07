---
title: "Contrato: order.accepted (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
---

# Contrato: order.accepted

> Language: pt-BR | [English](../../../en/docs/contracts/order-accepted.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: order.accepted@v1
>
> **Exemplo ficcional — não é um projeto real.**

## Visão geral

Evento publicado quando um pedido foi aceito por `order-api` e está pronto para fulfillment assíncrono.

## Producer

| Campo | Valor |
| --- | --- |
| Sistema / componente | order-api |
| Time / owner | example-team |
| Evidence | exemplo ficcional |

## Consumer

| Consumer | Notas |
| --- | --- |
| fulfillment-worker | Inicia / atualiza fulfillment |

## Tipo

- [ ] API
- [x] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Interface
- [ ] Other:

## Protocolo

| Campo | Valor | Classification |
| --- | --- | --- |
| Protocolo | Tópico/stream de event bus (agnóstico de tecnologia) | Confirmed (example) |
| Estilo de interação | fire-and-forget (at-least-once assumido) | Confirmed (example) |

## Entrada

| Campo / parte | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| event_id | string | sim | Identificador único do evento |
| order_id | string | sim | Identificador do pedido aceito |
| customer_id | string | sim | Identificador do cliente |
| accepted_at | string (ISO 8601) | sim | Momento da aceitação |
| line_items | array | sim | Pares SKU + quantidade |

## Saída

| Campo / parte | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| — | — | — | O payload do evento é o corpo do contrato |

## Schema

```text
order.accepted@v1:
  event_id: string
  order_id: string
  customer_id: string
  accepted_at: string
  line_items: [{ sku: string, quantity: integer }]
```

## Comportamento de retry

| Tópico | Valor | Classification |
| --- | --- | --- |
| Entrega | at-least-once | Confirmed (example) |
| Retries do consumer | sim, com backoff | Confirmed (example) |
| Idempotência | por `event_id` / `order_id` | Confirmed (example) |

## Versionamento

| Tópico | Valor |
| --- | --- |
| Versão atual | v1 |
| Estratégia de versão | mudanças aditivas preferidas |
| Política de depreciação | anunciar antes da remoção |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Producer | [../application/order-api.md](../application/order-api.md) |
| Consumer | [../application/fulfillment-worker.md](../application/fulfillment-worker.md) |
| Arquitetura | [../architecture/overview.md](../architecture/overview.md) |
| ADR | [../decisions/adr-001-async-fulfillment.md](../decisions/adr-001-async-fulfillment.md) |
