# Operações

> Language: pt-BR | [English (EN)](../../en/operations/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Categoria para documentação de operações e confiabilidade em projetos em adoção, além da metodologia de Operações & Reliability definida por este padrão.

## Objetivo

Descrever como operar, observar, detectar, diagnosticar, responder, recuperar, aprender e melhorar — sem inventar SLOs, alertas, DR ou comandos que não existem.

## Integração com arquitetura e contratos

```text
Architecture
      │
      ├── Components
      ├── Dependencies
      └── Failure Domains
              │
              ▼
         Operations
              │
              └── Recovery
```

Contratos alimentam **Timeout / Retry / Idempotency / Delivery** no comportamento de confiabilidade. Prefira links:

- Docs de arquitetura nomeiam estrutura e failure domains — **não** duplique descrições de componente em docs de ops.
- Docs de contrato guardam regras verificáveis de fronteira — docs de ops as consomem para tratamento de falha e runbooks.

Veja [../architecture-model.md](../architecture-model.md), [../failure-domains.md](../failure-domains.md), [../contract-model.md](../contract-model.md), [../operations-model.md](../operations-model.md).

## Orientação

- Escreva procedimentos como passos executáveis com pré-condições, validação e notas de rollback/segurança.
- Marque **Not Applicable** / **Not Defined** / Unknown com honestidade.
- Quando DR formal estiver ausente: *Formal Disaster Recovery not defined.*
- Mantenha runbooks alinhados à arquitetura e aos contratos atuais.
- Nunca embuta secrets em exemplos operacionais.
- Não invente comandos universais de deploy/chaos.

## Metodologia (Documentation Standard)

### Modelo e ownership

| Documento | Propósito |
| --- | --- |
| [../operations-model.md](../operations-model.md) | Operate→Observe→Detect→Diagnose→Respond→Recover→Learn→Improve |
| [../operational-ownership.md](../operational-ownership.md) | Owners de serviço / técnico / operacional / on-call / escalation / dependência |
| [../criticality.md](../criticality.md) | Níveis e fatores de criticidade |
| [../templates/service-profile.md](../templates/service-profile.md) | Cartão de identidade operacional do serviço |

### Níveis de serviço

| Documento | Propósito |
| --- | --- |
| [../service-levels.md](../service-levels.md) | SLI → SLO → SLA |
| [../error-budget.md](../error-budget.md) | Política de error budget |
| [../templates/sli.md](../templates/sli.md) | Template de SLI |
| [../templates/slo.md](../templates/slo.md) | Template de SLO (inclui Error Budget) |

### Confiabilidade

| Documento | Propósito |
| --- | --- |
| [../reliability-model.md](../reliability-model.md) | Deps, SPOF, failure modes, degradation, recovery, limits |
| [../failure-modes.md](../failure-modes.md) | Orientação de catálogo de modos de falha |
| [../failure-propagation.md](../failure-propagation.md) | Start / propagate / isolate / impact |
| [../degradation.md](../degradation.md) | Graceful / hard / partial |
| [../dependency-reliability.md](../dependency-reliability.md) | Tabela de confiabilidade de dependências |
| [../operational-dependencies.md](../operational-dependencies.md) | Deps de runtime / build / deployment / operacional |
| [../capacity.md](../capacity.md) | Métricas de capacidade (só as relevantes) |
| [../scaling.md](../scaling.md) | Estratégias de scaling |
| [../templates/failure-mode.md](../templates/failure-mode.md) | Template de modo de falha |
| [../templates/capacity-limit.md](../templates/capacity-limit.md) | Template de limite de capacidade |

### Observabilidade

| Documento | Propósito |
| --- | --- |
| [../observability-model.md](../observability-model.md) | Metrics / logs / traces / events / health signals |
| [../health-checks.md](../health-checks.md) | Liveness / readiness / dependency / business |
| [../monitoring.md](../monitoring.md) | What / why / source / threshold / action |
| [../alerting.md](../alerting.md) | Alertas acionáveis |
| [../observability/README.md](../observability/README.md) | Índice da categoria Observability |
| [../templates/observability.md](../templates/observability.md) | Template de observabilidade do projeto |
| [../templates/alert.md](../templates/alert.md) | Template de alerta |

### Incidentes e runbooks

| Documento | Propósito |
| --- | --- |
| [../runbooks/README.md](../runbooks/README.md) | Conceito de runbook e regras de segurança |
| [../incident-management.md](../incident-management.md) | Ciclo de vida do incidente |
| [../incident-severity.md](../incident-severity.md) | Modelos de severity |
| [../incident-timeline.md](../incident-timeline.md) | FACT / HYPOTHESIS / CONFIRMED / UNKNOWN |
| [../root-cause-analysis.md](../root-cause-analysis.md) | Root cause vs factors / gaps |
| [../post-incident-review.md](../post-incident-review.md) | PIR blameless |
| [../corrective-actions.md](../corrective-actions.md) | Preventive / detective / mitigative / recovery / documentation |
| [../templates/runbook.md](../templates/runbook.md) | Template de runbook |
| [../templates/incident.md](../templates/incident.md) | Template de registro de incidente |
| [../templates/troubleshooting.md](../templates/troubleshooting.md) | Guia de troubleshooting |
| [../templates/recovery-procedure.md](../templates/recovery-procedure.md) | Template de procedimento de recuperação |

### Mudança, deploy e recuperação

| Documento | Propósito |
| --- | --- |
| [../deployment-operations.md](../deployment-operations.md) | Deploy → validate → rollback |
| [../change-management.md](../change-management.md) | Planned vs Emergency |
| [../rollback.md](../rollback.md) | Segurança e irreversibilidade de rollback |
| [../operational-state.md](../operational-state.md) | Healthy / Degraded / Unavailable / Recovering / Maintenance / Unknown |
| [../maintenance.md](../maintenance.md) | Manutenção planejada |
| [../backup-restore.md](../backup-restore.md) | Backup e restore |
| [../rpo-rto.md](../rpo-rto.md) | RPO vs RTO |
| [../disaster-recovery.md](../disaster-recovery.md) | Disaster recovery |

### Prontidão, testes e qualidade

| Documento | Propósito |
| --- | --- |
| [../operational-readiness.md](../operational-readiness.md) | Conceito de prontidão |
| [../operational-readiness-checklist.md](../operational-readiness-checklist.md) | Checklist de lançamento / operabilidade |
| [../reliability-testing.md](../reliability-testing.md) | Estratégias conceituais de teste de confiabilidade |
| [../game-days.md](../game-days.md) | Game days (opcional para projetos pequenos) |
| [../operational-drift.md](../operational-drift.md) | Docs de ops ≠ operações reais |
| [../reliability-debt.md](../reliability-debt.md) | Registro de dívida de confiabilidade |
| [../operational-metrics.md](../operational-metrics.md) | Propósitos de métricas operacionais |
| [../reliability-metrics.md](../reliability-metrics.md) | MTTD / MTTR / MTBF |
| [../operations-checklist.md](../operations-checklist.md) | Checklist de qualidade da documentação de ops |

## Templates (lista rápida)

| Template | Uso |
| --- | --- |
| [service-profile.md](../templates/service-profile.md) | Perfil operacional do serviço |
| [runbook.md](../templates/runbook.md) | Procedimento operacional |
| [troubleshooting.md](../templates/troubleshooting.md) | Índice de diagnóstico |
| [observability.md](../templates/observability.md) | Sinais, alertas, health |
| [sli.md](../templates/sli.md) / [slo.md](../templates/slo.md) | Níveis de serviço |
| [failure-mode.md](../templates/failure-mode.md) | Um modo de falha |
| [capacity-limit.md](../templates/capacity-limit.md) | Um limite de capacidade |
| [alert.md](../templates/alert.md) | Um alerta |
| [incident.md](../templates/incident.md) | Registro de incidente |
| [recovery-procedure.md](../templates/recovery-procedure.md) | Procedimento de restore / recuperação |

## Relacionados

- [../quality-model.md](../quality-model.md) — dimensões de operabilidade
- [../ai-documentation.md](../ai-documentation.md) — regras de IA para operations / reliability / runbook
- [../standards.md](../standards.md) — convenções de naming de ops
