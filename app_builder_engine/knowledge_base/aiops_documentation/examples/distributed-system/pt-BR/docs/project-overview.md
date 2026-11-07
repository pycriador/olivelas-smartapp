---
title: "Sistema de Fulfillment de Pedidos (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
---

# Sistema de Fulfillment de Pedidos (Ficcional)

> Language: pt-BR | [English](../../en/docs/project-overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Aceitar pedidos de forma síncrona e realizá-los (fulfillment) de forma assíncrona entre serviços independentes.

## Problema

Clientes precisam de aceitação imediata do pedido, enquanto o fulfillment no lado do warehouse pode demorar e não deve bloquear o caminho de aceitação.

## Escopo

| No escopo | Notas |
| --- | --- |
| API de aceitação de pedidos | Síncrona |
| Publicar `order.accepted` | Handoff assíncrono |
| Worker de fulfillment | Consumir e processar aceitação |

## Não-objetivos

| Não-objetivo | Justificativa |
| --- | --- |
| Processamento de pagamento | Owned elsewhere (ficcional) |
| UI de integração com transportadora | Fora do escopo deste exemplo |

## Usuários / Consumidores

| Usuário / consumidor | Necessidade |
| --- | --- |
| storefront-client (ficcional) | Submeter pedidos e receber IDs de aceitação |
| warehouse-ops tools (ficcional) | Observar progresso do fulfillment (fora deste conjunto de docs) |

## Arquitetura

- Visão geral: Aceitação síncrona em `order-api`, fulfillment assíncrono via event bus e `fulfillment-worker`.
- Detalhes: [architecture/overview.md](architecture/overview.md)
- Fluxo de dados: [architecture/data-flow.md](architecture/data-flow.md)

## Componentes

| Componente | Responsabilidade | Documentação |
| --- | --- | --- |
| order-api | Aceitar pedidos e publicar eventos de aceitação | [application/order-api.md](application/order-api.md) |
| fulfillment-worker | Consumir eventos de aceitação e conduzir o fulfillment | [application/fulfillment-worker.md](application/fulfillment-worker.md) |

## Dependências

| Dependência | Tipo | Propósito | Classification |
| --- | --- | --- | --- |
| order-store | runtime | Persistir pedidos aceitos | Confirmed (example) |
| event-bus | runtime | Entregar `order.accepted` | Confirmed (example) |
| fulfillment-store | runtime | Persistir estado de fulfillment | Confirmed (example) |

## Integrações

| Integração | Direção | Contrato | Documentação |
| --- | --- | --- | --- |
| order.accepted | outbound de order-api / inbound no worker | [contracts/order-accepted.md](contracts/order-accepted.md) | Contrato de evento |

## Segurança

- Limites de confiança: clientes autenticam na borda da API; o canal de eventos usa ACLs do bus (exemplo).
- Authn / Authz: token na API; ACLs de publisher/consumer no bus.
- Detalhes: Unknown além do resumo do exemplo.

## Observabilidade

| Tipo de sinal | Status |
| --- | --- |
| Logging | Implemented |
| Metrics | Implemented |
| Tracing | Partial |

## Ambientes

| Ambiente | Propósito | Notas |
| --- | --- | --- |
| local | testes de desenvolvimento | ficcional |
| staging | validação pré-release | ficcional |
| production | tráfego real | ficcional |

## Limitações conhecidas

| Limitação | Impacto | Classification |
| --- | --- | --- |
| Fulfillment é eventualmente consistente | Aceitação não significa enviado | Confirmed (example) |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Arquitetura | [architecture/overview.md](architecture/overview.md) |
| Fluxo de dados | [architecture/data-flow.md](architecture/data-flow.md) |
| Contrato | [contracts/order-accepted.md](contracts/order-accepted.md) |
| ADR | [decisions/adr-001-async-fulfillment.md](decisions/adr-001-async-fulfillment.md) |
