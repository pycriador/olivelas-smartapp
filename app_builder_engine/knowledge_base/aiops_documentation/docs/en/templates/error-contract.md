---
title: "Error Contract"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
# contract_id: "domain-capability-errors@version"
# related_contract: "path-or-id-of-primary-contract"
---

# Error Contract

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/error-contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Technology-agnostic error catalog for a contract or contract family. Do **not** assume HTTP status codes, REST envelopes, or any specific transport. Mark rows **Not Applicable** or **Unknown** when evidence is missing. Never invent error codes or retry guarantees.

## Purpose

<!-- Which contract or interface this error catalog belongs to, and why a dedicated error document is needed. -->

## Related Contract

| Field | Value |
| --- | --- |
| Primary contract | <!-- path or contract_id --> |
| Producer | |
| Consumer(s) | |

## Error Summary

| Error | Condition | Retryable | Consumer Action |
| --- | --- | --- | --- |
| | | yes / no / Unknown | |
| | | | |
| | | | |

## Error Catalog

Document each error in full. Duplicate the block as needed.

### Error — <!-- short name or code -->

| Field | Value | Classification |
| --- | --- | --- |
| Condition | <!-- when this error occurs --> | Confirmed / Inferred / Unknown |
| Identification | <!-- how the consumer detects it (code, type, flag, exception name, etc.) --> | Confirmed / Inferred / Unknown |
| Code | <!-- machine-readable identifier if any; Not Applicable if none --> | Confirmed / Inferred / Unknown / Not Applicable |
| Message | <!-- stable human-readable message pattern if any; no secrets/PII --> | Confirmed / Inferred / Unknown / Not Applicable |
| Category | <!-- e.g. validation / authn / authz / not-found / conflict / unavailable / internal / business / other --> | Confirmed / Inferred / Unknown |
| Retryability | yes / no / conditional / Unknown | Confirmed / Inferred / Unknown |
| Impact | <!-- effect on the operation and downstream state --> | Confirmed / Inferred / Unknown |
| Expected Action | <!-- what the consumer should do --> | Confirmed / Inferred / Unknown |

#### Notes

<!-- Optional: payload shape, correlation fields, escalation path. -->

```text
<!-- representative error example without secrets or sensitive data -->
```

### Error — <!-- short name or code -->

| Field | Value | Classification |
| --- | --- | --- |
| Condition | | Confirmed / Inferred / Unknown |
| Identification | | Confirmed / Inferred / Unknown |
| Code | | Confirmed / Inferred / Unknown / Not Applicable |
| Message | | Confirmed / Inferred / Unknown / Not Applicable |
| Category | | Confirmed / Inferred / Unknown |
| Retryability | yes / no / conditional / Unknown | Confirmed / Inferred / Unknown |
| Impact | | Confirmed / Inferred / Unknown |
| Expected Action | | Confirmed / Inferred / Unknown |

## Cross-Cutting Retry Guidance

| Topic | Value | Classification |
| --- | --- | --- |
| Default retryable categories | | Confirmed / Inferred / Unknown / Not Applicable |
| Default non-retryable categories | | |
| Max attempts / backoff | <!-- link to primary contract if defined there --> | |

## Related Documentation

| Document | Path |
| --- | --- |
| Primary contract | |
| Integration | |
| Runbook / troubleshooting | |
| ADR | |
