---
title: "Security"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
---

# Security

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Overview of security posture for a system or capability. Use this as an **entry document** that links the security methodology — do not duplicate full threat catalogs, control inventories, or architecture diagrams here.

Methodology index: [../security/README.md](../security/README.md) · Model: [../security-model.md](../security-model.md)

## Scope

| In scope | Out of scope |
| --- | --- |
| | |

See also [../security-scope.md](../security-scope.md).

## Ownership

| Role | Owner |
| --- | --- |
| Security | |
| System / technical | |
| Data | |
| Operational / incident | |

See [../security-ownership.md](../security-ownership.md).

## Assets and Classification

| Asset | Classification | Owner | Notes |
| --- | --- | --- | --- |
| | | | |

Templates: [security-asset.md](security-asset.md) · Guidance: [../security-assets.md](../security-assets.md), [../security-classification.md](../security-classification.md)

## Threat Model

| Threat | Asset affected | Likelihood | Impact | Mitigation | Classification |
| --- | --- | --- | --- | --- | --- |
| | | | | | Confirmed / Inferred / Unknown / Proposed |

Deep dive: [../threat-modeling.md](../threat-modeling.md), [threat.md](threat.md), [../attack-surface.md](../attack-surface.md)

## Risks

| Risk | Severity | Residual | Status | Classification |
| --- | --- | --- | --- | --- |
| | | | open / accepted / mitigated | |

See [../security-risk-model.md](../security-risk-model.md), [security-risk.md](security-risk.md)

## Trust Boundaries

| Boundary | Inside | Outside | Controls |
| --- | --- | --- | --- |
| | | | |

Link architecture diagrams — do not redraw them here. See [../trust-boundaries.md](../trust-boundaries.md), [../security-architecture.md](../security-architecture.md)

## Identity and Access

### Authentication

| Entry point | Mechanism | Classification |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

### Authorization

| Action / resource | Who is allowed | Mechanism | Classification |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown / Not Applicable |

See [../identity.md](../identity.md), [../authentication.md](../authentication.md), [../authorization.md](../authorization.md), [../least-privilege.md](../least-privilege.md)

## Secrets

| Name | Purpose | Source | Required |
| --- | --- | --- | --- |
| | | | yes / no |

<!-- Never record secret values. -->

See [../secrets-management.md](../secrets-management.md), [../secret-exposure.md](../secret-exposure.md)

## Encryption and Data Protection

| Data / channel | At rest | In transit | Classification |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown / Not Applicable |

| Data class | Handling rules | Retention | Classification |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown |

See [../encryption.md](../encryption.md), [../data-security.md](../data-security.md), [../data-retention.md](../data-retention.md)

## Network and Exposure

| Control | Purpose | Classification |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

| Surface | Exposure | Notes |
| --- | --- | --- |
| | Exposed / Internal / Restricted / Unknown | |

See [../attack-surface.md](../attack-surface.md)

## Controls and Requirements

| Requirement | Control | Type | Evidence |
| --- | --- | --- | --- |
| | | Preventive / Detective / Corrective / Compensating | |

See [../security-requirements.md](../security-requirements.md), [../security-controls.md](../security-controls.md), [../security-evidence.md](../security-evidence.md)

## Auditability and Logging

| Event | Logged? | Where | Classification |
| --- | --- | --- | --- |
| | yes / no / Unknown | | |

No secrets/PII in log examples. See [../secure-logging.md](../secure-logging.md), [../auditability.md](../auditability.md)

## Monitoring and Incidents

| Signal | Security purpose | Action |
| --- | --- | --- |
| | | |

| Topic | Link / notes |
| --- | --- |
| Security monitoring | [../security-monitoring.md](../security-monitoring.md) |
| Security incidents | [../security-incidents.md](../security-incidents.md) |
| Vulnerabilities | [../vulnerability-management.md](../vulnerability-management.md) |
| Exceptions | [../security-exceptions.md](../security-exceptions.md) |

## Dependencies and Supply Chain

| Dependency | Trust / privilege notes | Owner |
| --- | --- | --- |
| | | |

See [../dependency-security.md](../dependency-security.md), [../supply-chain-security.md](../supply-chain-security.md)

## Testing and Readiness

| Strategy | In use? | Last executed |
| --- | --- | --- |
| | yes / no / N/A / Not Defined | |

| Readiness outcome | Ready / Conditionally ready / Not ready / Unknown |
| --- | --- |
| Notes | |

See [../security-testing.md](../security-testing.md), [../security-readiness.md](../security-readiness.md), [../secure-development.md](../secure-development.md)

## Security Debt and Drift

| ID | Description | Priority | Status |
| --- | --- | --- | --- |
| | | High / Medium / Low | Open / In Progress / Resolved / Accepted Risk |

See [../security-debt.md](../security-debt.md), [../security-drift.md](../security-drift.md)

## Security Recommendations

| Recommendation | Priority | Classification |
| --- | --- | --- |
| | | Proposed / Confirmed need |

## Related Documentation

| Document | Path |
| --- | --- |
| Security methodology index | [../security/README.md](../security/README.md) |
| Architecture | |
| Contracts (security sections) | [../contract-security.md](../contract-security.md) |
| Operations security | [../operations-security.md](../operations-security.md) |
| ADRs | |
| Checklist | [../security-checklist.md](../security-checklist.md) |
