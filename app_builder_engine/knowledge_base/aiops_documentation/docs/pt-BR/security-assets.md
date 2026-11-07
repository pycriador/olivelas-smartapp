# Assets de Segurança

> Language: pt-BR | [English](../en/security-assets.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação para construir e manter um **catálogo de assets** para análise de segurança.

Um asset é algo de valor que o sistema cria, armazena, processa ou do qual depende. Catálogos de assets alimentam [threat-modeling.md](threat-modeling.md) e [security-risk-model.md](security-risk-model.md). Mantenha entradas grosseiras o bastante para permanecerem maintíveis.

## Propósito

Responder:

> O que estamos protegendo, onde vive, quem owns e quão sensível é?

## Categorias de asset (exemplos não exaustivos)

| Category | Examples (illustrative) |
| --- | --- |
| **Data** | Customer records, transaction history, configuration, analytics aggregates |
| **Identity** | User accounts, service identities, API clients, operator identities |
| **Credentials** | Secret *names/references*, certificates por identifier — nunca valores |
| **Services / components** | Unidades deployáveis, jobs críticos, planos de admin |
| **Integrity-critical processes** | Workflows de aprovação, posting financeiro, pipelines de deploy |
| **Availability-critical capacity** | Primary serving path, dependência de failover |

Use o vocabulário do projeto. Não invente assets que não existem.

## Campos sugeridos do catálogo

| Campo | Significado |
| --- | --- |
| **ID** | Identificador curto e estável |
| **Name** | Nome legível por humanos |
| **Category** | Data, identity, credential reference, service, process, … |
| **Classification** | Conforme [security-classification.md](security-classification.md) |
| **Owner** | Data ou system owner — [security-ownership.md](security-ownership.md) |
| **Location / store** | Onde reside (sistema nomeado ou classe de path, não secrets) |
| **Interfaces** | Contratos ou components que o tocam |
| **Criticality** | Link [criticality.md](criticality.md) quando útil |
| **Notes** | Ponteiro de retention, trust boundary, itens Unknown |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| ID | Name | Category | Classification | Owner | Location | Interfaces | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Links de arquitetura e contrato

| Concern | Prefer |
| --- | --- |
| Onde o asset fica estruturalmente | Link [architecture-model.md](architecture-model.md) / docs de component |
| Como atravessa boundaries | Link [trust-boundaries.md](trust-boundaries.md), [data-security.md](data-security.md) |
| Sensibilidade no nível de field em uma interface | Link o [contract](contract-model.md) canônico |
| Impacto operacional se perdido | Link [criticality.md](criticality.md), [failure-modes.md](failure-modes.md) |

Prefira links a duplicar schemas ou diagramas.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Liste os poucos assets que importam para o edge e para data at rest |
| Medium | Catálogo com classification e owners |
| Large | IDs, links de interface, review periódico de drift vs arquitetura |

## Anti-Patterns

- Catalogar cada coluna de database como asset separado.
- Registrar valores secretos ou key material “para completeness.”
- Assets sem owner e sem classification.
- Inventar assets para sistemas Proposed como se fossem current.

## Documentos relacionados

- [security-model.md](security-model.md)
- [security-classification.md](security-classification.md)
- [security-ownership.md](security-ownership.md)
- [threat-modeling.md](threat-modeling.md)
- [data-security.md](data-security.md)
- [architecture-model.md](architecture-model.md)
