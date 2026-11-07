# Rollback

> Language: pt-BR | [English](../en/rollback.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar rollback: retorno a um estado known-good anterior após uma mudança ruim ou passo de recovery falho.

## Regras centrais

1. **Rollback nem sempre é seguro.** Algumas mudanças são unidirecionais (migrações de schema, transforms de dados, side effects externos).
2. **Documente irreversibility explicitamente.** Se rollback for impossível ou parcial, diga isso — não implique um undo limpo.
3. **Prefira passos evidenciados no projeto.** Não invente comandos universais de rollback.

## O que documentar

| Topic | Question |
| --- | --- |
| Trigger | Quando rollback deve ser considerado |
| Preconditions | Estado necessário antes do rollback |
| Procedure | Passos ou link para runbook / sistema de deploy |
| Validation | Como confirmar que o estado anterior está healthy |
| Data impact | Perda de dados, resíduo de dual-write, poison messages |
| Irreversible items | O que não pode ser desfeito |
| Escalation | Quando o rollback falha |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Rollback irreversível e parcial

| Situation | Documentation stance |
| --- | --- |
| Release totalmente reversível | Documente caminho de undo e validation |
| Parcialmente reversível | Liste o que volta vs o que permanece |
| Irreversível | Declare **Not rollback-safe**; documente forward-fix / restore / ação compensatória |
| Unknown | **Not Defined** — não assuma que rollback existe |

## Relação com restore e DR

| Action | Typical use |
| --- | --- |
| Rollback | Desfazer uma mudança recente (deploy, config, feature flag) |
| Restore | Recuperar dados/estado de backup ([backup-restore.md](backup-restore.md)) |
| DR failover / rebuild | Recovery catastrófico ([disaster-recovery.md](disaster-recovery.md)) |

Não conflate os três. Um rollback bem-sucedido ainda pode deixar inconsistência de dados que precisa de restore ou procedimento compensatório.

## Segurança

- Declare efeitos destrutivos antes de passos que deletam ou sobrescrevem.
- Exija confirmação de ambiente/alvo.
- Vincule severity e ownership quando rollback faz parte da response a incidente.

## Documentos relacionados

- [deployment-operations.md](deployment-operations.md)
- [change-management.md](change-management.md)
- [runbooks/README.md](runbooks/README.md)
- [templates/runbook.md](templates/runbook.md)
- [incident-management.md](incident-management.md)
