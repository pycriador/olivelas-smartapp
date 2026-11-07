# Contratos de Evento

> Language: pt-BR | [English](../en/event-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação para documentar contratos de **evento**: fatos sobre algo que **aconteceu**.

## Event vs Command

| | Event | Command |
| --- | --- | --- |
| Nature | Fato passado | Pedido de que algo aconteça |
| Intent | Informar partes interessadas | Instruir um handler |
| Naming | Frequentemente passado (`OrderAccepted`) | Frequentemente imperativo (`AcceptOrder`) |
| Failure meaning | Problemas de emissão/delivery/handling | Handler pode rejeitar o pedido |

Não documente um comando como "evento" porque viaja em um bus. Se o payload pede que trabalho seja feito, trate-o como Command (possivelmente Message + Command).

## Documente quando aplicável

| Topic | Guidance |
| --- | --- |
| Event name | Identificador estável |
| Producer | Quem emite |
| Consumer | Quem trata (liste conhecidos; Unknown se não identificados) |
| Event schema | Campos do payload ([schema-documentation.md](schema-documentation.md)) |
| Event semantics | Qual ocorrência o evento representa |
| Timestamp | Event time vs emission time; premissas de relógio |
| Identifier | Unicidade e estabilidade do event id |
| Correlation | Ligação a uma conversa de negócio/transação |
| Causation | Links à mensagem/evento/comando causador |
| Ordering | [ordering.md](ordering.md) |
| Delivery | [delivery-semantics.md](delivery-semantics.md) |
| Retry | Republish do producer vs retry do consumer — [retry-policy.md](retry-policy.md) |
| Duplication | Expectativas de emissão/delivery duplicada — [idempotency.md](idempotency.md) |
| Versioning | [contract-versioning.md](contract-versioning.md) |

## Barra mínima de clareza

Um contrato de evento deve deixar claro:

1. O que aconteceu (semantics).
2. Quais dados acompanham o fato (schema).
3. O que consumers podem assumir sobre delivery, order e duplicates.
4. Como a versão do evento evolui.

## Documentos relacionados

- [contract-types.md](contract-types.md)
- [message-contracts.md](message-contracts.md)
- [delivery-semantics.md](delivery-semantics.md)
- [ordering.md](ordering.md)
- [semantic-contracts.md](semantic-contracts.md)
