# Checklist de Prontidão Operacional

> Language: pt-BR | [English](../en/operational-readiness-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Checklist prática antes de tratar um serviço como operable em um ambiente compartilhado ou de produção. Use o que se aplica — marque N/A conscientemente.

Prefira evidência do estado atual a design aspiracional. Itens materiais não checados tornam-se [dívida de reliability](reliability-debt.md) ou [dívida de documentação](documentation-debt.md).

## Ownership e criticality

- [ ] Owner de service / capability definido
- [ ] Owner operacional / on-call definido (pode ser o mesmo time)
- [ ] Caminho de escalation definido
- [ ] Criticality (ou equivalente) definida
- [ ] Dependency owners identificáveis para deps críticas

## Identidade do serviço

- [ ] Purpose e scope claros ([templates/service-profile.md](templates/service-profile.md) ou equivalente)
- [ ] Dependências principais listadas (runtime / data / identity conforme aplicável)
- [ ] Arquitetura e failure domains vinculados — não duplicados narrativamente

## Observability e detection

- [ ] Health signals definidos quando aplicável ([health-checks.md](health-checks.md))
- [ ] Key metrics / logs / traces documentados ou marcados N/A ([observability-model.md](observability-model.md))
- [ ] Monitoring cobre failure modes materiais ([monitoring.md](monitoring.md))
- [ ] Alerts são actionable e têm owner ([alerting.md](alerting.md))
- [ ] Encadeamento alert → runbook (ou ação explícita) existe para alerts críticos

## Response e recovery

- [ ] Runbooks existem para caminhos críticos de falha ([runbooks/README.md](runbooks/README.md))
- [ ] Modelo de incident severity conhecido ou marcado N/A ([incident-severity.md](incident-severity.md))
- [ ] Stance de rollback ou forward-fix documentada para releases típicos ([rollback.md](rollback.md))
- [ ] Backup / restore documentado ou N/A explícito ([backup-restore.md](backup-restore.md))
- [ ] RPO / RTO Defined ou **Not Defined** ([rpo-rto.md](rpo-rto.md))
- [ ] DR formal Defined ou “Formal Disaster Recovery not defined.” ([disaster-recovery.md](disaster-recovery.md))

## Mudança e deploy

- [ ] Caminho de deploy documentado em nível operable ([deployment-operations.md](deployment-operations.md))
- [ ] Critérios de validation para releases definidos
- [ ] Expectativas de mudança planned vs emergency conhecidas ([change-management.md](change-management.md))
- [ ] Impacto de maintenance pode ser comunicado ([maintenance.md](maintenance.md))

## Contratos e reliability

- [ ] Timeouts / retries / idempotency de fronteiras críticas documentados ou Unknown
- [ ] Failure modes importantes catalogados ou resumidos ([failure-modes.md](failure-modes.md))
- [ ] Comportamento de degradação conhecido ou Unknown ([degradation.md](degradation.md))
- [ ] SLIs/SLOs Defined, N/A ou Not Defined — não inventados ([service-levels.md](service-levels.md))

## Qualidade da documentação

- [ ] Docs de ops têm owners e metadata `updated` fresca
- [ ] Sem secrets em runbooks ou exemplos
- [ ] Unknowns marcados; sem claims Confirmed falsos
- [ ] Links para arquitetura / contratos resolvem

## Como usar

| Situation | Use |
| --- | --- |
| Launch de novo serviço | Percorra a lista completa |
| Redesign major | Re-cheque Observability, Recovery, Contratos |
| Follow-up de incidente | Re-cheque itens que falharam na prática |
| Review periódica | Amostra de serviços críticos |

## Documentos relacionados

- [operational-readiness.md](operational-readiness.md)
- [operations-checklist.md](operations-checklist.md)
- [reliability-debt.md](reliability-debt.md)
- [quality-model.md](quality-model.md)
