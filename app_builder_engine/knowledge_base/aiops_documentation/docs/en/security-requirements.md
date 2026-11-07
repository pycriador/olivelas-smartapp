# Security Requirements

> Language: EN | [Português (pt-BR)](../pt-BR/security-requirements.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects state **security obligations** the system or process must meet.

Requirements describe *what must be true*. Controls describe *how* — see [security-controls.md](security-controls.md). Keep requirements technology-agnostic unless a specific mechanism is an accepted project constraint (document as such).

Do not invent regulatory or certification requirements. Prefer **Not Applicable** or **Not Defined** when none exist.

## Purpose

Trace from risks and assets to enforceable expectations:

```text
Assets / Threats / Risks → Requirements → Controls → Evidence
```

## Requirement Areas (Non-Exhaustive)

| Area | Question | Related docs |
| --- | --- | --- |
| **Authentication** | How is identity established at each material entry? | [authentication.md](authentication.md), [identity.md](identity.md) |
| **Authorization** | What is each identity allowed to do? | [authorization.md](authorization.md), [least-privilege.md](least-privilege.md) |
| **Confidentiality** | Who may read or obtain sensitive data? | [data-security.md](data-security.md), [encryption.md](encryption.md) |
| **Integrity** | How is unauthorized modification prevented or detected? | [security-controls.md](security-controls.md), [auditability.md](auditability.md) |
| **Availability** | What security-relevant availability obligations exist? | [service-levels.md](service-levels.md), [criticality.md](criticality.md) |
| **Privacy** | What privacy expectations apply (without assuming legislation)? | [privacy.md](privacy.md) |
| **Auditability** | What security-relevant actions must be attributable? | [auditability.md](auditability.md), [secure-logging.md](secure-logging.md) |
| **Secrets** | How must credentials and keys be handled? | [secrets-management.md](secrets-management.md) |
| **Privileged access** | How is elevation governed? | [privileged-access.md](privileged-access.md) |

Projects may add areas (e.g. non-repudiation, secure deletion) when they are real obligations.

## Suggested Requirement Record

| Field | Meaning |
| --- | --- |
| **ID** | Stable short id |
| **Statement** | Testable obligation (“must / must not”) |
| **Area** | Authn, authz, … |
| **Rationale** | Asset, threat, or risk link |
| **Applies to** | Components, interfaces, environments |
| **Controls** | Implementing controls (links) |
| **Evidence** | How fulfillment is shown |
| **Status** | required / deferred / Not Applicable / Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| ID | Statement | Area | Applies to | Controls | Evidence | Status | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Contract and Architecture Links

- Interface-level authn/authz and sensitive fields belong in or link from [contracts](contract-model.md).
- Structural placement of obligations should align with [architecture-model.md](architecture-model.md) and [trust-boundaries.md](trust-boundaries.md).
- Operational detection of requirement failure links to [monitoring.md](monitoring.md) and [alerting.md](alerting.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Authn/authz + secrets + data confidentiality for the main path |
| Medium | Inventory covering privilege, audit, and Critical interfaces |
| Large | Traceability from risks to requirements to controls to evidence |

## Anti-Patterns

- Requirements that only name a product (“must use Vendor X”) with no obligation statement.
- Unverifiable slogans (“be secure”).
- Copying external framework control IDs as if they were project requirements without adoption.
- Mixing requirement and implementation detail until neither is clear.

## Related Documents

- [security-model.md](security-model.md)
- [security-controls.md](security-controls.md)
- [security-risk-model.md](security-risk-model.md)
- [identity.md](identity.md)
- [data-security.md](data-security.md)
