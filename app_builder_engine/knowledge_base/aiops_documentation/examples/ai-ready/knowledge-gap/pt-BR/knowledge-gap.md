---
title: "Knowledge Gap: retenção da DLQ do notify-bridge (Ficcional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "GAP-NB-001"
type: "Evidence"
---

# Knowledge Gap

> Language: pt-BR | [English](../en/knowledge-gap.md)
>
> **Exemplo ficcional — não é um projeto real.**

## ID

| Field | Value |
| --- | --- |
| Gap ID | GAP-NB-001 |
| Status | Open |
| Owner | example-platform-team |
| Priority | Medium |

## Gap

| Field | Value |
| --- | --- |
| Kind | Unknown |
| Topic | Retenção da dead-letter queue |
| Question that cannot be answered safely | Por quanto tempo entregas esgotadas do notify-bridge ficam retidas na DLQ? |

## Context

| Field | Value |
| --- | --- |
| Document / component / system | CMP-NB-001 / notify-bridge |
| Blocking for | AI answer / Operations |
| Related claims | CLAIM-NB-001 (retries conhecidos; retenção não) |

## What Was Checked

| Source | Result |
| --- | --- |
| Code / config | Incomplete — nenhuma constante de retenção nos caminhos da amostra |
| Ops docs | Not found |
| People | Not checked |

## Assumption (if Kind = Assumed)

| Field | Value |
| --- | --- |
| Assumption statement | — |
| Risk if wrong | — |
| Must verify by | — |

## Closure Criteria

Config ou política de broker autoritativa documentando a duração de retenção, citada de caminho ou ticket durável; atualizar seção Data de CMP-NB-001.

## Resolution

| Field | Value |
| --- | --- |
| Outcome | |
| Closed on | |
| Resulting docs / claims | |
