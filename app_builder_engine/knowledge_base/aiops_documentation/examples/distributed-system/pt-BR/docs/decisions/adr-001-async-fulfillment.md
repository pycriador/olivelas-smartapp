---
title: "ADR-001 — Usar Fulfillment Assíncrono Após Aceitação do Pedido"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
---

# ADR-001 — Usar Fulfillment Assíncrono Após Aceitação do Pedido

> Language: pt-BR | [English](../../../en/docs/decisions/adr-001-async-fulfillment.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Date: 2026-08-07
> Deciders: example-team
>
> **Exemplo ficcional — não é um projeto real.**

## Status

Accepted

## Date

2026-08-07

## Contexto

A aceitação de pedidos precisa permanecer rápida e confiável para os clientes. O trabalho de fulfillment é mais lento e depende da capacidade do warehouse, que pode falhar de forma independente.

## Problema

O fulfillment deve rodar no mesmo caminho síncrono da aceitação do pedido, ou após um handoff assíncrono?

## Decisão

Aceitar pedidos de forma síncrona em `order-api` e, em seguida, realizar o fulfillment de forma assíncrona via `order.accepted` consumido por `fulfillment-worker`.

## Alternativas consideradas

| Alternativa | Prós | Contras | Por que não escolhida |
| --- | --- | --- | --- |
| Fulfillment sync no caminho de aceitação | Consistência imediata mais forte | Acopla domínios de falha; maior latência | Bloqueia aceitação no caminho do warehouse |
| Banco compartilhado entre API e worker | Leituras simples | Acoplamento forte; ownership pouco claro | Viola metas de limite de serviço |

## Consequências

| Positiva | Negativa | Neutra |
| --- | --- | --- |
| Aceitação permanece disponível se o worker cair | Consistência eventual entre aceitar e fulfill | Contrato de evento vira dependência de primeira classe |

## Riscos

| Risco | Mitigação | Classification |
| --- | --- | --- |
| Eventos duplicados | Applies idempotentes no worker | Confirmed (example) |
| Publish após persist falha | Retry de publish + alerta | Confirmed (example) |

## Componentes afetados

| Componente | Impacto | Documentação |
| --- | --- | --- |
| order-api | Publica eventos após aceitar | [../application/order-api.md](../application/order-api.md) |
| fulfillment-worker | Consome e aplica | [../application/fulfillment-worker.md](../application/fulfillment-worker.md) |

## Contratos afetados

| Contrato | Impacto | Documentação |
| --- | --- | --- |
| order.accepted | Introduzido como handoff | [../contracts/order-accepted.md](../contracts/order-accepted.md) |

## Referências

| Referência | Local |
| --- | --- |
| Arquitetura | [../architecture/overview.md](../architecture/overview.md) |
| Fluxo de dados | [../architecture/data-flow.md](../architecture/data-flow.md) |
