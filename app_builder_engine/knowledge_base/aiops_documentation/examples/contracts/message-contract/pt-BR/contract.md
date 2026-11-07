---
title: "Contrato: fulfillment.start (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
contract_type: "Message"
producer: "order-api"
consumer: "fulfillment-worker"
contract_id: "fulfillment.start@v1"
---

# Contrato: fulfillment.start

> Language: pt-BR | [English](../en/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: fulfillment.start@v1
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Instruir o fulfillment worker a iniciar o fulfillment de um pedido aceito. Trata-se de uma **mensagem/comando** (instrução), não de um evento de domínio (fato).

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Payload da mensagem, ack/retry, idempotência | Detalhes de execução no warehouse |
| Acordo sender → receiver | API de aceitação de pedido |

## Participantes

| Participante | Papel | Notas | Classification |
| --- | --- | --- | --- |
| order-api | sender / producer | Emite a mensagem de comando | Confirmed (example) |
| fulfillment-worker | receiver / consumer | Executa o início do fulfillment | Confirmed (example) |

## Producer

| Campo | Valor | Classification |
| --- | --- | --- |
| System / component | order-api (ficcional) | Confirmed (example) |
| Team / owner | example-team | Confirmed (example) |
| Evidence | exemplo ficcional | Confirmed (example) |

## Consumer

| Consumer | Notas | Classification |
| --- | --- | --- |
| fulfillment-worker (ficcional) | Inicia o workflow de fulfillment | Confirmed (example) |

## Tipo de contrato

- [ ] API
- [ ] Event
- [x] Message
- [ ] File
- [x] Command
- [ ] Callback
- [ ] Library
- [ ] Data
- [ ] Integration
- [ ] Other:

Intenção primária: **Command** transportado como **Message**.

## Protocolo

| Campo | Valor | Classification |
| --- | --- | --- |
| Protocol | Fila / canal de mensagens (agnóstico de tecnologia) | Confirmed (example) |
| Interaction style | fire-and-forget com acknowledgement | Confirmed (example) |

## Endpoint / Canal / Interface

| Campo | Valor | Classification |
| --- | --- | --- |
| Locator | fila/canal `fulfillment.commands` (lógico) | Confirmed (example) |
| Method / operation / verb | `start` | Confirmed (example) |
| Notes | Nome do tipo de mensagem: `fulfillment.start` | Confirmed (example) |

## Request / Input

| Campo / parte | Tipo | Obrigatório | Descrição | Classification |
| --- | --- | --- | --- | --- |
| message_id | string | sim | Identificador único da mensagem | Confirmed (example) |
| order_id | string | sim | Pedido a fulfillar | Confirmed (example) |
| warehouse_code | string | sim | Chave do warehouse alvo | Confirmed (example) |
| requested_at | string (ISO 8601) | sim | Horário de emissão do comando | Confirmed (example) |
| correlation_id | string | não | Correlação de trace / saga | Confirmed (example) |

## Response / Output

| Campo / parte | Tipo | Obrigatório | Descrição | Classification |
| --- | --- | --- | --- | --- |
| n/a | — | — | Sem resposta síncrona; ack é no nível do transporte | Confirmed (example) |

## Schema

```text
fulfillment.start.v1:
  message_id: string
  order_id: string
  warehouse_code: string
  requested_at: string
  correlation_id?: string
```

| Tópico | Valor | Classification |
| --- | --- | --- |
| Schema location | embutido neste documento (exemplo) | Confirmed (example) |
| Schema format | schema textual ilustrativo | Confirmed (example) |

## Semântica

| Conceito | Significado | Side effects | Classification |
| --- | --- | --- | --- |
| `fulfillment.start` | Instrução para iniciar fulfillment | Worker pode criar job de fulfillment | Confirmed (example) |
| `message_id` duplicado | Mesma instrução | Não deve criar jobs duplicados | Confirmed (example) |

## Autenticação

| Mecanismo | Notas | Classification |
| --- | --- | --- |
| Credenciais do canal | Documentadas só por nome/fonte | Confirmed (example) |

## Autorização

| Regra | Notas | Classification |
| --- | --- | --- |
| Produce ACL | Apenas order-api pode enviar | Confirmed (example) |
| Consume ACL | Apenas fulfillment-worker pode receber | Confirmed (example) |

## Validação

| Regra | Onde aplica | Notas | Classification |
| --- | --- | --- | --- |
| Campos obrigatórios | consumer | Rejeitar → dead-letter | Confirmed (example) |
| `warehouse_code` conhecido | consumer | Rejeitar → dead-letter | Confirmed (example) |

## Erros

| Erro / Condição | Retryable | Ação do consumer | Classification |
| --- | --- | --- | --- |
| `schema_invalid` | não | Dead-letter; alertar owners do sender | Confirmed (example) |
| `unknown_warehouse` | não | Dead-letter | Confirmed (example) |
| `dependency_unavailable` | sim | Nack / redelivery com backoff | Confirmed (example) |

## Comportamento de retry

| Tópico | Valor | Classification |
| --- | --- | --- |
| Retryable conditions | `dependency_unavailable`, falhas transitórias de lock | Confirmed (example) |
| Max attempts | 5 | Confirmed (example) |
| Backoff | exponential with jitter | Confirmed (example) |
| Non-retryable conditions | `schema_invalid`, `unknown_warehouse` | Confirmed (example) |

## Timeout

| Timeout | Valor | Classification |
| --- | --- | --- |
| Visibility / processing lock | 60s (ilustrativo) | Confirmed (example) |
| Other | Not Applicable se a plataforma não tiver visibility timeout | Confirmed (example) |

## Idempotência

| Tópico | Valor | Classification |
| --- | --- | --- |
| Idempotent | sim | Confirmed (example) |
| Idempotency key / strategy | `message_id` (e/ou unicidade de `order_id` para start) | Confirmed (example) |

## Ordenação

| Tópico | Valor | Classification |
| --- | --- | --- |
| Ordering guarantee | per-key (`order_id`) preferido; não obrigatório globalmente | Confirmed (example) |
| Notes | Processamento paralelo entre pedidos diferentes é permitido | Confirmed (example) |

## Semântica de entrega

| Tópico | Valor | Classification |
| --- | --- | --- |
| Delivery guarantee | at-least-once | Confirmed (example) |
| Acknowledgement model | ack após aceitação durável do comando | Confirmed (example) |
| Notes | Mensagens poison → dead-letter após max attempts | Confirmed (example) |

## Versionamento

| Tópico | Valor | Classification |
| --- | --- | --- |
| Current version | v1 | Confirmed (example) |
| Version strategy | campos opcionais aditivos preferidos | Confirmed (example) |
| Deprecation policy | dual-consume durante migração | Confirmed (example) |
| Contract ID | fulfillment.start@v1 | Confirmed (example) |

## Compatibilidade

| Tipo de mudança | Compatível? | Notas |
| --- | --- | --- |
| Campo opcional aditivo | sim | Preferido |
| Remoção de campo | não | Exige nova versão da mensagem |
| Mudança de tipo | não | Exige nova versão da mensagem |
| Mudança semântica | não | Exige nova versão da mensagem |

## Exemplos

### Exemplo — sucesso

```text
{
  "message_id": "msg-778",
  "order_id": "ord-1001",
  "warehouse_code": "WH-SP-01",
  "requested_at": "2026-08-07T15:30:00Z",
  "correlation_id": "corr-55"
}
# → consumer faz ack após iniciar o job de fulfillment
```

### Exemplo — erro

```text
# Tratamento no consumer:
# unknown_warehouse → dead-letter (sem retry)
```

## Componentes relacionados

| Componente | Relação | Path / ID |
| --- | --- | --- |
| order-api | sender | ficcional |
| fulfillment-worker | receiver | ficcional |

## Arquitetura relacionada

| Documento | Path |
| --- | --- |
| Architecture overview | Not Applicable (exemplo de contrato autônomo) |
| Metodologia | [docs/pt-BR/message-contracts.md](../../../../docs/pt-BR/message-contracts.md) |
