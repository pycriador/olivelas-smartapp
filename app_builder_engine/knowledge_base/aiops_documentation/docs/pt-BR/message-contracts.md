# Contratos de Mensagem

> Language: pt-BR | [English](../en/message-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação para documentar contratos de **mensagem**: unidades discretas de comunicação entre um sender e um receiver.

**Não** assuma que todos os sistemas de messaging compartilham os mesmos mecanismos (acknowledgement, dead-letter, transactions, keys). Documente o que **esta** fronteira realmente oferece.

## Documente quando aplicável

| Topic | Guidance |
| --- | --- |
| Message type | Tipo/nome estável da mensagem |
| Sender | Quem envia |
| Receiver | Quem recebe |
| Payload | Schema do body + semantics |
| Metadata | Headers/attributes que fazem parte do acordo |
| Delivery | [delivery-semantics.md](delivery-semantics.md) |
| Acknowledgement | O que ack/nack significa aqui, se houver |
| Retry | Redelivery e retry do client — [retry-policy.md](retry-policy.md) |
| Dead-letter / failure handling | Para onde vão mensagens poison/falhas, se aplicável |
| Ordering | [ordering.md](ordering.md) |
| Idempotency | [idempotency.md](idempotency.md) |

## Heterogeneidade

| Mechanism | Document only if used |
| --- | --- |
| Ack / nack | Significado de ack de sucesso vs falha |
| Visibility timeout / lock | Comportamento de receive concorrente |
| Dead-letter / poison queue | Condições de entrada e ownership |
| Priority | Se prioridade é honrada |
| TTL / expiry | Tempo de vida da mensagem |
| Transactions / outbox | Afirmações de atomicidade — com evidência |

Se um mecanismo não existir, escreva Not Applicable — não invente features da plataforma.

## Sobreposição com Events e Commands

- Um evento pode ser carregado como mensagem → Event + Message.
- Um comando pode ser carregado como mensagem → Command + Message.
- Declare a intenção primária (fato vs instrução) com clareza.

## Documentos relacionados

- [event-contracts.md](event-contracts.md)
- [delivery-semantics.md](delivery-semantics.md)
- [retry-policy.md](retry-policy.md)
- [idempotency.md](idempotency.md)
- [ordering.md](ordering.md)
