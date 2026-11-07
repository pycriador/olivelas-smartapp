---
title: "Contrato: notify.send (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
contract_type: "API"
producer: "notify-service"
consumer: "ordering-system"
contract_id: "notify-send-api@v1"
---

# Contrato: notify.send

> Language: pt-BR | [English](../en/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: notify-send-api@v1
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Aceitar uma solicitação de envio de notificação e retornar um identificador de aceitação. Ilustra um contrato no estilo API sem tornar HTTP obrigatório.

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Formato request/response, erros, retry, versionamento | Entrega real aos canais finais (email/SMS/etc.) |
| Aceitação idempotente | Autoria de conteúdo de templates |

## Participantes

| Participante | Papel | Notas | Classification |
| --- | --- | --- | --- |
| notify-service | producer / provider | Aceita solicitações de envio | Confirmed (example) |
| ordering-system | consumer / client | Chamador ficcional | Confirmed (example) |

## Producer

| Campo | Valor | Classification |
| --- | --- | --- |
| System / component | notify-service (ficcional) | Confirmed (example) |
| Team / owner | example-team | Confirmed (example) |
| Evidence | exemplo ficcional | Confirmed (example) |

## Consumer

| Consumer | Notas | Classification |
| --- | --- | --- |
| ordering-system (ficcional) | Notificações do ciclo de pedidos | Confirmed (example) |
| support-tooling (ficcional) | Disparos manuais | Confirmed (example) |

## Tipo de contrato

- [x] API
- [ ] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Callback
- [ ] Library
- [ ] Data
- [ ] Integration
- [ ] Other:

## Protocolo

| Campo | Valor | Classification |
| --- | --- | --- |
| Protocol | Qualquer transporte request-response (RPC, HTTP-like, in-process — não prescrito) | Confirmed (example) |
| Interaction style | request-response | Confirmed (example) |

## Endpoint / Canal / Interface

| Campo | Valor | Classification |
| --- | --- | --- |
| Locator | operação `notify.send` (nome lógico) | Confirmed (example) |
| Method / operation / verb | `send` | Confirmed (example) |
| Notes | Binding de transporte é específico do projeto; não assuma path de URL | Confirmed (example) |

## Request / Input

| Campo / parte | Tipo | Obrigatório | Descrição | Classification |
| --- | --- | --- | --- | --- |
| recipient_id | string | sim | Identificador do destinatário | Confirmed (example) |
| channel | string | sim | Chave do canal (ex.: `email`) | Confirmed (example) |
| template_id | string | sim | Identificador do template | Confirmed (example) |
| attributes | object | não | Atributos do template | Confirmed (example) |
| idempotency_key | string | não | Chave de deduplicação do consumer | Confirmed (example) |

## Response / Output

| Campo / parte | Tipo | Obrigatório | Descrição | Classification |
| --- | --- | --- | --- | --- |
| acceptance_id | string | sim | Identificador de reconhecimento | Confirmed (example) |
| status | string | sim | `accepted` em sucesso | Confirmed (example) |

## Schema

```text
notify.send.request.v1:
  recipient_id: string
  channel: string
  template_id: string
  attributes?: object
  idempotency_key?: string

notify.send.response.v1:
  acceptance_id: string
  status: "accepted"
```

| Tópico | Valor | Classification |
| --- | --- | --- |
| Schema location | embutido neste documento (exemplo) | Confirmed (example) |
| Schema format | schema textual ilustrativo | Confirmed (example) |

## Semântica

| Conceito | Significado | Side effects | Classification |
| --- | --- | --- | --- |
| `accepted` | Solicitação validada e enfileirada para entrega | Pode enfileirar trabalho assíncrono; a entrega em si está fora do escopo | Confirmed (example) |
| `channel` | Chave lógica do canal de entrega | Seleciona regras de roteamento | Confirmed (example) |

## Autenticação

| Mecanismo | Notas | Classification |
| --- | --- | --- |
| Credencial do chamador (definida pelo projeto) | Valores de token/secret nunca documentados | Confirmed (example) |

## Autorização

| Regra | Notas | Classification |
| --- | --- | --- |
| Envio com escopo de tenant | Chamador limitado ao próprio tenant | Confirmed (example) |

## Validação

| Regra | Onde aplica | Notas | Classification |
| --- | --- | --- | --- |
| Campos obrigatórios presentes | producer | Falha com `invalid_request` | Confirmed (example) |
| `channel` / `template_id` conhecidos | producer | Falha com `invalid_request` | Confirmed (example) |

## Erros

| Erro / Condição | Retryable | Ação do consumer | Classification |
| --- | --- | --- | --- |
| `invalid_request` | não | Corrigir payload e reenviar | Confirmed (example) |
| `unauthorized` | não | Renovar credenciais | Confirmed (example) |
| `dependency_unavailable` | sim | Retry com backoff | Confirmed (example) |

## Comportamento de retry

| Tópico | Valor | Classification |
| --- | --- | --- |
| Retryable conditions | `dependency_unavailable` | Confirmed (example) |
| Max attempts | 3 | Confirmed (example) |
| Backoff | exponential | Confirmed (example) |
| Non-retryable conditions | `invalid_request`, `unauthorized` | Confirmed (example) |

## Timeout

| Timeout | Valor | Classification |
| --- | --- | --- |
| Client / consumer timeout | 3s (ilustrativo) | Confirmed (example) |
| Server / producer timeout | Unknown | Unknown |

## Idempotência

| Tópico | Valor | Classification |
| --- | --- | --- |
| Idempotent | sim, quando `idempotency_key` é fornecido | Confirmed (example) |
| Idempotency key / strategy | chave do consumer; mesma chave retorna o mesmo `acceptance_id` | Confirmed (example) |

## Ordenação

| Tópico | Valor | Classification |
| --- | --- | --- |
| Ordering guarantee | none | Confirmed (example) |
| Notes | Envios concorrentes são independentes | Confirmed (example) |

## Semântica de entrega

| Tópico | Valor | Classification |
| --- | --- | --- |
| Delivery guarantee | Not Applicable (apenas aceitação síncrona) | Confirmed (example) |
| Acknowledgement model | payload de resposta = aceitação | Confirmed (example) |
| Notes | Entrega no canal final é preocupação separada | Confirmed (example) |

## Versionamento

| Tópico | Valor | Classification |
| --- | --- | --- |
| Current version | v1 | Confirmed (example) |
| Version strategy | campos opcionais aditivos preferidos | Confirmed (example) |
| Deprecation policy | anunciar antes de remover campo/operação | Confirmed (example) |
| Contract ID | notify-send-api@v1 | Confirmed (example) |

## Compatibilidade

| Tipo de mudança | Compatível? | Notas |
| --- | --- | --- |
| Campo opcional aditivo | sim | Preferido |
| Remoção de campo | não | Exige major version |
| Mudança de tipo | não | Exige major version |
| Mudança semântica | não | Exige major version |

## Exemplos

### Exemplo — sucesso

```text
operation: notify.send
request:
  recipient_id: "user-123"
  channel: "email"
  template_id: "order-shipped"
  attributes: { order_id: "o-1" }
  idempotency_key: "9f3c-demo"

response:
  acceptance_id: "acc-456"
  status: "accepted"
```

### Exemplo — erro

```text
operation: notify.send
error:
  code: "invalid_request"
  message: "channel is required"
```

## Componentes relacionados

| Componente | Relação | Path / ID |
| --- | --- | --- |
| notify-service | producer | ficcional |
| ordering-system | consumer | ficcional |

## Arquitetura relacionada

| Documento | Path |
| --- | --- |
| Architecture overview | Not Applicable (exemplo de contrato autônomo) |
| Metodologia | [docs/pt-BR/api-contracts.md](../../../../docs/pt-BR/api-contracts.md) |
