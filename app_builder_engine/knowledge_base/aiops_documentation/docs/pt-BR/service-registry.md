# Registry de serviços

> Language: pt-BR | [English](../en/service-registry.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como projetos em adoção inventariam **services** como unidades operáveis.

## Definição de service

Um **service** é uma unidade nomeada executável/operável que o projeto faz deploy, agenda ou de outra forma executa (process, job, function group, edge app). A nomenclatura deve corresponder aos identificadores reais do projeto.

## Component ≠ Service

Veja a comparação em [component-registry.md](component-registry.md). Nunca assuma one-to-one. Sempre documente os mapeamentos.

## Campos mínimos

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | `SVC-XXX` or stable name |
| `name` | Yes | Runtime / deploy name |
| `owner` | Yes | Operational and/or engineering owner |
| `criticality` | Recommended | Per [criticality.md](criticality.md) |
| `components` | Recommended | Component ids implemented |
| `dependencies` | Recommended | Other services / external deps |
| `runbooks` | Recommended | Primary runbook ids |
| `slo` | Optional | Links to SLOs if defined |
| `status` | Yes | Registry entry lifecycle |
| `updated` | Yes | `YYYY-MM-DD` |

## Exemplo

| ID | Name | Owner | Criticality | Components | Updated |
| --- | --- | --- | --- | --- | --- |
| SVC-001 | checkout-api | platform-team | High | CMP-001 | 2026-08-07 |

## Regras

1. Não invente SLOs, owners ou criticality sem evidência/acordo do owner.
2. Alinhe nomes com manifests de deploy quando existirem.
3. Linke docs de ops (relacionamentos `operates`) em vez de duplicar corpos de runbook.

## Documentos relacionados

- [component-registry.md](component-registry.md)
- [operational-ownership.md](operational-ownership.md)
- [dependency-model.md](dependency-model.md)

