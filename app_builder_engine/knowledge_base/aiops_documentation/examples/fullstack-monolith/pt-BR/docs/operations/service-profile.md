---
title: "Service profile — SheetLedger API (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
version: "1.0"
---

# Perfil de serviço

> Language: pt-BR | [English](../../../en/docs/operations/service-profile.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> **Exemplo ficcional.**

## Ownership (obrigatório preencher ou Unknown)

| Papel | Owner | Notes |
| --- | --- | --- |
| Service / product | example-team | Fictional |
| Technical | example-team | Fictional |
| Operational / on-call | Unknown | Must not be left blank in real adopters |
| Escalation | Unknown | Must not be left blank in real adopters |

## Criticality

| Campo | Valor |
| --- | --- |
| Level | Medium / Not Defined |
| Rationale | Exemplo; não usar como baseline real |

## Observability

| Signal | Status |
| --- | --- |
| Metrics | Partial (ilustrativo; Datadog opcional em orgs Olivelas — não exigido pelo padrão) |
| Logs | Partial |
| Traces | Not Applicable (neste exemplo) |
| Health checks | Implemented (ilustrativo) |

## Service Levels

| SLI | SLO | Classification |
| --- | --- | --- |
| — | Not Defined | Unknown |

## Entry points

| Entry | Notes | Classification |
| --- | --- | --- |
| HTTP API `/api`, `/api/v1` | Ilustrativo | Confirmed (within example) |
| Health | Ilustrativo | Confirmed (within example) |
| OpenAPI stub | Não produção | Confirmed (within example) |

## Dependências críticas

| Dependência | Falha típica | Runbook |
| --- | --- | --- |
| PostgreSQL ilustrativo | Health database false | [rb-db-unavailable.md](rb-db-unavailable.md) |
| Bootstrap admin env | Login impossível em ambiente novo | [rb-auth-bootstrap.md](rb-auth-bootstrap.md) |

## Relacionados

- [observability.md](observability.md)
- [../application/backend-api.md](../application/backend-api.md)

