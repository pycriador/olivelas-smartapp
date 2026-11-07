# Retenção de Dados

> Language: pt-BR | [English](../en/data-retention.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **por quanto tempo os dados são mantidos** e o que acontece depois.

## Regra rígida para unknowns

Quando retention não estiver estabelecida, escreva **Not Defined**. Não invente períodos, legal holds ou SLAs de deletion.

## Propósito

Responder:

> Para cada data set material, por quanto tempo é retido, em quais stores (incluindo backups) e qual é o outcome de deletion ou archival?

## Registro sugerido

| Campo | Significado |
| --- | --- |
| **Data set** | Nome do asset / category |
| **Classification** | Link [security-classification.md](security-classification.md) |
| **Primary store retention** | Duração ou nome da policy — ou **Not Defined** |
| **Backups / replicas** | Retention se diferente — ou Not Defined / Not Applicable |
| **Archives** | Se houver |
| **Deletion / anonymization** | Outcome após retention — ou Not Defined |
| **Owner** | Data owner |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| Data set | Classification | Primary retention | Backups | Deletion / anonymization | Owner | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | Not Defined se desconhecido | | | | |

## Orientação

- Alinhe aos stages Retention e Deletion do lifecycle em [data-security.md](data-security.md).
- Inclua stores derivados (warehouses, search indexes, logs) quando mantiverem os mesmos dados por mais tempo.
- Retention de logs pode ser mais curta ou mais longa que dados de negócio — documente separadamente via [secure-logging.md](secure-logging.md) quando material.
- Linke [backup-restore.md](backup-restore.md) e [rpo-rto.md](rpo-rto.md) para janelas operacionais de backup sem confundir com política de retention de privacy.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Not Defined explicitamente para os dados principais, ou o período real se conhecido |
| Medium | Inventário para sets Confidential/Restricted |
| Large | Backups/replicas/logs destacados; método de deletion |

## Anti-Patterns

- “Retained as long as needed” sem owner ou review.
- Afirmar deletion enquanto backups restauram os dados indefinidamente, sem documentar.
- Copiar tabelas regulatórias de retention sem adoção do projeto.
- Usar períodos Proposed como policy atual.

## Documentos relacionados

- [data-security.md](data-security.md)
- [privacy.md](privacy.md)
- [security-assets.md](security-assets.md)
- [backup-restore.md](backup-restore.md)
- [secure-logging.md](secure-logging.md)
