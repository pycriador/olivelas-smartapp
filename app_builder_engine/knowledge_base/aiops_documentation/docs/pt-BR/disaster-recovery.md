# Recuperação de Desastres

> Language: pt-BR | [English](../en/disaster-recovery.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar disaster recovery (DR) quando o projeto tem — ou deliberadamente não tem — uma postura formal de DR.

DR trata de recuperar **perda severa de capacidade ou site** (falha de região, perda catastrófica de dados, outage prolongado), não mitigation de incidente de rotina. Recovery de rotina pertence a runbooks e [rollback.md](rollback.md).

## Quando DR formal não está definido

Se o projeto não tem plano, estratégia ou prática de drill formal de DR, declare exatamente:

> Formal Disaster Recovery not defined.

**Não** invente failover multi-região, sites secundários ou metas de RTO para preencher o template. Prefira honestidade a teatro.

## O que documentar quando DR existe

| Topic | Question |
| --- | --- |
| Scope | Quais capacidades / dados estão no escopo? |
| Threats covered | Perda de site, perda de datastore, ransomware, outage prolongado de dependência — conforme realmente planejado |
| Strategy | Active-active, active-passive, rebuild-from-backup, rebuild manual, other |
| Dependencies | O que deve estar disponível para o recovery ter sucesso |
| Roles | Quem declara DR, quem executa, quem comunica — [operational-ownership.md](operational-ownership.md) |
| Runbooks / procedures | Links para procedimentos de recovery |
| Validation | Como o sucesso do recovery é verificado |
| RPO / RTO | Link [rpo-rto.md](rpo-rto.md); marque **Not Defined** se desconhecido |
| Backups | Link [backup-restore.md](backup-restore.md) |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Progressive Disclosure

| Project size | Expectation |
| --- | --- |
| Small / non-critical | Declaração explícita de N/A basta |
| Medium | Documente o caminho real de backup/rebuild; evite claims falsos de multi-site |
| Large / critical | Estratégia formal, owners, drills ou game days quando praticados |

## Anti-padrões

- Afirmar cobertura de DR sem caminho de recovery testado.
- Copiar “best practice” de vendor cloud como política Confirmed do projeto.
- Tratar todo outage como evento de DR (dilui o termo).

## Documentos relacionados

- [backup-restore.md](backup-restore.md)
- [rpo-rto.md](rpo-rto.md)
- [reliability-model.md](reliability-model.md)
- [incident-management.md](incident-management.md)
- [templates/recovery-procedure.md](templates/recovery-procedure.md)
- [operations-model.md](operations-model.md)
