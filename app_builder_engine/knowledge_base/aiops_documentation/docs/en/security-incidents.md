# Security Incidents

> Language: EN | [Português (pt-BR)](../pt-BR/security-incidents.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **security incidents** and how they relate to operational incidents.

Do not invent a parallel incident bureaucracy when the project already has one. Extend [incident-management.md](incident-management.md) with security classification, containment, and evidence rules.

## Incident Types

| Type | Meaning | Primary lens |
| --- | --- | --- |
| **Operational** | Availability, performance, capacity, dependency failure affecting users | Reliability / ops |
| **Security** | Confidentiality, integrity, authenticity, unauthorized access, abuse, exposure | Security |
| **Both** | Security event with user/service impact (or ops event revealing security failure) | Coordinate both owners |

Record the type explicitly. Dual-type incidents need both operational mitigation and security containment when applicable.

## Lifecycle Integration

Reuse the operational lifecycle; add security emphasis:

```text
Detection → Triage (type + severity) → Containment → Eradication / Mitigation → Recovery → Communication → Post-Incident Review
```

| Stage | Security emphasis |
| --- | --- |
| **Detection** | Security monitoring, alerts, reports, anomaly — [security-monitoring.md](security-monitoring.md) |
| **Triage** | Operational vs Security vs Both; severity; whether credentials/data are at risk |
| **Containment** | Limit blast radius (revoke, isolate, disable, rotate references — never paste secret values) |
| **Eradication / Mitigation** | Remove cause or reduce risk; may open vulnerabilities / exceptions |
| **Recovery** | Restore service safely; validate integrity |
| **Communication** | Per project policy — do not invent legal/notification obligations |
| **PIR** | Blameless learning — [post-incident-review.md](post-incident-review.md); feed threats, controls, debt |

Timeline rules remain: `FACT` / `HYPOTHESIS` / `CONFIRMED` / `UNKNOWN` — [incident-timeline.md](incident-timeline.md).

## What to Document

| Field | Meaning |
| --- | --- |
| **ID** | Project incident id (security-specific prefix optional — [standards.md](standards.md)) |
| **Type** | Operational / Security / Both |
| **Summary** | What happened (no secrets/PII dumps) |
| **Assets affected** | [security-assets.md](security-assets.md) |
| **Impact** | Confidentiality / Integrity / Availability / other — what is known |
| **Severity** | Project model — [incident-severity.md](incident-severity.md) |
| **Containment actions** | What was done to limit harm |
| **Evidence refs** | Links/ids only — [security-evidence.md](security-evidence.md) |
| **Root cause** | May remain Unknown while open |
| **Follow-ups** | Vulnerabilities, exceptions, debt, control changes |

Use [templates/security-incident.md](templates/security-incident.md) when a dedicated security record helps; otherwise extend [templates/incident.md](templates/incident.md) with Type = Security / Both.

## Roles

Align with [security-ownership.md](security-ownership.md) and [operational-ownership.md](operational-ownership.md):

| Role | Duty (typical) |
| --- | --- |
| Incident lead | Coordinates overall response |
| Security owner / specialist | Containment, evidence integrity, exposure assessment |
| Technical / service owner | System changes, recovery |
| Communicator | Stakeholder updates when used |

Small teams combine roles — say so.

## Secret Exposure

Credential or secret leakage is a security incident (often **Both** if service impact). Follow [secret-exposure.md](secret-exposure.md): detect → contain → rotate/revoke → assess → root cause — **never** record secret values in docs or tickets when avoidable.

## Anti-Patterns

- Treating every failed login spike as a security incident without triage.
- Skipping containment to chase root cause while exposure continues.
- Pasting tokens, keys, or full personal data dumps into the incident doc.
- Inventing regulatory breach classifications the project does not use.

## Related Documents

- [incident-management.md](incident-management.md)
- [incident-severity.md](incident-severity.md)
- [incident-timeline.md](incident-timeline.md)
- [post-incident-review.md](post-incident-review.md)
- [corrective-actions.md](corrective-actions.md)
- [security-monitoring.md](security-monitoring.md)
- [security-evidence.md](security-evidence.md)
- [operations-security.md](operations-security.md)
