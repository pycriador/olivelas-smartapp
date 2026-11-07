---
title: "Contract — canonical-ingest (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "Data"
---

# canonical-ingest

> Language: pt-BR | [English](../../../en/docs/contracts/canonical-ingest.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional.** Não é contrato de produção. Stack ilustrativa ≠ padrão.

## Propósito
Mapear headers de planilha para nomes canônicos via aliases e políticas GLOBAL/GROUP.

## Alias V1 ilustrativo
| Alias | Canonical | Classification |
| --- | --- | --- |
| `dataforge_data_date` | `data_date` | Confirmed (within example) |
| `data_date` | `data_date` | Confirmed (within example) |

## Políticas V2
Hierarquia GLOBAL → GROUP override; usuário pode apply/skip no import.

## APIs ilustrativas
Canonical columns, validate import, CRUD de policies, preferências de prompt.

## Relacionados

- [spreadsheet-import.md](spreadsheet-import.md)
- [../application/project-pipeline.md](../application/project-pipeline.md)

