# Contrato: send-notification

> Language: pt-BR | [English](../../../en/docs/contracts/send-notification.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: send-notification@v1
>
> **Exemplo ficcional — não é um projeto real.**

## Visão geral

Contrato síncrono para aceitar uma solicitação de notificação e retornar um ID de aceitação.

## Producer

| Campo | Valor |
| --- | --- |
| System / component | notification-api |
| Team / owner | example-team |
| Evidence | exemplo ficcional |

## Consumer

| Consumer | Notas |
| --- | --- |
| ordering-system (ficcional) | Envia notificações relacionadas a pedidos |
| support-tooling (ficcional) | Disparos manuais |

## Tipo

- [x] API
- [ ] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Interface
- [ ] Other:

## Protocolo

| Campo | Valor | Classification |
| --- | --- | --- |
| Protocol | HTTP-like request/response (illustrative) | Confirmed (example) |
| Interaction style | request-response | Confirmed (example) |

## Entrada

| Campo / parte | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| recipient_id | string | yes | Identificador do destinatário |
| channel | string | yes | Chave do canal de notificação |
| template_id | string | yes | Identificador do template |
| attributes | object | no | Atributos do template |

## Saída

| Campo / parte | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| acceptance_id | string | yes | Identificador do acknowledgement |
| status | string | yes | `accepted` |

## Schema

```text
request:
  recipient_id: string
  channel: string
  template_id: string
  attributes?: object

response:
  acceptance_id: string
  status: "accepted"
```

## Autenticação

| Mecanismo | Notas | Classification |
| --- | --- | --- |
| Bearer token | Valor do token nunca documentado | Confirmed (example) |

## Autorização

| Regra | Notas | Classification |
| --- | --- | --- |
| Tenant-scoped send | Consumidor limitado ao próprio tenant | Confirmed (example) |

## Erros

| Erro | Condição | Orientação ao consumidor |
| --- | --- | --- |
| `invalid_request` | Validação do payload falhou | Corrigir request e tentar novamente |
| `unauthorized` | Autenticação falhou | Renovar credenciais |
| `store_unavailable` | Falha de dependência | Retry com backoff |

## Comportamento de retry

| Tópico | Valor | Classification |
| --- | --- | --- |
| Retryable errors | `store_unavailable` | Confirmed (example) |
| Max attempts | 3 | Confirmed (example) |
| Backoff | exponential | Confirmed (example) |

## Timeout

| Timeout | Valor | Classification |
| --- | --- | --- |
| Client / consumer timeout | 3s | Confirmed (example) |
| Server / producer timeout | Unknown | Unknown |

## Idempotência

| Tópico | Valor | Classification |
| --- | --- | --- |
| Idempotent | yes, when `Idempotency-Key` provided | Confirmed (example) |
| Idempotency key / strategy | consumer-provided key | Confirmed (example) |

## Versionamento

| Tópico | Valor |
| --- | --- |
| Current version | v1 |
| Version strategy | additive changes preferred |
| Deprecation policy | announce before removal |

## Compatibilidade

| Tipo de mudança | Compatível? | Notas |
| --- | --- | --- |
| Additive optional field | yes | Preferido |
| Field removal | no | Exige major version |
| Semantic change | no | Exige major version |

## Exemplos

### Exemplo — sucesso

```text
POST /notifications
Idempotency-Key: 9f3c...

{
  "recipient_id": "user-123",
  "channel": "email",
  "template_id": "order-shipped",
  "attributes": { "order_id": "o-1" }
}

→ 200
{
  "acceptance_id": "acc-456",
  "status": "accepted"
}
```

### Exemplo — erro

```text
→ 400
{
  "error": "invalid_request",
  "message": "channel is required"
}
```

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Component | [../application/notification-api.md](../application/notification-api.md) |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| ADR | [../decisions/adr-001-sync-request-response.md](../decisions/adr-001-sync-request-response.md) |
