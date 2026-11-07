# Checklist de Documentação de Operações

> Language: pt-BR | [English](../en/operations-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Checklist prática para qualidade de documentação de **operações e reliability**. Use o que se aplica — projetos pequenos não precisam marcar todo item.

Classifique claims incertos (Confirmed / Inferred / Unknown / Proposed). Prefira estado atual a teatro aspiracional de ops.

## Modelo e ownership

- [ ] Ciclo de operações compreendido ([operations-model.md](operations-model.md))
- [ ] Ownership operacional definido ([operational-ownership.md](operational-ownership.md))
- [ ] Criticality definida ou N/A ([criticality.md](criticality.md))
- [ ] Service profile (ou equivalente) existe para serviços materiais

## Reliability

- [ ] Modelo de reliability ou resumo presente ([reliability-model.md](reliability-model.md))
- [ ] Failure modes importantes identificados ([failure-modes.md](failure-modes.md))
- [ ] Propagação / domains de falha vinculados ([failure-propagation.md](failure-propagation.md), [failure-domains.md](failure-domains.md))
- [ ] Comportamento de degradação documentado ou Unknown ([degradation.md](degradation.md))
- [ ] Dependency reliability considerada ([dependency-reliability.md](dependency-reliability.md))
- [ ] Capacity / scaling documentados só onde relevantes

## Observability

- [ ] Modelo ou template de observability preenchido ([observability-model.md](observability-model.md), [templates/observability.md](templates/observability.md))
- [ ] Health checks documentados ou N/A ([health-checks.md](health-checks.md))
- [ ] Monitoring e alerting actionable ([monitoring.md](monitoring.md), [alerting.md](alerting.md))
- [ ] Stance de SLI/SLO/SLA explícita — Defined / N/A / Not Defined ([service-levels.md](service-levels.md))

## Incidentes e runbooks

- [ ] Processo de incidente documentado em profundidade usável ([incident-management.md](incident-management.md))
- [ ] Modelo de severity definido ou alternativa do projeto documentada ([incident-severity.md](incident-severity.md))
- [ ] Runbooks existem para caminhos críticos ([runbooks/README.md](runbooks/README.md), [templates/runbook.md](templates/runbook.md))
- [ ] Runbooks incluem preconditions, validation, notas de rollback/safety
- [ ] Orientação de timeline / RCA / PIR seguida quando incidentes ocorrem
- [ ] Corrective actions rastreadas ([corrective-actions.md](corrective-actions.md))

## Mudança, deploy, recovery

- [ ] Deploy / validate / rollback documentados sem comandos inventados ([deployment-operations.md](deployment-operations.md))
- [ ] Expectativas de mudança planned vs emergency claras ([change-management.md](change-management.md))
- [ ] Vocabulário de operational states conhecido ([operational-state.md](operational-state.md))
- [ ] Backup/restore Defined ou N/A explícito ([backup-restore.md](backup-restore.md))
- [ ] RPO/RTO Defined ou **Not Defined** ([rpo-rto.md](rpo-rto.md))
- [ ] DR Defined ou “Formal Disaster Recovery not defined.” ([disaster-recovery.md](disaster-recovery.md))

## Drift, debt, readiness

- [ ] Operational drift pode ser registrado ([operational-drift.md](operational-drift.md))
- [ ] Registro de reliability debt utilizável ([reliability-debt.md](reliability-debt.md))
- [ ] Operational readiness considerada em launches ([operational-readiness-checklist.md](operational-readiness-checklist.md))
- [ ] Sem secrets em docs de ops
- [ ] Links de arquitetura e contrato usados em vez de prosa duplicada de componente/schema

## Como usar

| Situation | Use |
| --- | --- |
| Novo serviço | Percorra Model → Observability → Runbooks → Recovery |
| Review de docs de ops | Use como espinha de review |
| Pós-incidente | Re-cheque itens de Incidents/Runbooks e Reliability que falharam |
| Docs de ops gerados por AI | Pareie com expectativas de review em [ai-documentation.md](ai-documentation.md) |

Itens materiais não checados devem tornar-se dívida de reliability ou documentação — não gaps Confirmed silenciosos.

## Documentos relacionados

- [operational-readiness-checklist.md](operational-readiness-checklist.md)
- [operations/README.md](operations/README.md)
- [quality-model.md](quality-model.md)
- [documentation-checklist.md](documentation-checklist.md)
- [architecture-checklist.md](architecture-checklist.md)
- [contract-checklist.md](contract-checklist.md)
