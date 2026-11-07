---
title: "Runbook Name"
status: "DRAFT"
owner: "team"
severity: "MEDIUM"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
# runbook_id: "rb-short-name"
---

# Runbook

> Language: pt-BR | [English](../../en/templates/runbook.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Procedimento operacional executável. Use apenas passos evidenciados no projeto. Nunca invente comandos, infraestrutura, caminhos ou permissions. Nunca embuta secrets. -->

## Propósito

<!-- Qual resultado operacional este runbook alcança. -->

## Trigger

<!-- O que inicia este runbook: alerta, sintoma, solicitação, verificação agendada. -->

## Preconditions

| Precondition | How to verify |
| --- | --- |
| | |

## Safety Notes

- Confirme ambiente e alvo antes de agir.
- Destaque passos **destrutivos** ou **irreversíveis** antes de executá-los.
- Rollback nem sempre é seguro — veja a seção Rollback.
- Documente apenas **nomes** de comando/config; nunca valores secretos.
- Não invente tooling, caminhos, nomes de cluster ou permissions.

## Symptoms

| Symptom | Where observed |
| --- | --- |
| | |

## Impacto

| Campo | Valor |
| --- | --- |
| User / capability impact | |
| Operational state | Healthy / Degraded / Unavailable / Recovering / Maintenance / Unknown |
| Blast radius | |

## Diagnosis

1. <!-- step -->
2. <!-- step -->
3. <!-- step -->

| Check | Expected | If unexpected |
| --- | --- | --- |
| | | |

## Immediate Actions

1. <!-- contenção / stop-the-bleeding -->
2. <!-- step -->

## Recovery

1. <!-- restaurar estado operacional aceitável -->
2. <!-- step -->
3. <!-- step -->

## Validação

| Check | Expected result |
| --- | --- |
| | |

## Rollback

1. <!-- step se as ações de recovery precisarem ser desfeitas -->
2. <!-- step -->

| Condition requiring rollback | Action |
| --- | --- |
| | |

| Rollback stance | Notes |
| --- | --- |
| Safe / partial / irreversible / Unknown | |

## Escalation

| Condition | Escalate to | Information to provide |
| --- | --- | --- |
| | | |

## Prevention

| Follow-up | Owner | Notes |
| --- | --- | --- |
| | | |

## Related Alerts

| Alert | Path |
| --- | --- |
| | |

## Related Arquitetura

| Documento | Caminho |
| --- | --- |
| | |

## Related Contratos

| Contract | Path |
| --- | --- |
| | |

## Related Incidents

| Incident | Path |
| --- | --- |
| | |
