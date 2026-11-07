# Security Model

> Language: EN | [Português (pt-BR)](../pt-BR/security-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **security** as a continuous loop — not a one-time checklist or a compliance label.

This methodology is technology-agnostic. It integrates with [Architecture](architecture-model.md) (structure, trust boundaries, data flows), [Contracts](contract-model.md) (authn/authz at interfaces, sensitive fields), and [Operations](operations-model.md) (monitoring, incident response, recovery). Architecture describes *what exists*; contracts describe *interaction rules*; operations describe *how the system is run*; security docs describe *what must be protected, from what, how, and with what evidence*.

Do **not** invent certifications, regulatory mappings, or control frameworks the project does not use. Prefer **Unknown** or **Not Defined** over fabricated compliance claims.

## Core Concepts

Use these terms precisely. Do not treat them as synonyms.

| Concept | Meaning | Typical documentation focus |
| --- | --- | --- |
| **Asset** | Something of value that the system creates, stores, processes, or depends on | Data classes, identities, keys (by reference), services, integrity of processes |
| **Threat** | A potential adverse action or condition against an asset | Who/what could harm the asset and how |
| **Vulnerability** | A weakness that a threat could exploit | Missing control, misconfiguration, design gap — mark certainty |
| **Risk** | The combination of a threat acting on an asset (optionally via a vulnerability), with estimated consequence | Likelihood, impact, severity, residual risk |
| **Requirement** | A security obligation the system or process must meet | Authn, authz, confidentiality, integrity, availability, privacy, auditability |
| **Control** | A measure that reduces risk or enforces a requirement | Preventive, detective, corrective, compensating |
| **Evidence** | Observable proof that a control or requirement is met | Logs (without secrets/PII), configs by name, tests, reviews — never secret values |

## Security Loop

```text
Assets → Threats → Risk → Requirements → Controls → Evidence → Monitoring → Response → Review
    ↑                                                                              │
    └──────────────────────────────────────────────────────────────────────────────┘
```

| Stage | Question | Typical artifacts |
| --- | --- | --- |
| **Assets** | What must we protect? | [security-assets.md](security-assets.md), [security-classification.md](security-classification.md) |
| **Threats** | What could go wrong, and who/what drives it? | [threat-modeling.md](threat-modeling.md), [threat-actors.md](threat-actors.md), [attack-surface.md](attack-surface.md) |
| **Risk** | How severe is it, and what residual remains? | [security-risk-model.md](security-risk-model.md) |
| **Requirements** | What must be true? | [security-requirements.md](security-requirements.md) |
| **Controls** | How do we enforce or reduce? | [security-controls.md](security-controls.md), [identity.md](identity.md), [secrets-management.md](secrets-management.md) |
| **Evidence** | How do we know controls work? | [security-evidence.md](security-evidence.md) — no secrets in docs |
| **Monitoring** | How do we detect security-relevant signals? | [security-monitoring.md](security-monitoring.md); link [monitoring.md](monitoring.md) |
| **Response** | What do we do when something goes wrong? | [security-incidents.md](security-incidents.md), [incident-management.md](incident-management.md), [secret-exposure.md](secret-exposure.md) |
| **Review** | What did we learn and what must change? | Threat model refresh, ownership, exceptions expiration, docs/architecture/contract updates |

Stages may overlap. Document the loop the project actually uses; do not invent process that does not exist.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Scope, ownership, main assets, edge trust boundary, authn/authz summary, secrets handling rule |
| Medium | Threat model for critical paths, risk notes, key controls, logging/audit expectations |
| Large / distributed | Full asset catalog, attack surface, risk model, control inventory, exception process, periodic review |

## Integration Points

| Area | Link |
| --- | --- |
| System and trust edges | [system-boundaries.md](system-boundaries.md), [trust-boundaries.md](trust-boundaries.md) |
| Architecture structure | [architecture-model.md](architecture-model.md), [failure-domains.md](failure-domains.md) |
| Interface auth and sensitive data | [contract-model.md](contract-model.md), contracts category |
| Runtime detect/respond | [operations-model.md](operations-model.md), [incident-management.md](incident-management.md), [monitoring.md](monitoring.md) |
| Documentation ownership | [ownership.md](ownership.md), [security-ownership.md](security-ownership.md) |
| No secrets in docs | [standards.md](standards.md), [secrets-management.md](secrets-management.md) |

Prefer links over copying architecture diagrams, contract schemas, or runbooks into security prose.

## Certainty

Classify security claims as Confirmed / Inferred / Unknown / Proposed ([standards.md](standards.md)). Prefer **Confirmed** evidence before accepting security documents. Prefer **Unknown** or **Not Defined** over invented controls, retention periods, or compliance statements.

## Related Documents

- [security-scope.md](security-scope.md)
- [security-ownership.md](security-ownership.md)
- [threat-modeling.md](threat-modeling.md)
- [security-requirements.md](security-requirements.md)
- [security-controls.md](security-controls.md)
- [security-evidence.md](security-evidence.md)
- [security-monitoring.md](security-monitoring.md)
- [security-incidents.md](security-incidents.md)
- [security-architecture.md](security-architecture.md)
- [security-readiness.md](security-readiness.md)
- [security-checklist.md](security-checklist.md)
- [security/README.md](security/README.md)
- [standards.md](standards.md)
