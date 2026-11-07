---
title: "Contrato: inventory.adjusted (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
contract_type: "Event"
producer: "inventory-write"
consumer: "inventory-projector"
contract_id: "inventory.adjusted@v1"
---

# Contrato: inventory.adjusted

> Language: pt-BR | [English](../en/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: inventory.adjusted@v1
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Publicar um fato quando a quantidade de inventário muda no modelo de escrita para que consumers atualizem projeções.

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Payload do evento, expectativas de entrega, tratamento pelo consumer | Como o modelo de escrita calcula a quantidade |
| Versionamento por SKU | Apresentação de UI ou relatórios |

## Participantes

| Participante | Papel | Notas | Classification |
| --- | --- | --- | --- |
| inventory-write | producer | Publica o evento | Confirmed (example) |
| inventory-projector | consumer | Aplica na store de projeção | Confirmed (example) |

## Producer

| Campo | Valor | Classification |
| --- | --- | --- |
| System / component | inventory-write (ficcional) | Confirmed (example) |
| Team / owner | example-team | Confirmed (example) |
| Evidence | exemplo ficcional | Confirmed (example) |

## Consumer

| Consumer | Notas | Classification |
| --- | --- | --- |
| inventory-projector (ficcional) | Atualiza a store de projeção | Confirmed (example) |

## Tipo de contrato

- [ ] API
- [x] Event
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
| Protocol | Tópico/stream de event bus (agnóstico de tecnologia) | Confirmed (example) |
| Interaction style | fire-and-forget (com premissa de entrega at-least-once) | Confirmed (example) |

## Endpoint / Canal / Interface

| Campo | Valor | Classification |
| --- | --- | --- |
| Locator | tópico/stream `inventory.adjusted` (lógico) | Confirmed (example) |
| Method / operation / verb | Not Applicable | Confirmed (example) |
| Notes | Nome do binding é específico do projeto | Confirmed (example) |

## Request / Input

| Campo / parte | Tipo | Obrigatório | Descrição | Classification |
| --- | --- | --- | --- | --- |
| event_id | string | sim | Identificador único do evento | Confirmed (example) |
| sku | string | sim | Identificador do item | Confirmed (example) |
| quantity_delta | integer | sim | Ajuste com sinal | Confirmed (example) |
| occurred_at | string (ISO 8601) | sim | Horário do evento | Confirmed (example) |
| version | integer | sim | Versão monotônica por SKU | Confirmed (example) |

## Response / Output

| Campo / parte | Tipo | Obrigatório | Descrição | Classification |
| --- | --- | --- | --- | --- |
| n/a | — | — | Fire-and-forget; sem payload de resposta | Confirmed (example) |

## Schema

```text
inventory.adjusted.v1:
  event_id: string
  sku: string
  quantity_delta: integer
  occurred_at: string
  version: integer
```

| Tópico | Valor | Classification |
| --- | --- | --- |
| Schema location | embutido neste documento (exemplo) | Confirmed (example) |
| Schema format | schema textual ilustrativo | Confirmed (example) |

## Semântica

| Conceito | Significado | Side effects | Classification |
| --- | --- | --- | --- |
| `quantity_delta` | Mudança com sinal; negativo = diminuição | A projeção deve aplicar o delta, não substituir estoque absoluto salvo documentação em contrário | Confirmed (example) |
| `version` | Monotônica por SKU | Consumers detectam gaps/regressões | Confirmed (example) |

## Autenticação

| Mecanismo | Notas | Classification |
| --- | --- | --- |
| Credenciais do bus | Documentadas só por nome/fonte | Confirmed (example) |

## Autorização

| Regra | Notas | Classification |
| --- | --- | --- |
| Produce ACL | Apenas inventory-write pode publicar | Confirmed (example) |
| Consume ACL | Projector pode assinar | Confirmed (example) |

## Validação

| Regra | Onde aplica | Notas | Classification |
| --- | --- | --- | --- |
| Conformidade com schema | consumer | `schema_invalid` → dead-letter | Confirmed (example) |
| Versão sem regressão | consumer | tratamento de `apply_conflict` | Confirmed (example) |

## Erros

| Erro / Condição | Retryable | Ação do consumer | Classification |
| --- | --- | --- | --- |
| `schema_invalid` | não | Dead-letter; alertar owners do producer | Confirmed (example) |
| `apply_conflict` | não | Ignorar ou dead-letter conforme política | Confirmed (example) |
| falha transitória de store | sim | Retry com backoff | Confirmed (example) |

## Comportamento de retry

| Tópico | Valor | Classification |
| --- | --- | --- |
| Retryable conditions | falhas transitórias de store | Confirmed (example) |
| Max attempts | 5 | Confirmed (example) |
| Backoff | exponential with jitter | Confirmed (example) |
| Non-retryable conditions | `schema_invalid`, regressão de versão | Confirmed (example) |

## Timeout

| Timeout | Valor | Classification |
| --- | --- | --- |
| Consumer processing timeout | 30s | Confirmed (example) |
| Other | timeout de resposta N/A para evento | Confirmed (example) |

## Idempotência

| Tópico | Valor | Classification |
| --- | --- | --- |
| Idempotent | sim | Confirmed (example) |
| Idempotency key / strategy | `event_id` + checagens de `version` por SKU | Confirmed (example) |

## Ordenação

| Tópico | Valor | Classification |
| --- | --- | --- |
| Ordering guarantee | per-key (`sku`) | Confirmed (example) |
| Notes | Ordem global entre SKUs não garantida | Confirmed (example) |

## Semântica de entrega

| Tópico | Valor | Classification |
| --- | --- | --- |
| Delivery guarantee | at-least-once | Confirmed (example) |
| Acknowledgement model | ack do consumer após apply durável | Confirmed (example) |
| Notes | Duplicatas esperadas; idempotência obrigatória | Confirmed (example) |

## Versionamento

| Tópico | Valor | Classification |
| --- | --- | --- |
| Current version | v1 | Confirmed (example) |
| Version strategy | campos opcionais aditivos preferidos | Confirmed (example) |
| Deprecation policy | dual-publish durante migração | Confirmed (example) |
| Contract ID | inventory.adjusted@v1 | Confirmed (example) |

## Compatibilidade

| Tipo de mudança | Compatível? | Notas |
| --- | --- | --- |
| Campo opcional aditivo | sim | Consumers ignoram campos desconhecidos |
| Remoção de campo | não | Exige nova versão |
| Mudança de tipo | não | Exige nova versão |
| Mudança semântica | não | Exige nova versão |

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
# Tratamento no consumer (não é resposta do bus):
# schema_invalid → dead-letter + alerta
```

## Componentes relacionados

| Componente | Relação | Path / ID |
| --- | --- | --- |
| inventory-write | producer | ficcional |
| inventory-projector | consumer | ficcional |

## Arquitetura relacionada

| Documento | Path |
| --- | --- |
| Architecture overview | Not Applicable (exemplo de contrato autônomo) |
| Metodologia | [docs/pt-BR/event-contracts.md](../../../../docs/pt-BR/event-contracts.md) |
