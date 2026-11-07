# Segurança de Dados

> Language: pt-BR | [English](../en/data-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam proteção de dados ao longo do lifecycle.

Data security amarra [security-classification.md](security-classification.md) e [security-assets.md](security-assets.md) a controls de confidentiality, integrity e acesso apropriado. Linke regras no nível de field a [contracts](contract-model.md) em vez de duplicar schemas.

## Cadeia de lifecycle

```text
Collection → Processing → Storage → Transfer → Sharing → Retention → Deletion
```

| Stage | Question | Typical links |
| --- | --- | --- |
| **Collection** | O que entra no sistema, de quem? | Contratos, attack surface, privacy |
| **Processing** | Quem/o quê pode transformá-lo? | Authorization, least privilege |
| **Storage** | Onde descansa, em qual class? | Encryption at rest, assets |
| **Transfer** | Como se move? | Encryption in transit, trust boundaries |
| **Sharing** | Quem fora do component o recebe? | Contratos, terceiros |
| **Retention** | Por quanto tempo é mantido? | [data-retention.md](data-retention.md) — **Not Defined** quando desconhecido |
| **Deletion** | Como é removido ou tornado unavailable? | Retention, corrective controls |

Stages podem ser Not Applicable (ex.: processors efêmeros sem storage).

## Registro sugerido de data set

| Campo | Significado |
| --- | --- |
| **Data set** | Nome / asset id |
| **Classification** | Conforme modelo do projeto |
| **Owner** | Data owner |
| **Collection sources** | Interfaces / contracts |
| **Stores** | Systems nomeados |
| **Transfers / shares** | Boundaries e consumers |
| **Controls summary** | Authz, encryption, masking — links |
| **Retention** | Link ou Not Defined |
| **Deletion** | Resumo do método ou Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| Data set | Classification | Owner | Stores | Transfers | Retention | Deletion | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Integração com contracts

| Concern | Prefer |
| --- | --- |
| Campos sensíveis no wire | Contract canônico + nota de classification |
| Authn/authz para acessar data APIs | Contract + [authentication.md](authentication.md) / [authorization.md](authorization.md) |
| Error payloads vazando dados | Regras de error do contract + [secure-logging.md](secure-logging.md) |

## Integração com arquitetura

Siga dados across [trust-boundaries.md](trust-boundaries.md) e diagramas de component sem colar samples pessoais brutos. Prefira categorias e field names.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Main data classes, onde armazenados, quem pode read/write |
| Medium | Notas de lifecycle + links de contract para interfaces sensíveis |
| Large | Inventário completo com retention/deletion e shares de terceiros |

## Anti-Patterns

- Embutir PII real ou payloads de produção em exemplos.
- Afirmar retention/deletion que é Not Defined como se fosse Confirmed.
- Ignorar analytics replicas e backups como stores.
- Inventar bases legais ou labels regulatórios.

## Documentos relacionados

- [security-classification.md](security-classification.md)
- [privacy.md](privacy.md)
- [data-retention.md](data-retention.md)
- [encryption.md](encryption.md)
- [contract-model.md](contract-model.md)
- [trust-boundaries.md](trust-boundaries.md)
