---
title: "Scheduler — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "APP-NS-SCHED-001"
type: "application"
---

# Scheduler interno (ilustrativo)

> Idioma: pt-BR | [English](../../../en/docs/application/scheduler.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — worker de scheduler in-app compartilhando a imagem da API; não é mandato para evitar CronJobs.

## Responsabilidade

Consultar agendas definidas por grupo e executar pipelines **Drive → analysis → knowledge** sem sessão de browser. Roda no modo `scheduler-worker` da imagem da API.

## Tipos de job (exemplo)

| Job | Description | Classification |
| --- | --- | --- |
| Drive folder sync | List/fetch new/changed files | Confirmed (within example) |
| Analysis enqueue | Create analysis jobs for synced files | Confirmed (within example) |
| Knowledge publish | Push completed analyses into `knowledge` | Confirmed (within example) |
| Embedding backfill | Optional vector refresh | Proposed (example only) |

## Notas de desenho

| Topic | Approach | Classification |
| --- | --- | --- |
| Leader election | Single replica or DB lease | Inferred |
| Overlap prevention | Per-group lock | Proposed (example only) |
| vs K8s CronJob | Example prefers in-app for shared domain logic | Proposed (example only) |

## Relacionados

- [document-analysis.md](document-analysis.md)
- [knowledge-platform.md](knowledge-platform.md)
- [../operations/feature-flags.md](../operations/feature-flags.md)
