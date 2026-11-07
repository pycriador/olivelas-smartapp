# Auditability

> Language: EN | [Português (pt-BR)](../pt-BR/auditability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document the ability to **reconstruct who did what, to which asset, and when** — for security-relevant actions.

Auditability is a requirement area ([security-requirements.md](security-requirements.md)) supported by controls and [secure-logging.md](secure-logging.md). It is not the same as verbose debug logging.

## Purpose

Answer:

> Which actions must be attributable, what evidence is produced, who can access it, and how long it is kept?

## Typical Auditable Events (Examples)

| Event class | Why it matters |
| --- | --- |
| Authentication success/failure (material) | Account abuse, credential stuffing signals |
| Authorization denials on Critical actions | Probing and misconfiguration |
| Privileged access and elevation | Misuse detection — [privileged-access.md](privileged-access.md) |
| Changes to security controls or policies | Integrity of the control plane |
| Access to Restricted data | Confidentiality investigations |
| Secret/key admin operations | Custody — names only in docs |
| Deployments that change production | Link [deployment-operations.md](deployment-operations.md), [change-management.md](change-management.md) |

Select events that matter for the project. Mark others Not Applicable.

## Suggested Record

| Field | Meaning |
| --- | --- |
| **Event** | Action to record |
| **Logged?** | yes / no / Unknown |
| **Where** | System/store name |
| **Attribution fields** | Actor id, action, target, time — no secrets/PII beyond necessity |
| **Integrity notes** | Append-only / controlled admin — or Not Defined |
| **Retention** | Or Not Defined |
| **Access** | Who may read audit data |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| Event | Logged? | Where | Attribution | Retention | Access | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Evidence Quality

| Quality concern | Guidance |
| --- | --- |
| Completeness | Gaps are Unknown, not silent |
| Integrity | Note if administrators can alter history without trace |
| Confidentiality of audit stores | Audit logs often become Confidential |
| Correlation | Prefer stable ids over personal data |

Never store secret values in audit documentation examples.

## Integration

| Area | Link |
| --- | --- |
| Secure logging constraints | [secure-logging.md](secure-logging.md) |
| Incident evidence | [incident-timeline.md](incident-timeline.md), [incident-management.md](incident-management.md) |
| Contracts | Error and auth outcomes peers observe vs internal audit events |
| Operations observability | [observability-model.md](observability-model.md) — metrics ≠ audit trail |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Privileged and auth-critical actions: logged or explicitly Unknown |
| Medium | Inventory with retention and access |
| Large | Integrity notes, control-plane changes, Restricted data access |

## Anti-Patterns

- Claiming “full audit trail” without an event list.
- Debug logs used as the only audit mechanism without attribution fields.
- Audit stores writable by the same broad roles they are meant to monitor, undocumented.
- Inventing compliance audit requirements.

## Related Documents

- [secure-logging.md](secure-logging.md)
- [security-requirements.md](security-requirements.md)
- [privileged-access.md](privileged-access.md)
- [security-controls.md](security-controls.md)
- [incident-management.md](incident-management.md)
