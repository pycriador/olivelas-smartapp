# Security Exceptions

> Language: EN | [Português (pt-BR)](../pt-BR/security-exceptions.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **time-bounded or explicit deviations** from a security requirement or control.

An exception is not “we forgot.” It is a recorded decision: *we know the gap, why it exists, who owns it, what compensates, and when it ends or is re-reviewed.*

## Required Fields

Every security exception must record:

| Field | Meaning |
| --- | --- |
| **Requirement** | Which security requirement or control is not fully met (ID + link) |
| **Reason** | Why the exception is needed |
| **Risk** | What residual risk remains (link [security-risk-model.md](security-risk-model.md) when useful) |
| **Compensating control** | What reduces risk while the exception is active — or **None** / **Not Defined** |
| **Owner** | Accountable team/role for the exception and its closure |
| **Approval** | Who approved (role/person/process) — or **Not Defined** if no approval process exists |
| **Expiration** | End date or review date — required for temporary exceptions |

Use [templates/security-exception.md](templates/security-exception.md).

## Lifecycle

```text
Request → Assess risk → Approve / Reject → Active → Review → Extend / Close
```

| Stage | Meaning |
| --- | --- |
| **Request** | Exception proposed with requirement and reason |
| **Assess** | Risk and compensating controls evaluated |
| **Approve / Reject** | Explicit decision |
| **Active** | Exception in force; monitoring may apply |
| **Review** | Before expiration or on material change |
| **Extend** | New expiration + re-approval as the project requires |
| **Close** | Requirement met, risk accepted permanently (debt), or scope removed |

Permanent “exceptions” without review are usually [security debt](security-debt.md) or accepted risk — label them honestly.

## Status Vocabulary (Example)

| Status | Meaning |
| --- | --- |
| `Requested` | Submitted |
| `Approved` | Active with approval |
| `Rejected` | Not granted |
| `Expired` | Past expiration; must re-approve or close |
| `Closed` | No longer applicable |
| `Superseded` | Replaced by another exception or control |

## Rules

- Never use an exception to hide unknown security posture — mark **Unknown** instead.
- Compensating controls must be real and documented; do not invent them to “pass” readiness.
- Expiration without owner follow-up becomes [security drift](security-drift.md) / debt.
- Do not invent regulatory waivers or certification exceptions the project does not have.

## Relationship to Other Artifacts

| Related | How |
| --- | --- |
| Vulnerability | May drive a temporary exception while remediating — [vulnerability-management.md](vulnerability-management.md) |
| Security debt | Long-lived accepted gap |
| Security readiness | Conditionally ready may require tracked exceptions — [security-readiness.md](security-readiness.md) |
| Operations | Emergency change may create temporary security exceptions — [change-management.md](change-management.md) |

## Related Documents

- [security-requirements.md](security-requirements.md)
- [security-controls.md](security-controls.md)
- [security-risk-model.md](security-risk-model.md)
- [security-ownership.md](security-ownership.md)
- [security-debt.md](security-debt.md)
- [standards.md](standards.md)
