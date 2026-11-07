# Security

> Language: EN | [Português (pt-BR)](../../pt-BR/security/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Category for security documentation in adopting projects, plus the Security methodology defined by this standard.

## Objective

Describe what must be protected, from what, how, and with what evidence — without inventing controls, permissions, compliance certifications, or vulnerabilities.

## Integration

```text
Architecture (structure, trust, data flows)
        │
        ├── Contracts (authn/authz, sensitive fields at boundaries)
        │
        └── Operations (monitor, incident, recover)
                │
                ▼
            Security
```

Prefer links over duplication:

- Architecture owns diagrams and component structure — [../architecture-model.md](../architecture-model.md), [../trust-boundaries.md](../trust-boundaries.md)
- Contracts own interface security rules — [../contract-security.md](../contract-security.md)
- Operations owns runbooks and operational incidents — [../operations-security.md](../operations-security.md), [../security-incidents.md](../security-incidents.md)

## Guidance

- Never store secret values in documentation.
- Document configuration name, purpose, source, and whether it is required.
- Prefer Confirmed evidence for security claims before accepting the document.
- Mark Unknown / Not Defined honestly.
- Do not invent compliance, certifications, or regulatory mappings.

## Methodology (Documentation Standard)

### Model

| Document | Purpose |
| --- | --- |
| [../security-model.md](../security-model.md) | Assets→Threats→Risk→Requirements→Controls→Evidence→Monitoring→Response→Review |
| [../security-scope.md](../security-scope.md) | In / out of scope |
| [../security-ownership.md](../security-ownership.md) | Security / system / technical / data / operational / incident owners |

### Assets

| Document | Purpose |
| --- | --- |
| [../security-classification.md](../security-classification.md) | Data/system classification models |
| [../security-assets.md](../security-assets.md) | Asset catalog guidance |
| [../templates/security-asset.md](../templates/security-asset.md) | Asset template |

### Threats

| Document | Purpose |
| --- | --- |
| [../threat-modeling.md](../threat-modeling.md) | System→Assets→Trust Boundaries→Threats→Risk→Mitigations |
| [../threat-actors.md](../threat-actors.md) | Actor categories (examples) |
| [../attack-surface.md](../attack-surface.md) | Exposed / Internal / Restricted / Unknown |
| [../templates/threat.md](../templates/threat.md) | Threat template |

### Risks

| Document | Purpose |
| --- | --- |
| [../security-risk-model.md](../security-risk-model.md) | Likelihood, impact, severity, confidence, residual risk |
| [../templates/security-risk.md](../templates/security-risk.md) | Risk template |
| [../security-debt.md](../security-debt.md) | Security debt register |
| [../security-drift.md](../security-drift.md) | Documented ≠ actual security |

### Requirements

| Document | Purpose |
| --- | --- |
| [../security-requirements.md](../security-requirements.md) | Authn/authz/confidentiality/integrity/availability/privacy/auditability |
| [../templates/security-requirement.md](../templates/security-requirement.md) | Requirement template |
| [../security-exceptions.md](../security-exceptions.md) | Requirement/reason/risk/compensating/owner/approval/expiration |

### Controls

| Document | Purpose |
| --- | --- |
| [../security-controls.md](../security-controls.md) | Preventive / Detective / Corrective / Compensating |
| [../templates/security-control.md](../templates/security-control.md) | Control template |
| [../security-evidence.md](../security-evidence.md) | Evidence + Evidence Integrity principles |
| [../least-privilege.md](../least-privilege.md) | Least privilege |
| [../privileged-access.md](../privileged-access.md) | Privileged access |
| [../encryption.md](../encryption.md) | Transit / rest / application-level |
| [../key-management.md](../key-management.md) | Key management (conceptual) |

### Identity

| Document | Purpose |
| --- | --- |
| [../identity.md](../identity.md) | Authentication vs Authorization |
| [../authentication.md](../authentication.md) | Authentication mechanisms |
| [../authorization.md](../authorization.md) | What is allowed |

### Data

| Document | Purpose |
| --- | --- |
| [../data-security.md](../data-security.md) | Collection→…→Deletion |
| [../privacy.md](../privacy.md) | Privacy without assumed legislation |
| [../data-retention.md](../data-retention.md) | Retention or Not Defined |
| [../secure-logging.md](../secure-logging.md) | No secrets/PII in logs |
| [../auditability.md](../auditability.md) | Auditability |

### Secrets

| Document | Purpose |
| --- | --- |
| [../secrets-management.md](../secrets-management.md) | Never store secret values |
| [../secret-exposure.md](../secret-exposure.md) | Detection→…→Root Cause |

### Vulnerabilities

| Document | Purpose |
| --- | --- |
| [../vulnerability-management.md](../vulnerability-management.md) | Identify→Close lifecycle |
| [../templates/vulnerability.md](../templates/vulnerability.md) | Vulnerability template |
| [../dependency-security.md](../dependency-security.md) | Dependency security |
| [../supply-chain-security.md](../supply-chain-security.md) | Supply-chain security |
| [../templates/security-exception.md](../templates/security-exception.md) | Exception template |

### Incidents

| Document | Purpose |
| --- | --- |
| [../security-incidents.md](../security-incidents.md) | Operational / Security / Both |
| [../templates/security-incident.md](../templates/security-incident.md) | Security incident template |
| [../security-monitoring.md](../security-monitoring.md) | vs operational monitoring |
| [../templates/security-alert.md](../templates/security-alert.md) | Security alert template |
| [../operations-security.md](../operations-security.md) | Shared ops mechanisms once |

### Testing

| Document | Purpose |
| --- | --- |
| [../security-testing.md](../security-testing.md) | SAST/DAST/etc conceptual |
| [../templates/security-test.md](../templates/security-test.md) | Security test template |
| [../secure-development.md](../secure-development.md) | Secure development lifecycle expectations |

### Architecture and contracts

| Document | Purpose |
| --- | --- |
| [../security-architecture.md](../security-architecture.md) | Trust, Identity, Access, Data Flow, Controls, Exposure, Deps |
| [../trust-boundaries.md](../trust-boundaries.md) | Trust boundaries (architecture + security) |
| [../contract-security.md](../contract-security.md) | Contract boundary security topics |

### Readiness

| Document | Purpose |
| --- | --- |
| [../security-readiness.md](../security-readiness.md) | Security readiness concept |
| [../security-readiness-checklist.md](../security-readiness-checklist.md) | Launch / security-readiness checklist |
| [../security-checklist.md](../security-checklist.md) | Security documentation quality checklist |
| [../templates/security.md](../templates/security.md) | Security overview template |

## Templates (quick list)

| Template | Use for |
| --- | --- |
| [security.md](../templates/security.md) | Security posture overview |
| [security-asset.md](../templates/security-asset.md) | Single asset |
| [threat.md](../templates/threat.md) | Single threat |
| [security-risk.md](../templates/security-risk.md) | Single risk |
| [security-requirement.md](../templates/security-requirement.md) | Single requirement |
| [security-control.md](../templates/security-control.md) | Single control |
| [security-alert.md](../templates/security-alert.md) | Security alert |
| [vulnerability.md](../templates/vulnerability.md) | Vulnerability record |
| [security-exception.md](../templates/security-exception.md) | Security exception |
| [security-incident.md](../templates/security-incident.md) | Security incident |
| [security-test.md](../templates/security-test.md) | Security test strategy/record |

## Related

- [../quality-model.md](../quality-model.md) — security quality dimensions
- [../ai-documentation.md](../ai-documentation.md) — AI security analysis rules
- [../standards.md](../standards.md) — security IDs, severity, evidence naming
- [../operations/README.md](../operations/README.md) — operations methodology
- [../contracts/README.md](../contracts/README.md) — contracts methodology
- [../architecture/README.md](../architecture/README.md) — architecture methodology
