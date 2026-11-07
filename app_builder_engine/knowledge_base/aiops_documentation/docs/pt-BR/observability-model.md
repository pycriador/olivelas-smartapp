# Modelo de Observabilidade

> Language: pt-BR | [English](../en/observability-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar o que se pode saber sobre um sistema em produção — sinais usados para Operate → Observe → Detect → Diagnose no [modelo de operações](operations-model.md).

Este padrão é agnóstico de tecnologia. Para um template fill-in do projeto, use [templates/observability.md](templates/observability.md).

## Tipos de sinal

| Signal | Meaning | Typical use |
| --- | --- | --- |
| **Metrics** | Medições numéricas agregadas ao longo do tempo | SLIs, saturação, rates, gauges |
| **Logs** | Registros discretos de eventos | Diagnóstico, audit de ações notáveis |
| **Traces** | Spans causais de request / workflow entre componentes | Análise de latência e caminho de dependência |
| **Events** | Mudanças de estado notáveis (deploy, failover, config) | Correlacionar mudanças com sintomas |
| **Health signals** | Checks explícitos de liveness / readiness / dependency / business | Routing, probes, status grosseiro |

Um projeto não precisa implementar todo tipo. Marque **Not Applicable** ou **Not Documented** conforme [templates/observability.md](templates/observability.md).

## O que documentar por tipo de sinal

| Topic | Question |
| --- | --- |
| Status | Implemented / Partial / Not Applicable / Not Documented |
| Purpose | Quais decisões ou diagnósticos sustenta |
| Cardinality / volume risks | Se relevante |
| PII / secrets | O que nunca deve aparecer — nunca documente valores de secret |
| Correlation | Como juntar metrics ↔ logs ↔ traces ↔ events |
| Owner | Quem mantém a qualidade do sinal |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Correlação

Documente identificadores usados para costurar sinais (request id, trace id, tenant id, deploy id — conforme realmente usados). Se a correlação for fraca ou ausente, diga **Unknown** ou descreva o gap.

## Relação com monitoring e alerting

| Concern | Document |
| --- | --- |
| Quais sinais existem | Este modelo + template de observability |
| O que é observado continuamente | [monitoring.md](monitoring.md) |
| O que pageia um humano | [alerting.md](alerting.md) |
| Definições de probe | [health-checks.md](health-checks.md) |
| Medição de SLI | [service-levels.md](service-levels.md) |

## Arquitetura e contratos

- Visões de trace e dependência devem corresponder a [component-relationships.md](component-relationships.md) e [failure-domains.md](failure-domains.md).
- Sinais de erro e latência devem ser interpretáveis contra regras de erro e timing de [contrato](contract-model.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Como distinguir saudável vs quebrado; onde vivem os logs; uma métrica-chave se houver |
| Medium | Metrics + logs + alerts mapeados a runbooks |
| Large | Metrics, logs, traces, events, health; história de correlação; instrumentação de SLO |

## Documentos relacionados

- [templates/observability.md](templates/observability.md)
- [health-checks.md](health-checks.md)
- [monitoring.md](monitoring.md)
- [alerting.md](alerting.md)
- [operations-model.md](operations-model.md)
