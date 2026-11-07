# Security Evidence

> Language: EN | [Português (pt-BR)](../pt-BR/security-evidence.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **evidence** that security requirements and controls are met — without storing secrets or unnecessary sensitive data.

Evidence supports Confirmed claims in security documentation ([standards.md](standards.md)). Prefer links and identifiers over copies of raw sensitive material.

## What Counts as Evidence

| Kind | Examples (conceptual) |
| --- | --- |
| **Configuration** | Named settings, policy files, IaC references (no secret values) |
| **Test results** | Security test records, pipeline check outcomes — [security-testing.md](security-testing.md) |
| **Reviews** | Threat model review date, control review, exception approval |
| **Operational signals** | Alert definitions, monitor inventory — not raw dumps of PII |
| **Audit / access records** | Existence and location of audit trails — [auditability.md](auditability.md) |
| **Incident / vulnerability records** | IDs and outcomes |

Mark evidence **Unknown** when a claim cannot be substantiated. Do not invent tickets, screenshots, or certifications.

## Evidence Integrity Principles

Document and preserve integrity of security-relevant evidence:

| Principle | Meaning |
| --- | --- |
| **Authenticity** | Evidence comes from an identifiable, authorized source |
| **Integrity** | Evidence is protected against undetected alteration where the project requires it |
| **Completeness** | Material gaps are marked; do not cherry-pick only flattering proof |
| **Traceability** | Evidence links to the control, requirement, risk, or incident it supports |
| **Retention honesty** | Retention is Defined, **Not Defined**, or N/A — never invent legal holds |
| **Least exposure** | Prefer references over copies; never embed secret values; minimize PII |
| **Timeliness** | Note when evidence was collected; stale evidence can become [security drift](security-drift.md) |

Projects choose mechanisms (hashing, WORM storage, access control). This standard does not mandate a tool.

## What to Document per Evidence Item

| Field | Meaning |
| --- | --- |
| **ID** | Stable evidence id when useful ([standards.md](standards.md)) |
| **Supports** | Requirement / control / risk / incident / vulnerability ID |
| **Kind** | Config / test / review / signal / audit / other |
| **Location** | Where to find it (path, system name, ticket) — not the secret |
| **Collected** | Date or period |
| **Owner** | Who can produce or interpret it |
| **Integrity notes** | How integrity is protected, or **Not Defined** |
| **Classification** | Confirmed / Inferred / Unknown / Proposed |

## Naming

Prefer stable, scannable names:

```text
EVD-<short-topic>-<YYYYMMDD>
```

Example: `EVD-authn-review-20260807`. Projects may adapt.

## Rules

- Documentation **is not** a secret store — [secrets-management.md](secrets-management.md).
- Logs used as evidence must follow [secure-logging.md](secure-logging.md).
- AI-generated “evidence” without a real source is invalid — mark Proposed or discard ([ai-documentation.md](ai-documentation.md)).
- Prefer Confirmed evidence before accepting security docs as `ACCEPTED`.

## Related Documents

- [security-model.md](security-model.md)
- [security-controls.md](security-controls.md)
- [security-requirements.md](security-requirements.md)
- [security-testing.md](security-testing.md)
- [security-incidents.md](security-incidents.md)
- [auditability.md](auditability.md)
- [standards.md](standards.md)
