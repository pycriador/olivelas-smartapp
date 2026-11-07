# Operations Security

> Language: EN | [Português (pt-BR)](../pt-BR/operations-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **security concerns in operations** — privileged runtime access, secure handling during incidents, and shared control mechanisms — without duplicating the full operations methodology.

Operations owns runbooks, deploy, recover, and operational monitoring ([operations-model.md](operations-model.md)). Security owns threats, controls, and evidence. **Shared mechanisms are documented once** and linked from both sides.

## Document Shared Mechanisms Once

| Mechanism | Document once in… | Link from… |
| --- | --- | --- |
| Health / latency monitors | [monitoring.md](monitoring.md) | [security-monitoring.md](security-monitoring.md) when also security-relevant |
| Actionable alerts | [alerting.md](alerting.md), [templates/alert.md](templates/alert.md) | [templates/security-alert.md](templates/security-alert.md) when security-specific |
| Incident lifecycle | [incident-management.md](incident-management.md) | [security-incidents.md](security-incidents.md) for type Security/Both |
| Deploy / rollback | [deployment-operations.md](deployment-operations.md), [rollback.md](rollback.md) | Supply-chain and change security notes |
| Secrets for runtime | [secrets-management.md](secrets-management.md) | Runbooks (name/purpose/source only) |
| Privileged break-glass | [privileged-access.md](privileged-access.md) | Ops runbooks that use it |
| Audit logs | [auditability.md](auditability.md), [secure-logging.md](secure-logging.md) | Evidence and investigations |

Do not maintain two conflicting copies of the same procedure.

## Operational Security Topics

| Topic | What to capture |
| --- | --- |
| **Privileged operations** | Who can perform destructive or high-privilege ops; approval if any |
| **Secure runbooks** | No secrets in steps; placeholders only — [runbooks/README.md](runbooks/README.md) |
| **Incident containment** | How ops actions support security containment when type is Security/Both |
| **Change risk** | Security impact of Planned vs Emergency change — [change-management.md](change-management.md) |
| **Access to prod telemetry** | Who can see logs/metrics that may contain sensitive data |
| **Recovery vs integrity** | Restore paths that could roll back to compromised state — note verification |

## Integration with operations artifacts

| Ops artifact | Security overlay |
| --- | --- |
| Service profile | Link security owner / critical data classes when relevant |
| Runbook | Safety notes for privilege and secret handling |
| Alert | Security purpose and routing when applicable |
| Incident record | Type Operational / Security / Both |
| PIR / corrective actions | Feed controls, vulns, exceptions, debt |

## Rules

- Prefer **Not Defined** over invented break-glass or SIEM processes.
- Never embed credentials, private keys, or unnecessary PII in ops or security docs.
- AI must not invent IAM roles, permissions, or cluster paths — [ai-documentation.md](ai-documentation.md).

## Related Documents

- [operations-model.md](operations-model.md)
- [operational-ownership.md](operational-ownership.md)
- [security-ownership.md](security-ownership.md)
- [security-monitoring.md](security-monitoring.md)
- [security-incidents.md](security-incidents.md)
- [privileged-access.md](privileged-access.md)
- [secrets-management.md](secrets-management.md)
