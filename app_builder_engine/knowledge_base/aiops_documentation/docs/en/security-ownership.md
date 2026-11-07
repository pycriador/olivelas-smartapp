# Security Ownership

> Language: EN | [Português (pt-BR)](../pt-BR/security-ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Who is accountable for security outcomes, decisions, and response for a system.

This extends [ownership.md](ownership.md) (documentation ownership) and integrates with [operational-ownership.md](operational-ownership.md) (runtime and incident accountability). Doc owner, operational owner, and security owner **may be the same team** — or different. State each when they differ.

## Roles

The same team, squad, or role **may hold multiple roles**. Do not invent separate people for every column.

| Role | Meaning |
| --- | --- |
| **Security owner** | Accountable for security posture of the system: requirements, controls adequacy, exceptions, threat-model currency |
| **System owner** | Accountable for the capability end-to-end (product/technical outcome); often same as service owner |
| **Technical owner** | Accountable for implementation, architecture fitness, and technical security controls in code/config |
| **Data owner** | Accountable for data class decisions, retention intent, and who may process the data |
| **Operational owner** | Accountable for day-to-day operability: signals, runbooks, readiness — see [operational-ownership.md](operational-ownership.md) |
| **Incident owner** | Accountable for coordinating response when a security-relevant or operational incident occurs (may hand off by type) |

Prefer durable identifiers (team / squad / role), not personal names that vanish after a reorg. See [ownership.md](ownership.md).

## Suggested Inventory

| Component / service | Security | System | Technical | Data | Operational | Incident | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

Mark **Not Defined** when a role is intentionally unset (small projects often collapse roles into one team). Mark **Not Applicable** when a role does not make sense.

## Responsibilities Snapshot

| Role | Typical duties |
| --- | --- |
| Security owner | Keep threat model and requirements honest; accept or escalate residual risk; track exceptions |
| System owner | Prioritize security work; accept risk trade-offs at product level |
| Technical owner | Implement and verify controls; keep architecture/security docs aligned with reality |
| Data owner | Classify data; define retention intent when known; approve unusual processing |
| Operational owner | Ensure monitoring/alerting/runbooks cover security-relevant failures where applicable |
| Incident owner | Drive Detection → Response → Recovery coordination; escalate; preserve evidence integrity |

## Integration with Other Ownership

| Concern | Document / field |
| --- | --- |
| Who maintains the *security doc* | `owner` in frontmatter — [ownership.md](ownership.md) |
| Who owns the *service at runtime* | [operational-ownership.md](operational-ownership.md) |
| Who owns a *contract* | [contract-ownership.md](contract-ownership.md) |
| Who owns *architecture accuracy* | Architecture doc `owner` + [architecture-review.md](architecture-review.md) |
| Who owns *security posture* | This document / project security inventory |

When security ownership changes, update this inventory in the same change that transfers responsibility.

## Anti-Patterns

- Listing a person with no team backup as the only security owner of a Critical system.
- Claiming incident ownership that does not exist on-call.
- Leaving data owner blank when Confidential or Restricted data is processed.
- Separating doc, ops, and security owners without any of them knowing the others exist.

## Related Documents

- [ownership.md](ownership.md)
- [operational-ownership.md](operational-ownership.md)
- [security-model.md](security-model.md)
- [security-scope.md](security-scope.md)
- [incident-management.md](incident-management.md)
- [contract-ownership.md](contract-ownership.md)
