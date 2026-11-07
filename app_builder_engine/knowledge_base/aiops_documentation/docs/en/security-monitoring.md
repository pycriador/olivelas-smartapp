# Security Monitoring

> Language: EN | [Português (pt-BR)](../pt-BR/security-monitoring.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **security monitoring** — watching for security-relevant signals — without duplicating operational monitoring guidance.

Operational monitoring asks: *Is the system healthy and meeting user expectations?*  
Security monitoring asks: *Are we seeing abuse, misuse, control failure, or compromise indicators?*

Both may share telemetry. Document the **security purpose** separately when the signal drives a security decision.

## Security vs Operational Monitoring

| Aspect | Operational monitoring | Security monitoring |
| --- | --- | --- |
| Primary question | Health, capacity, user impact | Threat, abuse, control failure, exposure |
| Typical signals | Latency, error rate, saturation, dependency health | Auth failures, privilege anomalies, secret access, policy violations, integrity checks |
| Typical action | Scale, rollback, runbook, incident | Investigate, contain, revoke, exception review, security incident |
| Owner | Often ops / service owner | Security owner and/or service owner — [security-ownership.md](security-ownership.md) |

The same metric can serve both purposes. Record both purposes when that happens; do not invent a separate monitor that does not exist.

Link operational inventory to [monitoring.md](monitoring.md). Prefer one inventory with a **Purpose** column (`Operational` / `Security` / `Both`) over duplicated dashboards in docs.

## What to Document per Security Monitor

| Field | Question |
| --- | --- |
| **What** | Signal or check being watched |
| **Why (security)** | Threat, control, or requirement it supports |
| **Source** | Where the data comes from |
| **Frequency** | How often evaluated |
| **Threshold / pattern** | What means “notable” (or qualitative rule) |
| **Owner** | Who maintains the monitor |
| **Action** | Ticket, security alert, containment, log-only review |
| **Linked control / threat** | [security-controls.md](security-controls.md), [threat-modeling.md](threat-modeling.md) |
| **Classification** | Confirmed / Inferred / Unknown / Proposed |

If a field is unknown, write **Not Defined**. If security monitoring is intentionally absent for a non-sensitive tool, **Not Applicable**.

## Suggested Inventory

| What | Why (security) | Source | Frequency | Threshold / pattern | Owner | Action | Purpose |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | Security / Both |

## Good Security Monitoring

- Tied to material threats, controls, or requirements — not every log line.
- Action column is non-empty (even if “weekly review”).
- Distinguishes noise (failed logins from bots) from actionable anomalies when known.
- Never documents secret values or unnecessary PII in examples — [secure-logging.md](secure-logging.md), [security-evidence.md](security-evidence.md).

## Bad Security Monitoring

- “Security dashboard” claimed with no owner or action path.
- Copying operational latency monitors and labeling them security.
- Inventing SIEM / IDS products or rules the project does not use.
- Silent failure of security monitoring itself undocumented.

## Linkage

| If action is… | Also document… |
| --- | --- |
| Page / notify | [templates/security-alert.md](templates/security-alert.md), [alerting.md](alerting.md) |
| Investigate / contain | [security-incidents.md](security-incidents.md) |
| Operational mitigation | [incident-management.md](incident-management.md), [runbooks/README.md](runbooks/README.md) |
| Evidence collection | [security-evidence.md](security-evidence.md) |

## Related Documents

- [monitoring.md](monitoring.md)
- [alerting.md](alerting.md)
- [observability-model.md](observability-model.md)
- [security-model.md](security-model.md)
- [operations-security.md](operations-security.md)
- [auditability.md](auditability.md)
