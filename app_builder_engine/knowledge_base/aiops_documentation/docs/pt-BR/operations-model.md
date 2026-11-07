# Modelo de Operações

> Language: pt-BR | [English](../en/operations-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **operações e confiabilidade** como um ciclo contínuo — não como uma checklist pontual.

Esta metodologia é agnóstica de tecnologia. Integra-se com [Arquitetura](architecture-model.md) (estrutura, failure domains, dependências) e [Contratos](contract-model.md) (retry, timeouts, delivery, erros). Arquitetura descreve *o que existe*; contratos descrevem *regras de interação*; docs de operações descrevem *como o sistema é operado, observado e recuperado*.

## Distinções de qualidade

Use estes termos com precisão. Não os trate como sinônimos.

| Concept | Meaning | Typical documentation focus |
| --- | --- | --- |
| **Availability** | O sistema (ou capacidade) pode ser alcançado e usado quando necessário | Uptime, reachability, capacidade de servir, janelas de outage |
| **Reliability** | O sistema executa corretamente sua função pretendida sob condições esperadas ao longo do tempo | Resultados corretos, taxas de erro, consistência com contratos |
| **Resilience** | O sistema resiste a falhas e estresse sem colapso descontrolado | Isolamento, modos de degradação, bulkheads, comportamento de retry/backoff |
| **Recoverability** | O sistema pode ser restaurado a um estado utilizável após falha ou perda | Passos de recovery, backups, RPO/RTO quando definidos, failover |
| **Operability** | Humanos e automação podem operar, diagnosticar e alterar o sistema com segurança | Ownership, runbooks, sinais, alertas, clareza de change/rollback |

Um sistema pode estar *available* (respondendo) mas não *reliable* (respostas erradas). Pode ser *resilient* sob falha parcial e ainda assim difícil de *operar*. Documente cada dimensão relevante ao projeto; marque as demais como **Not Applicable** ou **Not Defined**.

## Ciclo de operações

```text
Operate → Observe → Detect → Diagnose → Respond → Recover → Learn → Improve
    ↑                                                              │
    └──────────────────────────────────────────────────────────────┘
```

| Stage | Question | Typical artifacts |
| --- | --- | --- |
| **Operate** | Como operamos no dia a dia? | Ownership, deployment ops, maintenance, operational state |
| **Observe** | Quais sinais existem? | Metrics, logs, traces, events, health checks |
| **Detect** | Como sabemos que algo está errado? | Monitoring, alerting, health signals |
| **Diagnose** | O que está falhando e por quê (teoria de trabalho)? | Runbooks, timelines, dependency maps |
| **Respond** | O que fazemos agora? | Processo de incidente, escalation, ações mitigadoras |
| **Recover** | Como restauramos o serviço? | Runbooks, rollback, restore, saída de degradação |
| **Learn** | O que de fato aconteceu? | Fatos da timeline, RCA, post-incident review |
| **Improve** | O que reduz recorrência ou blast radius? | Corrective actions, atualizações de docs/arquitetura/contratos |

Estágios podem se sobrepor em um incidente real. Documente o ciclo que o projeto realmente usa; não invente processo que não existe.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Ownership, como distinguir saudável vs quebrado, um runbook para o caminho crítico de falha |
| Medium | Service levels (ou N/A explícito), monitoring/alerting, incident severity, failure modes principais |
| Large / distributed | Modelo completo de reliability, dependency reliability, capacity/scaling, política de error budget, prática de PIR |

## Pontos de integração

| Area | Link |
| --- | --- |
| Arquitetura failure domains | [failure-domains.md](failure-domains.md) |
| Component dependencies | [component-relationships.md](component-relationships.md), [reliability-model.md](reliability-model.md) |
| Contract behavior under failure | [retry-policy.md](retry-policy.md), [idempotency.md](idempotency.md), [delivery-semantics.md](delivery-semantics.md), [timing-contract.md](timing-contract.md) |
| Documentation ownership | [ownership.md](ownership.md), [operational-ownership.md](operational-ownership.md) |
| Observability template | [templates/observability.md](templates/observability.md) |
| Runbook template | [templates/runbook.md](templates/runbook.md) |

Prefira links a copiar diagramas de arquitetura ou schemas de contrato para docs de operações.

## Certainty

Classifique afirmações operacionais como Confirmed / Inferred / Unknown / Proposed ([standards.md](standards.md)). Prefira **Unknown** ou **Not Defined** a SLOs, tempos de recovery ou monitoring inventados que não existem.

## Documentos relacionados

- [operational-ownership.md](operational-ownership.md)
- [reliability-model.md](reliability-model.md)
- [service-levels.md](service-levels.md)
- [observability-model.md](observability-model.md)
- [incident-management.md](incident-management.md)
- [operations/README.md](operations/README.md)
