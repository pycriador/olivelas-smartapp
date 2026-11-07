---
title: "Contrato: catalog.price-batch (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
contract_type: "File"
producer: "pricing-exporter"
consumer: "catalog-importer"
contract_id: "catalog.price-batch@v1"
---

# Contrato: catalog.price-batch

> Language: pt-BR | [English](../en/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: catalog.price-batch@v1
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Definir a troca de arquivo em lote para atualizações de preço de catálogo entre exporter e importer. O formato é **genérico** — o projeto escolhe o encoding concreto.

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Padrão de nome de arquivo, campos de registro, validação, falhas | Regras de cálculo de preço |
| Acordo de local de entrega | APIs de preço em tempo real |

## Participantes

| Participante | Papel | Notas | Classification |
| --- | --- | --- | --- |
| pricing-exporter | producer | Escreve/publica o arquivo em lote | Confirmed (example) |
| catalog-importer | consumer | Lê/importa o arquivo em lote | Confirmed (example) |

## Producer

| Campo | Valor | Classification |
| --- | --- | --- |
| System / component | pricing-exporter (ficcional) | Confirmed (example) |
| Team / owner | example-team | Confirmed (example) |
| Evidence | exemplo ficcional | Confirmed (example) |

## Consumer

| Consumer | Notas | Classification |
| --- | --- | --- |
| catalog-importer (ficcional) | Carrega preços no catálogo | Confirmed (example) |

## Tipo de contrato

- [ ] API
- [ ] Event
- [ ] Message
- [x] File
- [ ] Command
- [ ] Callback
- [ ] Library
- [ ] Data
- [ ] Integration
- [ ] Other:

## Protocolo

| Campo | Valor | Classification |
| --- | --- | --- |
| Protocol | Drop de arquivo / objeto (agnóstico de tecnologia) | Confirmed (example) |
| Interaction style | batch | Confirmed (example) |

## Endpoint / Canal / Interface

| Campo | Valor | Classification |
| --- | --- | --- |
| Locator | path / prefixo lógico `catalog/prices/` | Confirmed (example) |
| Method / operation / verb | Not Applicable | Confirmed (example) |
| Notes | Padrão de nome: `prices_YYYYMMDD_HHMM_<seq>.batch` | Confirmed (example) |

## Request / Input

| Campo / parte | Tipo | Obrigatório | Descrição | Classification |
| --- | --- | --- | --- | --- |
| file header: `batch_id` | string | sim | Identificador único do lote | Confirmed (example) |
| file header: `generated_at` | string (ISO 8601) | sim | Horário de geração | Confirmed (example) |
| file header: `schema_version` | string | sim | ex.: `v1` | Confirmed (example) |
| record: `sku` | string | sim | Identificador do item | Confirmed (example) |
| record: `unit_price` | decimal string | sim | Valor do preço (ver semântica) | Confirmed (example) |
| record: `currency` | string | sim | Código de moeda estilo ISO | Confirmed (example) |
| record: `effective_from` | string (ISO 8601 date) | sim | Data de vigência | Confirmed (example) |

## Response / Output

| Campo / parte | Tipo | Obrigatório | Descrição | Classification |
| --- | --- | --- | --- | --- |
| resultado da importação (canal paralelo) | — | — | Sucesso/falha via sinal operacional ou arquivo de recibo, se usado | Confirmed (example) |

## Schema

```text
catalog.price-batch.v1:
  header:
    batch_id: string
    generated_at: string
    schema_version: "v1"
  records[]:
    sku: string
    unit_price: decimal-string
    currency: string
    effective_from: date
```

| Tópico | Valor | Classification |
| --- | --- | --- |
| Schema location | embutido neste documento (exemplo) | Confirmed (example) |
| Schema format | modelo de campos agnóstico de formato (CSV/JSON/Parquet/etc. escolhido pelo projeto) | Confirmed (example) |

## Semântica

| Conceito | Significado | Side effects | Classification |
| --- | --- | --- | --- |
| `unit_price` | Unidades principais da moeda como decimal string (ex.: `"19.90"`) | Importer não deve reinterpretar como centavos | Confirmed (example) |
| Replace total vs upsert | Upsert por `sku` neste contrato | SKUs ausentes no arquivo não são apagados | Confirmed (example) |

## Autenticação

| Mecanismo | Notas | Classification |
| --- | --- | --- |
| Credenciais de storage | Documentadas só por nome/fonte | Confirmed (example) |

## Autorização

| Regra | Notas | Classification |
| --- | --- | --- |
| Write ACL | Apenas pricing-exporter pode publicar no local de drop | Confirmed (example) |
| Read ACL | Apenas catalog-importer pode consumir | Confirmed (example) |

## Validação

| Regra | Onde aplica | Notas | Classification |
| --- | --- | --- | --- |
| Header completo | consumer | Rejeitar arquivo inteiro → quarentena | Confirmed (example) |
| Campos obrigatórios do registro | consumer | Quarentena de registros ou do arquivo conforme política | Confirmed (example) |
| `schema_version` suportada | consumer | Rejeitar versões não suportadas | Confirmed (example) |

## Erros

| Erro / Condição | Retryable | Ação do consumer | Classification |
| --- | --- | --- | --- |
| `file_incomplete` | sim (aguardar/retry fetch) | Não importar parcialmente | Confirmed (example) |
| `schema_unsupported` | não | Quarentena; alertar producer | Confirmed (example) |
| `record_invalid` | não | Quarentena do registro ou arquivo; sem skip silencioso sem política | Confirmed (example) |
| `storage_unavailable` | sim | Retry com backoff | Confirmed (example) |

## Comportamento de retry

| Tópico | Valor | Classification |
| --- | --- | --- |
| Retryable conditions | `file_incomplete`, `storage_unavailable` | Confirmed (example) |
| Max attempts | 5 | Confirmed (example) |
| Backoff | exponential | Confirmed (example) |
| Non-retryable conditions | `schema_unsupported`, payload corrompido | Confirmed (example) |

## Timeout

| Timeout | Valor | Classification |
| --- | --- | --- |
| Business deadline | arquivo esperado até 06:00 local (ilustrativo) | Confirmed (example) |
| Import processing | 30m por lote (ilustrativo) | Confirmed (example) |

## Idempotência

| Tópico | Valor | Classification |
| --- | --- | --- |
| Idempotent | sim | Confirmed (example) |
| Idempotency key / strategy | `batch_id` — reimportar o mesmo lote é no-op ou upsert seguro | Confirmed (example) |

## Ordenação

| Tópico | Valor | Classification |
| --- | --- | --- |
| Ordering guarantee | por `generated_at` / sequência do nome quando há múltiplos arquivos | Confirmed (example) |
| Notes | Aplicar lotes mais antigos antes dos mais novos quando ambos pendentes | Confirmed (example) |

## Semântica de entrega

| Tópico | Valor | Classification |
| --- | --- | --- |
| Delivery guarantee | at-least-once (drops duplicados possíveis) | Confirmed (example) |
| Acknowledgement model | importer move/marca arquivo como processado | Confirmed (example) |
| Notes | Uploads parciais não devem ser importados | Confirmed (example) |

## Versionamento

| Tópico | Valor | Classification |
| --- | --- | --- |
| Current version | v1 (`schema_version`) | Confirmed (example) |
| Version strategy | novo `schema_version` para mudanças breaking de layout | Confirmed (example) |
| Deprecation policy | janela de dual-support por N dias (definida pelo projeto) | Confirmed (example) |
| Contract ID | catalog.price-batch@v1 | Confirmed (example) |

## Compatibilidade

| Tipo de mudança | Compatível? | Notas |
| --- | --- | --- |
| Campo opcional aditivo | sim | Preferir colunas/campos opcionais |
| Remoção de campo | não | Novo `schema_version` |
| Mudança de tipo | não | Novo `schema_version` |
| Mudança semântica | não | Novo `schema_version` (ex.: centavos vs unidades principais) |

## Limites de tamanho

| Limite | Valor | Classification |
| --- | --- | --- |
| Payload / message / file size | máx. ilustrativo 100 MB | Confirmed (example) |
| Other | dividir em múltiplos arquivos sequenciados se maior | Confirmed (example) |

## Exemplos

### Exemplo — sucesso

```text
header:
  batch_id: "batch-20260807-01"
  generated_at: "2026-08-07T05:00:00Z"
  schema_version: "v1"
records:
  - sku: "SKU-42"
    unit_price: "19.90"
    currency: "BRL"
    effective_from: "2026-08-08"
```

### Exemplo — erro

```text
# Upload incompleto detectado (tamanho/marcador ausente)
# → file_incomplete: não importar; retry fetch
```

## Componentes relacionados

| Componente | Relação | Path / ID |
| --- | --- | --- |
| pricing-exporter | producer | ficcional |
| catalog-importer | consumer | ficcional |

## Arquitetura relacionada

| Documento | Path |
| --- | --- |
| Architecture overview | Not Applicable (exemplo de contrato autônomo) |
| Metodologia | [docs/pt-BR/file-contracts.md](../../../../docs/pt-BR/file-contracts.md) |
