---
title: "Incidente: INC-20260801-01 latência do catálogo (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
incident_id: "INC-20260801-01"
severity: "SEV-2"
---

# Incidente: INC-20260801-01 latência do catálogo

> Language: pt-BR | [English](../en/incident.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Incident ID: INC-20260801-01
>
> **Exemplo ficcional — não é um projeto real.**

## Resumo

Latência elevada e erros de timeout nas consultas do catalog-service por aproximadamente 40 minutos. Usuários tiveram browse lento ou com falha.

## Status

| Campo | Valor |
| --- | --- |
| Status do incidente | Resolved |
| Estado operacional | Healthy |
| Severidade | SEV-2 |
| Commander / owner | example-oncall |
| Início | 2026-08-01T14:10:00Z |
| Detecção | 2026-08-01T14:18:00Z |
| Resolução | 2026-08-01T14:50:00Z |

## Impacto

| Campo | Valor |
| --- | --- |
| Capacidades afetadas | catalog lookup / browse |
| Escopo de usuários / tenants | todos os usuários fictícios da vitrine na região de exemplo |
| Impacto em dados | none |

## Timeline

| Hora (UTC) | Tipo | Entrada |
| --- | --- | --- |
| 14:10 | FACT | Ratio de erro começou a subir |
| 14:18 | FACT | Alerta disparou; on-call reconheceu |
| 14:25 | HYPOTHESIS | Mudança recente de config de timeout do inventory-store |
| 14:32 | CONFIRMED | p99 do inventory-store acima do timeout do contrato |
| 14:40 | FACT | Rollback da config de timeout; degrade com cache habilitado |
| 14:50 | FACT | Ratio abaixo do limiar; incidente encerrado |

## Causa raiz

| Campo | Valor |
| --- | --- |
| Causa raiz | Config de timeout do inventory-store reduzida abaixo da latência sustentável |
| Fatores contribuintes | Validação pré-mudança ausente do p99 da dependência |
| Gatilho | Mudança de config às 14:05 UTC |
| Gap de detecção | ~8 minutos até o alerta |
| Gap de recuperação | ~32 minutos da detecção à resolução |
| Classificação | Confirmed (example) |

## Resposta

| Ação | Owner | Resultado |
| --- | --- | --- |
| Aplicou rb-catalog-high-error-rate | example-oncall | Diagnóstico concluído |
| Rollback da config de timeout | example-oncall | Latência melhorou |
| Habilitou degrade com cache | example-oncall | Impacto reduzido durante a recuperação |

## Runbooks relacionados

| Runbook | Aplicado? |
| --- | --- |
| rb-catalog-high-error-rate | sim |

## Follow-ups

| Ação | Tipo | Owner | Status |
| --- | --- | --- |
| Check pré-mudança de p99 da dependência vs timeout | Preventive | example-team | open |
| Documentar failure mode de timeout de dependência | Documentation | example-team | done (example) |
| Revisar limiar de alerta para MTTD menor | Detective | example-team | open |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Service profile | ../service-profile/ |
| Runbook | ../runbook/ |
| Failure mode | ../failure-mode/ |
| SLO | ../slo/ |
