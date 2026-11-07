# ADR-001 — Usar Projeção Assíncrona para Leituras de Inventário

> Language: pt-BR | [English](../../../en/docs/decisions/adr-001-async-projection.md)
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

Consumidores do lado de leitura precisam de visões de inventário, mas acoplar cada leitura ao write model cria acoplamento de carga e disponibilidade.

## Problema

Os read models de inventário devem ser atualizados de forma síncrona no write path ou projetados de forma assíncrona a partir de eventos de domínio?

## Decisão

Publicar eventos `inventory.adjusted` e manter o estado de leitura de inventário por meio de um projector assíncrono.

## Alternativas consideradas

| Alternativa | Prós | Contras | Por que não foi escolhida |
| --- | --- | --- | --- |
| Atualização síncrona no write path | Maior imediatismo | Acopla disponibilidade do write ao read store | Rejeitada pelos objetivos de isolamento |
| Join em tempo de request entre sistemas | Sem projector | Maior latência/complexidade de leitura | Rejeitada para as necessidades atuais |

## Consequências

| Positivas | Negativas | Neutras |
| --- | --- | --- |
| Isolamento do write path | Consistência eventual | Exige consumers idempotentes |

## Riscos

| Risco | Mitigação | Classification |
| --- | --- | --- |
| Leitores observam dados desatualizados | Documentar expectativas de freshness; monitorar lag | Confirmed (example) |
| Eventos duplicados | Apply idempotente por event_id/version | Confirmed (example) |

## Decisões relacionadas

| ADR | Relação |
| --- | --- |
| — | none yet |

## Referências

| Referência | Local |
| --- | --- |
| Architecture doc | [../architecture/overview.md](../architecture/overview.md) |
| Contract | [../contracts/inventory-adjusted.md](../contracts/inventory-adjusted.md) |
| Integration | [../application/integration-inventory-adjusted.md](../application/integration-inventory-adjusted.md) |
