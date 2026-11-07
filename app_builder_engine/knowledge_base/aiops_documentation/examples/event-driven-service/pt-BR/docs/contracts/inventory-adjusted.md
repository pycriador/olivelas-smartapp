# Contrato: inventory.adjusted

> Language: pt-BR | [English](../../../en/docs/contracts/inventory-adjusted.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: inventory.adjusted@v1
>
> **Exemplo ficcional — não é um projeto real.**

## Visão geral

Evento publicado quando a quantidade de inventário muda no write model.

## Producer

| Campo | Valor |
| --- | --- |
| System / component | inventory-write (ficcional) |
| Team / owner | example-team |
| Evidence | exemplo ficcional |

## Consumer

| Consumer | Notas |
| --- | --- |
| inventory-projector | Atualiza o projection store |

## Tipo

- [ ] API
- [x] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Interface
- [ ] Other:

## Protocolo

| Campo | Valor | Classification |
| --- | --- | --- |
| Protocol | Event bus topic/stream (technology-agnostic) | Confirmed (example) |
| Interaction style | fire-and-forget (with at-least-once delivery assumption) | Confirmed (example) |

## Entrada

| Campo / parte | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| event_id | string | yes | Identificador único do evento |
| sku | string | yes | Identificador do item |
| quantity_delta | integer | yes | Ajuste com sinal |
| occurred_at | string (ISO 8601) | yes | Horário do evento |
| version | integer | yes | Versão monotônica por SKU |

## Saída

| Campo / parte | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| n/a | — | — | Evento fire-and-forget; sem payload de resposta |

## Schema

```text
inventory.adjusted.v1:
  event_id: string
  sku: string
  quantity_delta: integer
  occurred_at: string
  version: integer
```

## Autenticação

| Mecanismo | Notas | Classification |
| --- | --- | --- |
| Bus credentials | Documentado apenas por nome/fonte | Confirmed (example) |

## Autorização

| Regra | Notas | Classification |
| --- | --- | --- |
| Produce ACL | Apenas inventory-write pode publicar | Confirmed (example) |
| Consume ACL | Projector pode se inscrever | Confirmed (example) |

## Erros

| Erro | Condição | Orientação ao consumidor |
| --- | --- | --- |
| schema_invalid | Payload não corresponde ao contrato | Dead-letter; alertar owners do producer |
| apply_conflict | Regressão de version | Ignorar ou dead-letter conforme política |

## Comportamento de retry

| Tópico | Valor | Classification |
| --- | --- | --- |
| Retryable errors | falhas transitórias do store | Confirmed (example) |
| Max attempts | 5 | Confirmed (example) |
| Backoff | exponential with jitter | Confirmed (example) |

## Timeout

| Timeout | Valor | Classification |
| --- | --- | --- |
| Consumer processing timeout | 30s | Confirmed (example) |
| Not Applicable | response timeout N/A for event | Confirmed (example) |

## Idempotência

| Tópico | Valor | Classification |
| --- | --- | --- |
| Idempotent | yes | Confirmed (example) |
| Idempotency key / strategy | `event_id` + per-SKU `version` checks | Confirmed (example) |

## Versionamento

| Tópico | Valor |
| --- | --- |
| Current version | v1 |
| Version strategy | additive optional fields preferred |
| Deprecation policy | dual-publish during migration |

## Compatibilidade

| Tipo de mudança | Compatível? | Notas |
| --- | --- | --- |
| Additive optional field | yes | Consumers ignoram campos desconhecidos |
| Field removal | no | Exige nova versão |
| Semantic change | no | Exige nova versão |

## Exemplos

### Exemplo — sucesso

```text
{
  "event_id": "evt-100",
  "sku": "SKU-42",
  "quantity_delta": -2,
  "occurred_at": "2026-08-07T12:00:00Z",
  "version": 17
}
```

### Exemplo — erro

```text
# Consumer-side handling example (not a bus response):
# schema_invalid → dead-letter + alert
```

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Integration | [../application/integration-inventory-adjusted.md](../application/integration-inventory-adjusted.md) |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| ADR | [../decisions/adr-001-async-projection.md](../decisions/adr-001-async-projection.md) |
