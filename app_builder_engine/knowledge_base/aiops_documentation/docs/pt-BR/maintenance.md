# Manutenção

> Language: pt-BR | [English](../en/maintenance.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar manutenção planejada que afeta intencionalmente availability, capacity ou operability.

## Propósito

Manutenção é trabalho **planejado** com uma janela esperada de impacto operacional. Distingue-se de incidentes ([incident-management.md](incident-management.md)) e de mudanças de emergência ([change-management.md](change-management.md)).

## O que documentar

| Topic | Question |
| --- | --- |
| Scope | Sistemas, ambientes, jornadas de usuário afetados |
| Window | Início / fim (timezone explícito) ou duração |
| Impact | Estado esperado: Degraded / Unavailable / Maintenance — [operational-state.md](operational-state.md) |
| Reason | Por que o trabalho é necessário |
| Owner | Quem executa e quem comunica |
| Procedure | Passos ou link para runbook / change ticket |
| Validation | Como o retorno a Healthy é confirmado |
| Rollback / abort | Como parar se a janela correr mal |
| Communication | Audiência e canais |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Orientação

- Anuncie impacto com honestidade; não agende manutenção de “zero impacto” que rotineiramente quebra usuários.
- Prefira vincular ao procedimento de deploy/change a duplicar comandos ([deployment-operations.md](deployment-operations.md)).
- Registre se SLOs/error budgets tratam a janela como exclusion — só se for verdade ([error-budget.md](error-budget.md), [service-levels.md](service-levels.md)).
- Após a manutenção, atualize docs se a mudança alterou arquitetura, contratos ou runbooks ([change-policy.md](change-policy.md)).

## Quando Not Applicable

Jobs batch ou libraries sem runtime compartilhado podem marcar janelas formais de maintenance como **Not Applicable**. Ainda assim documente como upgrades são feitos se operadores precisarem desse conhecimento.

## Documentos relacionados

- [operational-state.md](operational-state.md)
- [change-management.md](change-management.md)
- [deployment-operations.md](deployment-operations.md)
- [rollback.md](rollback.md)
- [operational-ownership.md](operational-ownership.md)
