# Ordering

> Language: pt-BR | [English](../en/ordering.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar garantias de ordering para mensagens, eventos ou operações relacionadas sob um contrato.

## Modos de ordering

| Mode | Meaning |
| --- | --- |
| **Global order** | Todos os itens são totalmente ordenados no escopo do contrato |
| **Key order** | Ordem preservada por chave de partição |
| **Entity order** | Ordem preservada por entidade de negócio (frequentemente similar a key order; nomeie a entidade) |
| **None / not guaranteed** | Consumers não devem assumir ordem |
| **Parallel processing** | Tratamento concorrente pode reordenar efeitos mesmo se o ingresso tinha ordem |

## Regras

1. **Declare explicitamente quando a ordem não for garantida.** Silêncio não é garantia.
2. Não implique FIFO a partir de "queue" ou "stream" sem evidência do keying real e do modelo de concorrência do consumer.
3. Se producers emitem em ordem mas consumers processam em paralelo, documente que a **ordem dos efeitos pode divergir**.
4. Classifique afirmações (`Confirmed` / `Inferred` / `Unknown`).

## Forma de documentação

| Topic | Value | Classification |
| --- | --- | --- |
| Ordering mode | global / key / entity / none / parallel / … | |
| Ordering key / entity | field or concept, if any | |
| Parallel consumers | yes / no / Unknown | |
| Reordering risk | description | |
| Not Applicable | reason if N/A | |

## Documentos relacionados

- [delivery-semantics.md](delivery-semantics.md)
- [event-contracts.md](event-contracts.md)
- [message-contracts.md](message-contracts.md)
- [idempotency.md](idempotency.md)
