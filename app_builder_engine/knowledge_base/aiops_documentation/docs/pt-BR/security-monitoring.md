# Monitoring de Segurança

> Language: pt-BR | [English](../en/security-monitoring.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar **security monitoring** — observar sinais relevantes de segurança — sem duplicar a orientação de monitoring operacional.

Monitoring operacional pergunta: *O sistema está saudável e atendendo expectativas dos users?*  
Segurança monitoring pergunta: *Estamos vendo indicadores de abuse, misuse, falha de control ou compromise?*

Ambos podem compartilhar telemetry. Documente o **purpose de segurança** separadamente quando o sinal dirigir uma decisão de segurança.

## Segurança vs Operational Monitoring

| Aspect | Operational monitoring | Segurança monitoring |
| --- | --- | --- |
| Primary question | Health, capacity, user impact | Threat, abuse, falha de control, exposure |
| Typical signals | Latency, error rate, saturation, dependency health | Auth failures, privilege anomalies, secret access, policy violations, integrity checks |
| Typical action | Scale, rollback, runbook, incident | Investigate, contain, revoke, exception review, security incident |
| Owner | Frequentemente ops / service owner | Segurança owner e/ou service owner — [security-ownership.md](security-ownership.md) |

A mesma metric pode servir a ambos os purposes. Registre ambos quando isso acontecer; não invente um monitor separado que não exista.

Linke o inventário operacional a [monitoring.md](monitoring.md). Prefira um inventário com coluna **Purpose** (`Operational` / `Security` / `Both`) a dashboards duplicados em docs.

## O que documentar por security monitor

| Field | Question |
| --- | --- |
| **What** | Signal ou check sendo observado |
| **Why (security)** | Threat, control ou requirement que sustenta |
| **Source** | De onde os dados vêm |
| **Frequency** | Com que frequência é avaliado |
| **Threshold / pattern** | O que significa “notable” (ou regra qualitativa) |
| **Owner** | Quem mantém o monitor |
| **Action** | Ticket, security alert, containment, log-only review |
| **Linked control / threat** | [security-controls.md](security-controls.md), [threat-modeling.md](threat-modeling.md) |
| **Classification** | Confirmed / Inferred / Unknown / Proposed |

Se um field for desconhecido, escreva **Not Defined**. Se security monitoring estiver intencionalmente ausente para uma tool não sensível, **Not Applicable**.

## Inventário sugerido

| What | Why (security) | Source | Frequency | Threshold / pattern | Owner | Action | Purpose |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | Segurança / Both |

## Bom Segurança Monitoring

- Amarrado a threats, controls ou requirements materiais — não a cada linha de log.
- Coluna Action não vazia (mesmo que “weekly review”).
- Distingue noise (failed logins de bots) de anomalies acionáveis quando conhecido.
- Nunca documenta valores secretos ou PII desnecessário em exemplos — [secure-logging.md](secure-logging.md), [security-evidence.md](security-evidence.md).

## Mau Segurança Monitoring

- “Segurança dashboard” afirmado sem owner ou action path.
- Copiar monitors operacionais de latency e rotulá-los security.
- Inventar produtos ou rules de SIEM / IDS que o projeto não usa.
- Falha silenciosa do próprio security monitoring sem documentação.

## Linkage

| If action is… | Also document… |
| --- | --- |
| Page / notify | [templates/security-alert.md](templates/security-alert.md), [alerting.md](alerting.md) |
| Investigate / contain | [security-incidents.md](security-incidents.md) |
| Operational mitigation | [incident-management.md](incident-management.md), [runbooks/README.md](runbooks/README.md) |
| Evidence collection | [security-evidence.md](security-evidence.md) |

## Documentos relacionados

- [monitoring.md](monitoring.md)
- [alerting.md](alerting.md)
- [observability-model.md](observability-model.md)
- [security-model.md](security-model.md)
- [operations-security.md](operations-security.md)
- [auditability.md](auditability.md)
