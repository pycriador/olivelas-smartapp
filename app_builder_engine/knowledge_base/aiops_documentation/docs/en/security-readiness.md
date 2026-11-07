# Security Readiness

> Language: EN | [Português (pt-BR)](../pt-BR/security-readiness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to decide whether a service or capability is **ready from a security perspective** to operate in a shared or production environment.

Security readiness is not a marketing or compliance badge. It asks: *Do we know what to protect, what can go wrong, what controls exist, how we detect and respond, and what remains explicitly accepted?*

Companion to [operational-readiness.md](operational-readiness.md) — a system may be operationally ready and still not security-ready (or the reverse). Assess both when launching.

## Readiness Lens

| Area | Question |
| --- | --- |
| Scope & ownership | Is security scope and ownership clear? — [security-scope.md](security-scope.md), [security-ownership.md](security-ownership.md) |
| Assets & classification | Are material assets and data classes known? — [security-assets.md](security-assets.md), [security-classification.md](security-classification.md) |
| Threats & risk | Are critical-path threats and risks considered? — [threat-modeling.md](threat-modeling.md), [security-risk-model.md](security-risk-model.md) |
| Identity & access | Are authn/authz and least privilege documented? — [identity.md](identity.md), [authorization.md](authorization.md) |
| Secrets & data | Are secrets and sensitive data handling defined? — [secrets-management.md](secrets-management.md), [data-security.md](data-security.md) |
| Architecture & contracts | Trust boundaries and contract security linked? — [security-architecture.md](security-architecture.md), [contract-security.md](contract-security.md) |
| Detection & response | Security monitoring and incident path usable? — [security-monitoring.md](security-monitoring.md), [security-incidents.md](security-incidents.md) |
| Vulnerabilities & exceptions | Open vulns/exceptions owned with expiration? — [vulnerability-management.md](vulnerability-management.md), [security-exceptions.md](security-exceptions.md) |
| Evidence | Material controls have evidence or honest Unknown? — [security-evidence.md](security-evidence.md) |

Use the item checklist: [security-readiness-checklist.md](security-readiness-checklist.md).

## Outcomes

| Outcome | Meaning |
| --- | --- |
| **Ready** | Material gaps closed or accepted with explicit risk / debt |
| **Conditionally ready** | Time-boxed [security exceptions](security-exceptions.md) with owners |
| **Not ready** | Blockers remain; do not imply production security readiness |

Mark unknowns as **Unknown** / **Not Defined**. Do not invent controls, permissions, scanners, or compliance attestations to “pass” readiness.

## Progressive Disclosure

| Project size | Bar |
| --- | --- |
| Small | Owner, assets at edge, authn/authz summary, secrets rule, how to report an incident |
| Medium | Threat notes for critical paths, monitoring/response links, vuln/exception ownership |
| Large | Full readiness lens, evidence for material controls, periodic review |

## Related Documents

- [security-readiness-checklist.md](security-readiness-checklist.md)
- [security-checklist.md](security-checklist.md)
- [operational-readiness.md](operational-readiness.md)
- [security-debt.md](security-debt.md)
- [security-model.md](security-model.md)
- [templates/security.md](templates/security.md)
