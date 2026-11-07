# Registry de componentes

> Language: pt-BR | [English](../en/component-registry.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como projetos em adoção mantêm um inventário de **componentes arquiteturais**.

Um **component** é uma unidade de responsabilidade arquitetural (deployable delimitado, package, worker, superfície de UI, etc.). Nem toda classe ou arquivo é um component ([architecture-model.md](architecture-model.md), [component-relationships.md](component-relationships.md)).

## Component ≠ Service

| | Component | Service |
| --- | --- | --- |
| Focus | Responsabilidade / estrutura arquitetural | Unidade operável / executável (frequentemente deployable) |
| Registry | Este documento | [service-registry.md](service-registry.md) |
| Example | `payments-domain` library boundary | `checkout-api` Deployment |

Um service pode implementar um component, ou vários components podem viver em um service — documente o mapeamento explicitamente.

## Campos mínimos

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | `CMP-XXX` or stable name |
| `name` | Yes | Human-readable name |
| `responsibility` | Yes | One short paragraph |
| `owner` | Yes | Team / squad / role |
| `status` | Yes | Lifecycle of the *registry entry* / doc |
| `services` | Recommended | Service ids that realize this component |
| `contracts` | Recommended | Exposed/consumed contract ids |
| `docs` | Recommended | Primary architecture doc links |
| `updated` | Yes | `YYYY-MM-DD` |

## Exemplo

| ID | Name | Responsibility | Owner | Services | Updated |
| --- | --- | --- | --- | --- | --- |
| CMP-001 | checkout-api edge | HTTP entry for checkout commands | platform-team | SVC-001 | 2026-08-07 |

## Regras

1. Não promova arquivos a components automaticamente.
2. Components Unknown descobertos no código → registre como responsabilidade Unknown ou abra documentation debt — não invente propósito.
3. Mantenha o registry Current; mova components removidos para Historical/Deprecated conforme [history-model.md](history-model.md).

## Documentos relacionados

- [service-registry.md](service-registry.md)
- [dependency-model.md](dependency-model.md)
- [architecture-model.md](architecture-model.md)

