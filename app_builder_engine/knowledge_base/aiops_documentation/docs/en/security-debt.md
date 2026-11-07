# Security Debt

> Language: EN | [Português (pt-BR)](../pt-BR/security-debt.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to distinguish and register **security debt** versus other debt kinds.

## Debt Kinds (Keep Them Distinct)

| Kind | Meaning | Typical example |
| --- | --- | --- |
| **Technical debt** | Implementation quality / shortcuts in code or config | Missing tests, fragile module |
| **Architecture debt** | Structural/decision cost — [architecture-debt.md](architecture-debt.md) | Shared writable DB coupling |
| **Contract debt** | Missing/wrong interface rules — [contract-debt.md](contract-debt.md) | Undocumented authz on an API |
| **Documentation debt** | Missing/wrong/stale docs — [documentation-debt.md](documentation-debt.md) | No threat model write-up |
| **Reliability debt** | Operability/reliability risk — [reliability-debt.md](reliability-debt.md) | No alert on critical path |
| **Security debt** | Accepted or unnoticed **security risk** in assets, controls, identity, data, or detection/response | Over-privileged service account; untracked exception; no secret rotation path |

They often co-exist. Register each under the right kind so remediation targets the right artifact.

## When Something Is Security Debt

Treat as security debt when the issue is primarily about:

- missing or weak controls for material threats;
- over-privilege or broken least-privilege expectations;
- secrets/data handling gaps;
- untracked or expired security exceptions;
- known vulnerabilities without remediation/acceptance;
- security monitoring/response gaps for material risks;
- supply-chain or dependency trust gaps that are security-primary.

Do **not** label every bug or missing unit test as security debt. Do **not** label pure availability gaps as security debt when confidentiality/integrity/auth are unaffected — that may be reliability debt.

## How to Register

| Field | Meaning |
| --- | --- |
| **ID** | Stable id (e.g. `SECDEBT-014`) |
| **Description** | What security gap exists |
| **Impact** | Asset, threat, blast radius, residual risk if known |
| **Owner** | Accountable team/role |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Optional: linked vulnerability, exception, threat, control, incident, architecture/contract debt IDs.

## Priority Guidance

| Priority | Guidance |
| --- | --- |
| **High** | Material exposure or privilege abuse path; repeated security incidents; critical asset unprotected |
| **Medium** | Meaningful control/detection gap; workarounds or partial compensating controls exist |
| **Low** | Hardening preference; low blast radius |

`Accepted Risk` requires explicit owner acknowledgment — not neglect. Temporary acceptance should prefer a tracked [security exception](security-exceptions.md) with expiration when a requirement is still formally owed.

## Related Documents

- [security-drift.md](security-drift.md)
- [security-exceptions.md](security-exceptions.md)
- [vulnerability-management.md](vulnerability-management.md)
- [security-risk-model.md](security-risk-model.md)
- [security-readiness.md](security-readiness.md)
- [reliability-debt.md](reliability-debt.md)
