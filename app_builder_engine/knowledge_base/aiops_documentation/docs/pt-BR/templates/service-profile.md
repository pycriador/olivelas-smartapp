---
title: "Service Profile"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
# service_id: "stable-service-name"
# criticality: "Critical / High / Medium / Low / Not Defined"
---

# Perfil de Serviço

> Language: pt-BR | [English](../../en/templates/service-profile.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Cartão de identidade operacional de um serviço ou capacidade. Vincule componentes de arquitetura e contratos; não duplique prosa de componente nem schemas. -->

## Propósito

<!-- Por que este serviço existe e qual resultado de usuário/capacidade fornece. -->

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| | |

## Ownership

**Obrigatório:** cada linha deve ter um owner nomeado **ou** o token `Unknown`. Células vazias não são aceitas em docs `ACCEPTED`.

| Papel | Owner | Notes |
| --- | --- | --- |
| Service / product | <!-- name or Unknown --> | |
| Technical | <!-- name or Unknown --> | |
| Operational / on-call | <!-- name or Unknown --> | |
| Escalation | <!-- name or Unknown --> | |

<!-- O mesmo time pode exercer múltiplos roles. Veja operational-ownership.md. Preferir Unknown explícito a omitir on-call. -->

## Criticality

| Campo | Valor |
| --- | --- |
| Level | Critical / High / Medium / Low / other / Not Defined |
| Rationale | |
| User / business impact if down | |

## Links de arquitetura

| Concern | Link |
| --- | --- |
| Arquitetura overview / component | |
| Failure domains | |
| Dependency map | |

<!-- Arquitetura → Components → Deps → Failure Domains → Ops → Recovery. Não reescreva descrições completas de componente. -->

## Dependências

| Dependency | Type | Criticality | Failure impact | Detection | Mitigation / recovery |
| --- | --- | --- | --- | --- | --- |
| | runtime / build / deploy / operational | | | | |

## Contratos (relevantes a reliability)

| Contract | Timeout | Retry | Idempotency | Notes |
| --- | --- | --- | --- | --- |
| | | | | |

<!-- Vincule contratos canônicos; não cole schemas. -->

## Service Levels

| SLI | SLO | Window | Error budget | Classification |
| --- | --- | --- | --- | --- |
| | or N/A / Not Defined | | or N/A | |

## Failure Modes (resumo)

| Failure mode | Impact | Detection | Runbook / recovery |
| --- | --- | --- | --- |
| | | | |

## Observability

| Signal type | Status | Notes / link |
| --- | --- | --- |
| Metrics | Implemented / Partial / N/A / Not Documented | |
| Logs | | |
| Traces | | |
| Health checks | | |
| Alerts | | |

## Operational State

| How state is determined | Healthy / Degraded / Unavailable signals |
| --- | --- |
| | |

## Deploy e change

| Topic | Link / notes |
| --- | --- |
| Deploy / validate | |
| Rollback stance | Safe / partial / irreversible / Unknown |
| Maintenance | |

## Recovery

| Topic | Status | Link |
| --- | --- | --- |
| Backup / restore | Defined / N/A / Not Defined | |
| RPO / RTO | Defined / Not Defined | |
| Disaster recovery | Defined / Formal Disaster Recovery not defined. | |

## Runbooks e incidentes relacionados

| Artifact | ID / path |
| --- | --- |
| Runbooks | |
| Troubleshooting | |
| Recent material incidents | |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Arquitetura | |
| Contratos | |
| Observability | |
| Reliability model | |
