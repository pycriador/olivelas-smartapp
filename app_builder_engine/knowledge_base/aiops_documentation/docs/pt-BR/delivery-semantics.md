# Semântica de Delivery

> Language: pt-BR | [English](../en/delivery-semantics.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar garantias de delivery e interação de um contrato. Registre a garantia **real** do sistema, não o rótulo de marketing mais forte.

## Modos de delivery

| Mode | Meaning |
| --- | --- |
| **at-most-once** | Uma mensagem/operação é entregue zero ou uma vez; perda é possível |
| **at-least-once** | Entregue uma ou mais vezes; duplicatas são possíveis |
| **exactly-once** | Processada efetivamente uma vez ponta a ponta sob condições declaradas |
| **best effort** | Sem garantia forte de delivery; oportunista |

## Sync e async

| Style | Meaning |
| --- | --- |
| **Synchronous** | O caller espera um resultado dentro da interação |
| **Asynchronous** | O resultado pode chegar depois (event, callback, poll, outbox) |

Um contrato pode combinar estilos (accept sync + completion async). Documente ambas as fases quando esse for o design real.

## Cuidado com exactly-once

**Não** afirme **exactly-once** casualmente.

Deduplicação, chaves únicas ou "at-least-once mais consumer idempotente" podem produzir um resultado de negócio **effectively once** sob condições — isso não é o mesmo que afirmar exactly-once da plataforma sem declarar essas condições.

Ao documentar exactly-once ou effectively-once:

1. Declare o escopo (producer, broker, consumer, end-to-end).
2. Declare as condições e modos de falha.
3. Classifique a afirmação (`Confirmed` apenas com evidência).
4. Se houver dúvida, prefira **at-least-once** + descrição de [idempotency](idempotency.md), ou **Unknown**.

## O que documentar

| Topic | Guidance |
| --- | --- |
| Declared mode | Um dos modos acima, ou termo preciso do projeto mapeado para eles |
| Sync / async | Estilo de interação |
| Duplicate handling | Quem faz dedupe, como |
| Loss handling | O que acontece se a delivery falhar |
| Evidence | Link para código, config da plataforma ou testes |

## Documentos relacionados

- [idempotency.md](idempotency.md)
- [retry-policy.md](retry-policy.md)
- [ordering.md](ordering.md)
- [event-contracts.md](event-contracts.md)
- [message-contracts.md](message-contracts.md)
