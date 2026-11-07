# Security Documentation Checklist

> Language: EN | [Português (pt-BR)](../pt-BR/security-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Practical checklist for **security documentation** quality. Use what applies — small projects are not expected to tick every item.

Classify uncertain claims (Confirmed / Inferred / Unknown / Proposed). Prefer current state over aspirational security theater. Do not invent controls, permissions, compliance, or vulnerabilities.

## Model and Ownership

- [ ] Security loop understood ([security-model.md](security-model.md))
- [ ] Scope in/out clear ([security-scope.md](security-scope.md))
- [ ] Security ownership defined ([security-ownership.md](security-ownership.md))
- [ ] Overview template or equivalent exists for material systems ([templates/security.md](templates/security.md))

## Assets, Threats, Risk

- [ ] Classification model documented or mapped ([security-classification.md](security-classification.md))
- [ ] Material assets catalogued or summarized ([security-assets.md](security-assets.md), [templates/security-asset.md](templates/security-asset.md))
- [ ] Threat modeling approach applied where valuable ([threat-modeling.md](threat-modeling.md), [templates/threat.md](templates/threat.md))
- [ ] Attack surface summarized or Unknown ([attack-surface.md](attack-surface.md))
- [ ] Risks recorded with confidence/residual notes ([security-risk-model.md](security-risk-model.md), [templates/security-risk.md](templates/security-risk.md))

## Requirements and Controls

- [ ] Security requirements identified for critical paths ([security-requirements.md](security-requirements.md), [templates/security-requirement.md](templates/security-requirement.md))
- [ ] Controls classified (preventive/detective/corrective/compensating) ([security-controls.md](security-controls.md), [templates/security-control.md](templates/security-control.md))
- [ ] Exceptions complete when used (requirement/reason/risk/compensating/owner/approval/expiration) ([security-exceptions.md](security-exceptions.md))

## Identity, Data, Secrets

- [ ] Authentication vs authorization clear ([identity.md](identity.md))
- [ ] Authn/authz documented or Unknown ([authentication.md](authentication.md), [authorization.md](authorization.md))
- [ ] Least privilege / privileged access addressed ([least-privilege.md](least-privilege.md), [privileged-access.md](privileged-access.md))
- [ ] Secrets: no values in docs ([secrets-management.md](secrets-management.md))
- [ ] Data security / encryption / retention honest ([data-security.md](data-security.md), [encryption.md](encryption.md), [data-retention.md](data-retention.md))
- [ ] Secure logging / auditability stated ([secure-logging.md](secure-logging.md), [auditability.md](auditability.md))

## Architecture, Contracts, Operations

- [ ] Security architecture links trust/identity/access/data/controls/exposure/deps — no diagram duplication ([security-architecture.md](security-architecture.md))
- [ ] Trust boundaries aligned with architecture docs ([trust-boundaries.md](trust-boundaries.md))
- [ ] Contract security topics covered by reference ([contract-security.md](contract-security.md))
- [ ] Shared ops mechanisms documented once ([operations-security.md](operations-security.md))

## Vulnerabilities, Testing, Incidents

- [ ] Vulnerability lifecycle Defined or Not Defined ([vulnerability-management.md](vulnerability-management.md))
- [ ] Security testing strategies documented conceptually as used ([security-testing.md](security-testing.md))
- [ ] Security monitoring distinct or marked Both with ops ([security-monitoring.md](security-monitoring.md))
- [ ] Security incidents integrate with operations incidents ([security-incidents.md](security-incidents.md))
- [ ] Evidence integrity principles followed ([security-evidence.md](security-evidence.md))

## Dependencies and Development

- [ ] Dependency security considered ([dependency-security.md](dependency-security.md))
- [ ] Supply-chain security notes proportionate ([supply-chain-security.md](supply-chain-security.md))
- [ ] Secure development expectations proportionate ([secure-development.md](secure-development.md))

## Drift, Debt, Readiness

- [ ] Security drift can be registered ([security-drift.md](security-drift.md))
- [ ] Security debt register usable ([security-debt.md](security-debt.md))
- [ ] Security readiness considered for launches ([security-readiness-checklist.md](security-readiness-checklist.md))
- [ ] No secrets in security docs
- [ ] Architecture, contract, and ops links used instead of duplicated prose

## How to Use

| Situation | Use |
| --- | --- |
| New service | Walk Model → Assets/Threats → Identity/Secrets → Detection/Response |
| Security doc review | Use as review backbone |
| Post-incident | Re-check Incidents, Evidence, Controls that failed |
| AI-generated security docs | Pair with [ai-documentation.md](ai-documentation.md) security rules |

Unchecked material items should become security or documentation debt — not silent Confirmed gaps.

## Related Documents

- [security-readiness-checklist.md](security-readiness-checklist.md)
- [security/README.md](security/README.md)
- [quality-model.md](quality-model.md)
- [documentation-checklist.md](documentation-checklist.md)
- [architecture-checklist.md](architecture-checklist.md)
- [contract-checklist.md](contract-checklist.md)
- [operations-checklist.md](operations-checklist.md)
