# ADR-001 — Preferir Request/Response Síncrono para Aceitação

> Language: pt-BR | [English](../../../en/docs/decisions/adr-001-sync-request-response.md)
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

Consumidores precisam de uma forma simples de submeter solicitações de notificação e saber se a solicitação foi aceita.

## Problema

A aceitação de notificação deve ser exposta como uma API síncrona ou como uma interface assíncrona de comando/evento?

## Decisão

Usar um contrato síncrono de request/response para aceitação. O ciclo de vida da entrega permanece fora deste serviço.

## Alternativas consideradas

| Alternativa | Prós | Contras | Por que não foi escolhida |
| --- | --- | --- | --- |
| Apenas fila de comando async | Desacopla picos | Feedback imediato mais difícil | Consumidores precisam do ID de aceitação imediato |
| APIs dual sync+async | Flexibilidade | Maior complexidade | Desnecessário para o escopo atual |

## Consequências

| Positivas | Negativas | Neutras |
| --- | --- | --- |
| Integração simples do consumidor | Aceitação pode ser confundida com entrega | Entrega rastreada em outro lugar |

## Riscos

| Risco | Mitigação | Classification |
| --- | --- | --- |
| Consumidores assumem sucesso de entrega | Documentar semântica no contrato | Confirmed (example) |

## Decisões relacionadas

| ADR | Relação |
| --- | --- |
| — | none yet |

## Referências

| Referência | Local |
| --- | --- |
| Architecture doc | [../architecture/overview.md](../architecture/overview.md) |
| Contract | [../contracts/send-notification.md](../contracts/send-notification.md) |
