---
title: "SheetLedger (Fictional) — Project overview"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# SheetLedger (Ficcional)

> Language: pt-BR | [English](../../en/docs/project-overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / ilustrativo.** Não descreve um projeto real.
>
> A **stack sugerida** neste exemplo é ilustrativa e **não** é o padrão do framework nem o guia definitivo de adoção.

## Propósito

Fornecer um workspace corporativo ficcional para **ingestão, transformação e entrega governada de planilhas**, com UI web e API autenticada no mesmo repositório.

## Problema

Times precisam importar CSV/XLSX, tipar colunas, aplicar regras, exportar outputs, armazenar evidências e conciliar dados — com RBAC e auditoria — sem planilhas ad-hoc desgovernadas.

## Escopo

| No escopo | Notas | Classification |
| --- | --- | --- |
| Projetos (input/output/regras/histórico) | Hub de domínio | Confirmed (within example) |
| Import CSV/XLSX + canônicos | File contract | Confirmed (within example) |
| Storage de evidências (object storage) | Integration | Confirmed (within example) |
| Comparação / conciliação | DataOps | Confirmed (within example) |
| Modos Live e Sandbox | Fronteira de execução | Confirmed (within example) |

## Não-objetivos

| Não-objetivo | Justificativa |
| --- | --- |
| Definir stack obrigatória do padrão | O padrão é agnóstico de tecnologia |
| Microsserviços / brokers | Fora da forma monólito deste exemplo |
| Certificações ou volumes reais | Ficção; Unknown |

## Stack sugerida (ILUSTRATIVA — não normativa)

| Camada | Sugestão ilustrativa | Classification |
| --- | --- | --- |
| Frontend | React + TanStack Start/Router/Query + Vite | Proposed (example only) |
| Backend | Flask + SQLAlchemy | Proposed (example only) |
| DB | PostgreSQL dual-schema `core`/`data` | Proposed (example only) |
| Auth | JWT + API tokens + service accounts | Proposed (example only) |
| Files | Adapter tipo Google Drive; S3 como stub Proposed | Proposed (example only) |
| Runtime API | Gunicorn / container | Proposed (example only) |
| Observabilidade | Health + audit; Datadog opcional em orgs Loft | Proposed (example only) |

> Se o seu projeto usa Kotlin, Node, PHP legado ou outra stack Loft: **ignore esta tabela** e documente a stack real com Classification correta.

## Arquitetura

- Detalhes: [architecture/overview.md](architecture/overview.md)
- Contexto: [architecture/system-context.md](architecture/system-context.md)

## Componentes

| Componente | Responsabilidade | Doc |
| --- | --- | --- |
| frontend-app | UI, rotas, Live/Sandbox | [application/frontend-app.md](application/frontend-app.md) |
| backend-api | HTTP API, auth, health | [application/backend-api.md](application/backend-api.md) |
| project-pipeline | Import/export/regras | [application/project-pipeline.md](application/project-pipeline.md) |
| storage-and-files | Evidências | [application/storage-and-files.md](application/storage-and-files.md) |
| data-ops | Comparação/conciliação | [application/data-ops.md](application/data-ops.md) |
| catalog-and-people | Catálogo / people | [application/catalog-and-people.md](application/catalog-and-people.md) |
| sandbox-live | Fronteira de modos | [application/sandbox-live.md](application/sandbox-live.md) |

## Segurança / Ops / Gaps

- [security/overview.md](security/overview.md)
- [operations/service-profile.md](operations/service-profile.md)
- [knowledge-gaps.md](knowledge-gaps.md)
