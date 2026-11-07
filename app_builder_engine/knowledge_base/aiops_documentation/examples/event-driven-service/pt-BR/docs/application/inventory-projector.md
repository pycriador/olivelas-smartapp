# inventory-projector

> Language: pt-BR | [English](../../../en/docs/application/inventory-projector.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Component ID: inventory-projector
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Consumir eventos de ajuste de inventário e manter um projection store.

## Responsabilidades

| Responsabilidade | Notas |
| --- | --- |
| Consumir `inventory.adjusted` | Do event-bus |
| Aplicar upserts idempotentes | Com base em event ID / version |
| Emitir métricas de processamento | Contagens de lag e erro |

## Não-responsabilidades

| Não-responsabilidade | Owner / em outro lugar |
| --- | --- |
| Writes autoritativos de inventário | inventory-write |
| Publicação de `inventory.adjusted` | inventory-write |

## Tecnologia

| Preocupação | Escolha | Classification |
| --- | --- | --- |
| Language / runtime | Not specified | Unknown |
| Framework | Not specified | Unknown |
| Datastore | projection-store | Confirmed (example) |
| Messaging | event-bus | Confirmed (example) |

## Entradas

| Entrada | Fonte | Formato / contrato |
| --- | --- | --- |
| inventory.adjusted | event-bus | [../contracts/inventory-adjusted.md](../contracts/inventory-adjusted.md) |

## Saídas

| Saída | Destino | Formato / contrato |
| --- | --- | --- |
| Registro de inventário projetado | projection-store | internal |

## Dependências

| Dependência | Propósito | Obrigatório | Classification |
| --- | --- | --- | --- |
| event-bus | Consumir eventos | yes | Confirmed (example) |
| projection-store | Persistir projeção | yes | Confirmed (example) |

## Interfaces

| Interface | Tipo | Documento de contrato |
| --- | --- | --- |
| inventory.adjusted | Event | [../contracts/inventory-adjusted.md](../contracts/inventory-adjusted.md) |

## Configuração

| Nome | Propósito | Fonte | Obrigatório | Secret |
| --- | --- | --- | --- | --- |
| EVENT_BUS_URL | Referência do endpoint do bus | env | yes | no |
| EVENT_BUS_CREDENTIALS | Referência de material de auth do bus | secret manager | yes | yes |
| PROJECTION_STORE_DSN | Referência de conexão do store | env | yes | yes |

## Segurança

| Tópico | Resumo |
| --- | --- |
| Authentication | Credenciais do bus via referência de secret |
| Authorization | ACL de consumer no canal de eventos |
| Data handling | Não logar payloads completos se atributos sensíveis aparecerem |
| Risks | Eventos poison podem bloquear uma partição/consumer group |

## Observabilidade

| Sinal | Status | Notas |
| --- | --- | --- |
| Logging | Implemented | event_id, sku, result |
| Metrics | Implemented | lag, success, retry, dead-letter |
| Tracing | Partial | spans consume → upsert |

## Tratamento de falhas

| Falha | Detecção | Resposta | Classification |
| --- | --- | --- | --- |
| Falha de apply retentável | metrics/logs | retry com backoff | Confirmed (example) |
| Evento poison | falhas repetidas | dead-letter + alert | Confirmed (example) |

## Considerações operacionais

| Tópico | Notas |
| --- | --- |
| Deployment | Restart rolling do consumer |
| Scaling | Adicionar consumers com cuidado relativo às partições |
| Migration / rollback | Mudanças de schema da projeção precisam de plano de compatibilidade |
| Runbooks | [../operations/troubleshooting.md](../operations/troubleshooting.md) |
