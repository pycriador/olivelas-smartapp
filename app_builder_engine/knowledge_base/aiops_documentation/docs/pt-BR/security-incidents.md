# Incidents de Segurança

> Language: pt-BR | [English](../en/security-incidents.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar **security incidents** e como se relacionam a operational incidents.

Não invente uma burocracia paralela de incident quando o projeto já tem uma. Estenda [incident-management.md](incident-management.md) com classification de segurança, containment e regras de evidence.

## Tipos de incident

| Type | Meaning | Primary lens |
| --- | --- | --- |
| **Operational** | Availability, performance, capacity, falha de dependency afetando users | Reliability / ops |
| **Segurança** | Confidentiality, integrity, authenticity, acesso não autorizado, abuse, exposure | Segurança |
| **Both** | Evento de segurança com impacto em user/service (ou evento de ops revelando falha de segurança) | Coordene ambos os owners |

Registre o tipo explicitamente. Incidents dual-type precisam de mitigation operacional e containment de segurança quando aplicável.

## Integração de lifecycle

Reutilize o lifecycle operacional; adicione ênfase de segurança:

```text
Detection → Triage (type + severity) → Containment → Eradication / Mitigation → Recovery → Communication → Post-Incident Review
```

| Stage | Segurança emphasis |
| --- | --- |
| **Detection** | Segurança monitoring, alerts, reports, anomaly — [security-monitoring.md](security-monitoring.md) |
| **Triage** | Operational vs Segurança vs Both; severity; se credentials/dados estão em risk |
| **Containment** | Limitar blast radius (revoke, isolate, disable, rotate references — nunca cole valores secretos) |
| **Eradication / Mitigation** | Remover causa ou reduzir risk; pode abrir vulnerabilities / exceptions |
| **Recovery** | Restaurar service com segurança; validar integrity |
| **Communication** | Conforme policy do projeto — não invente obrigações legais/de notification |
| **PIR** | Learning blameless — [post-incident-review.md](post-incident-review.md); alimente threats, controls, debt |

Regras de timeline permanecem: `FACT` / `HYPOTHESIS` / `CONFIRMED` / `UNKNOWN` — [incident-timeline.md](incident-timeline.md).

## O que documentar

| Campo | Significado |
| --- | --- |
| **ID** | Incident id do projeto (prefix específico de segurança opcional — [standards.md](standards.md)) |
| **Type** | Operational / Segurança / Both |
| **Summary** | O que aconteceu (sem dumps de secrets/PII) |
| **Assets affected** | [security-assets.md](security-assets.md) |
| **Impact** | Confidentiality / Integrity / Availability / other — o que é conhecido |
| **Severity** | Modelo do projeto — [incident-severity.md](incident-severity.md) |
| **Containment actions** | O que foi feito para limitar harm |
| **Evidence refs** | Só links/ids — [security-evidence.md](security-evidence.md) |
| **Root cause** | Pode permanecer Unknown enquanto aberto |
| **Follow-ups** | Vulnerabilities, exceptions, debt, mudanças de control |

Use [templates/security-incident.md](templates/security-incident.md) quando um registro dedicado de segurança ajudar; caso contrário estenda [templates/incident.md](templates/incident.md) com Type = Segurança / Both.

## Roles

Alinhe a [security-ownership.md](security-ownership.md) e [operational-ownership.md](operational-ownership.md):

| Role | Duty (typical) |
| --- | --- |
| Incident lead | Coordena a response geral |
| Segurança owner / specialist | Containment, evidence integrity, assessment de exposure |
| Technical / service owner | Mudanças no system, recovery |
| Communicator | Updates a stakeholders quando usado |

Times pequenos combinam roles — diga isso.

## Secret Exposure

Vazamento de credential ou secret é um security incident (frequentemente **Both** se houver impacto de service). Siga [secret-exposure.md](secret-exposure.md): detect → contain → rotate/revoke → assess → root cause — **nunca** registre valores secretos em docs ou tickets quando evitável.

## Anti-Patterns

- Tratar todo spike de failed login como security incident sem triage.
- Pular containment para caçar root cause enquanto a exposure continua.
- Colar tokens, keys ou dumps completos de dados pessoais no incident doc.
- Inventar classifications regulatórias de breach que o projeto não usa.

## Documentos relacionados

- [incident-management.md](incident-management.md)
- [incident-severity.md](incident-severity.md)
- [incident-timeline.md](incident-timeline.md)
- [post-incident-review.md](post-incident-review.md)
- [corrective-actions.md](corrective-actions.md)
- [security-monitoring.md](security-monitoring.md)
- [security-evidence.md](security-evidence.md)
- [operations-security.md](operations-security.md)
