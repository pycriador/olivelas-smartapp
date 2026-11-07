# Prontidão Operacional

> Language: pt-BR | [English](../en/operational-readiness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como decidir se um serviço ou capacidade está **pronto para operar** em um ambiente compartilhado ou de produção.

Prontidão operacional não é uma checklist de lançamento de marketing. Pergunta: *Podemos rodar, observar, detectar, diagnosticar e recuperar isto com segurança?*

## Lente de readiness

| Area | Question |
| --- | --- |
| Ownership | Quem é owner do serviço, on-call, escalation? — [operational-ownership.md](operational-ownership.md) |
| Criticality | A classe de impacto é conhecida? — [criticality.md](criticality.md) |
| Observability | Conseguimos ver health e falhas? — [observability-model.md](observability-model.md) |
| Alerting | Alertas são actionable com owners? — [alerting.md](alerting.md) |
| Runbooks | Caminhos críticos têm procedimentos? — [runbooks/README.md](runbooks/README.md) |
| Deploy / rollback | Podemos liberar e desfazer com segurança quando possível? — [deployment-operations.md](deployment-operations.md) |
| Failure modes | Modes importantes são conhecidos? — [failure-modes.md](failure-modes.md) |
| Recovery | Backup/restore/DR conforme aplicável — [backup-restore.md](backup-restore.md), [disaster-recovery.md](disaster-recovery.md) |
| Contratos | Timeout/retry/idempotency conhecidos nas fronteiras? — [contract-model.md](contract-model.md) |

Use a checklist de itens: [operational-readiness-checklist.md](operational-readiness-checklist.md).

## Resultados

| Outcome | Meaning |
| --- | --- |
| Ready | Gaps materiais fechados ou aceitos com risco explícito |
| Conditionally ready | Exceções com prazo e owners |
| Not ready | Blockers permanecem; não implique operabilidade em produção |

Marque unknowns como **Unknown** / **Not Defined**. Não invente SLOs, alerts ou DR para “passar” na readiness.

## Progressive Disclosure

| Project size | Bar |
| --- | --- |
| Small | Owner, como distinguir quebrado vs saudável, um caminho de recovery |
| Medium | Alerts + runbooks para falhas críticas, clareza de deploy/validate |
| Large | Modelo completo de reliability, dependency reliability, recovery praticado onde reivindicado |

## Documentos relacionados

- [operational-readiness-checklist.md](operational-readiness-checklist.md)
- [operations-checklist.md](operations-checklist.md)
- [templates/service-profile.md](templates/service-profile.md)
- [reliability-model.md](reliability-model.md)
- [operations-model.md](operations-model.md)
