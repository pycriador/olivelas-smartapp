# Security Readiness Checklist

> Language: EN | [Português (pt-BR)](../pt-BR/security-readiness-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Practical checklist before treating a service as **security-ready** in a shared or production environment. Use what applies — mark N/A consciously.

Prefer current-state evidence over aspirational design. Unchecked material items become [security debt](security-debt.md), [documentation debt](documentation-debt.md), or tracked [exceptions](security-exceptions.md).

## Ownership and Scope

- [ ] Security / system / data owners identifiable ([security-ownership.md](security-ownership.md))
- [ ] Security scope in/out documented or summarized ([security-scope.md](security-scope.md))
- [ ] Escalation for security incidents known or marked Not Defined

## Assets and Data

- [ ] Material assets identified ([security-assets.md](security-assets.md))
- [ ] Data classification model chosen or example mapped ([security-classification.md](security-classification.md))
- [ ] Sensitive data handling summarized ([data-security.md](data-security.md))
- [ ] Retention Defined, N/A, or **Not Defined** ([data-retention.md](data-retention.md))

## Threats and Risk

- [ ] Trust boundaries identified when applicable ([trust-boundaries.md](trust-boundaries.md))
- [ ] Attack surface summarized or Unknown ([attack-surface.md](attack-surface.md))
- [ ] Critical-path threats considered ([threat-modeling.md](threat-modeling.md))
- [ ] Material risks recorded with confidence/residual notes ([security-risk-model.md](security-risk-model.md))

## Identity, Access, Secrets

- [ ] Authentication approach documented for entry points ([authentication.md](authentication.md))
- [ ] Authorization model documented or Unknown ([authorization.md](authorization.md))
- [ ] Least privilege / privileged access stance known ([least-privilege.md](least-privilege.md), [privileged-access.md](privileged-access.md))
- [ ] Secrets: name/purpose/source/required only — no values ([secrets-management.md](secrets-management.md))
- [ ] Secret exposure response path known ([secret-exposure.md](secret-exposure.md))

## Architecture and Contracts

- [ ] Security architecture lenses linked — not duplicated diagrams ([security-architecture.md](security-architecture.md))
- [ ] Critical contracts cover authn/authz/sensitive data as applicable ([contract-security.md](contract-security.md))
- [ ] Encryption stance for material channels/data Defined or Not Defined ([encryption.md](encryption.md))

## Detection, Response, Vulnerabilities

- [ ] Security-relevant monitoring identified or N/A ([security-monitoring.md](security-monitoring.md))
- [ ] Security incident path integrated with ops incidents ([security-incidents.md](security-incidents.md))
- [ ] Vulnerability intake/triage Defined or Not Defined ([vulnerability-management.md](vulnerability-management.md))
- [ ] Open exceptions have requirement/reason/risk/compensating/owner/approval/expiration ([security-exceptions.md](security-exceptions.md))

## Evidence and Logging

- [ ] Material controls have evidence refs or honest Unknown ([security-evidence.md](security-evidence.md))
- [ ] Secure logging expectations stated ([secure-logging.md](secure-logging.md))
- [ ] Auditability Defined, N/A, or Not Defined ([auditability.md](auditability.md))

## Dependencies and Delivery

- [ ] Material dependency security considered ([dependency-security.md](dependency-security.md))
- [ ] Supply-chain / release trust notes appropriate to size ([supply-chain-security.md](supply-chain-security.md))
- [ ] Secure development expectations proportionate ([secure-development.md](secure-development.md))

## Documentation Quality

- [ ] Security docs have owners and fresh `updated` metadata
- [ ] No secrets or unnecessary PII in docs
- [ ] Unknowns marked; no false Confirmed controls/compliance
- [ ] Links to architecture / contracts / ops resolve

## How to Use

| Situation | Use |
| --- | --- |
| New service launch | Walk the full list with [operational-readiness-checklist.md](operational-readiness-checklist.md) |
| Major redesign | Re-check Threats, Architecture/Contracts, Identity |
| Security incident follow-up | Re-check Detection/Response and Evidence items that failed |
| Periodic review | Sample critical services |

## Related Documents

- [security-readiness.md](security-readiness.md)
- [security-checklist.md](security-checklist.md)
- [security-debt.md](security-debt.md)
- [quality-model.md](quality-model.md)
- [operational-readiness-checklist.md](operational-readiness-checklist.md)
