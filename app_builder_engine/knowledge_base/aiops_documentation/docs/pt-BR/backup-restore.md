# Backup e Restore

> Language: pt-BR | [English](../en/backup-restore.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar capacidades de backup e restore sem inventar cobertura que não existe.

## Quando Not Applicable ou Unknown

Se o projeto não tem prática de backup/restore (ou é desconhecida):

| Situation | Statement |
| --- | --- |
| Intencionalmente nenhuma | **Not Applicable** — com motivo curto (ex.: compute efêmero sem estado durável) |
| Unknown | **Not Defined** / Unknown — não invente schedules, retention ou passos de restore |
| Partial | Documente o que existe; marque gaps com honestidade |

Nunca invente frequência de backup, retention, encryption ou runbooks de restore.

## O que documentar quando backups existem

| Topic | Question |
| --- | --- |
| What is backed up | Datastores, object stores, config, referências de secrets (não valores), artifacts |
| What is not | Exclusions explícitas |
| Frequency / trigger | Schedule ou event-driven — conforme realmente configurado |
| Retention | Por quanto tempo as cópias são mantidas |
| Location / isolation | Mesma account/região vs separada — sem inventar isolamento |
| Ownership | Quem é owner da saúde do backup e dos drills de restore |
| Restore procedure | Link de runbook ou [templates/recovery-procedure.md](templates/recovery-procedure.md) |
| Last verified restore | Data / evidência se conhecida; senão Unknown |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Notas de restore

- Restore é uma ação de **recovery**: documente preconditions, validation e se é destrutiva ou irreversível ([rollback.md](rollback.md)).
- Alinhe o RPO reivindicado à cadência real de backup ([rpo-rto.md](rpo-rto.md)).
- Não embuta credenciais ou valores de secret — documente apenas **referências** de secret ([standards.md](standards.md)).

## Tabela de inventário sugerida

| Asset | Backup? | Frequency | Retention | Restore runbook | Last tested | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| | yes / no / N/A | | | | | |

## Documentos relacionados

- [disaster-recovery.md](disaster-recovery.md)
- [rpo-rto.md](rpo-rto.md)
- [operational-readiness.md](operational-readiness.md)
- [runbooks/README.md](runbooks/README.md)
- [templates/recovery-procedure.md](templates/recovery-procedure.md)
