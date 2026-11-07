---
title: "Incidente"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
# incident_id: "INC-YYYYMMDD-NN"
# severity: "SEV-1 / SEV-2 / SEV-3 / SEV-4 / other"
---

# Incidente

> Language: pt-BR | [English (EN)](../../en/templates/incident.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Resumo

<!-- O que está (ou estava) quebrado para usuários/capacidades. -->

## Status

| Campo | Valor |
| --- | --- |
| Status do incidente | Detecting / Mitigating / Monitoring / Resolved |
| Estado operacional | Healthy / Degraded / Unavailable / Recovering / Maintenance / Unknown |
| Severidade | |
| Commander / owner | |
| Início | <!-- ISO-8601 --> |
| Detectado | |
| Resolvido | <!-- or empty if open --> |

## Impacto

| Campo | Valor |
| --- | --- |
| Capacidades afetadas | |
| Escopo de usuário / tenant | |
| Impacto em dados | none / possible / confirmed / Unknown |

## Linha do tempo

| Horário (UTC) | Tipo | Entrada |
| --- | --- | --- |
| | FACT / HYPOTHESIS / CONFIRMED / UNKNOWN | |

## Causa raiz

| Campo | Valor |
| --- | --- |
| Causa raiz | <!-- may be Unknown while the incident is open --> |
| Fatores contribuintes | |
| Gatilho | |
| Lacuna de detecção | |
| Lacuna de recovery | |
| Classificação | Confirmed / Inferred / Unknown / Proposed |

<!-- Root Cause may remain Unknown during the incident. Do not invent a cause to close the narrative early. -->

## Resposta

| Ação | Owner | Resultado |
| --- | --- | --- |
| | | |

## Runbooks relacionados

| Runbook | Aplicado? |
| --- | --- |
| | |

## Encaminhamentos

| Ação | Tipo | Owner | Status |
| --- | --- | --- | --- |
| | Preventive / Detective / Mitigative / Recovery / Documentation | | |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| PIR | |
| Perfil do serviço | |
| Arquitetura / domínio de falha | |
| Contratos | |
