---
title: "Contract Name"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
contract_type: "API"  # API|Event|Message|File|Command|Callback|Library|Data|Integration|Other
# protocol: ""
# producer: "component-a"
# consumer: "component-b"
# contract_id: "domain-capability-type@version"
---

# Contract Name

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Technology-agnostic contract template. Mark sections **Not Applicable** when they do not apply. Do not invent endpoints, fields, error codes, delivery guarantees, timeouts, retries, or versioning without evidence. Classify claims as Confirmed / Inferred / Unknown / Proposed where useful.

## Purpose

<!-- Why this contract exists and what capability it exposes. -->

## Scope

| In scope | Out of scope |
| --- | --- |
| | |

## Participants

| Participant | Role | Notes | Classification |
| --- | --- | --- | --- |
| | producer / consumer / intermediary / other | | Confirmed / Inferred / Unknown |

## Producer

| Field | Value | Classification |
| --- | --- | --- |
| System / component | | Confirmed / Inferred / Unknown |
| Team / owner | | |
| Evidence | <!-- path or Unknown --> | |

## Consumer

| Consumer | Notes | Classification |
| --- | --- | --- |
| | <!-- list known consumers; Unknown if not identified --> | Confirmed / Inferred / Unknown |

## Contract Type

Select one (align with frontmatter `contract_type`):

- [ ] API
- [ ] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Callback
- [ ] Library
- [ ] Data
- [ ] Integration
- [ ] Other: <!-- specify -->

## Protocol

<!-- Transport or interaction protocol. Examples are illustrative only; use what the project actually uses. Do not assume HTTP. -->

| Field | Value | Classification |
| --- | --- | --- |
| Protocol | | Confirmed / Inferred / Unknown / Not Applicable |
| Interaction style | request-response / fire-and-forget / stream / batch / other | |

## Endpoint / Channel / Interface

<!-- Path, topic, queue, file location, CLI entry, library surface, or other interface locator. Not Applicable when there is no discrete locator. -->

| Field | Value | Classification |
| --- | --- | --- |
| Locator | | Confirmed / Inferred / Unknown / Not Applicable |
| Method / operation / verb | | Confirmed / Inferred / Unknown / Not Applicable |
| Notes | | |

## Request / Input

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| | | yes / no | | Confirmed / Inferred / Unknown |

## Response / Output

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| | | yes / no | | Confirmed / Inferred / Unknown |

## Schema

<!-- Link to the canonical schema or embed a minimal schema. Prefer a single source of truth. -->

```text
<!-- schema or path to schema -->
```

| Topic | Value | Classification |
| --- | --- | --- |
| Schema location | | Confirmed / Inferred / Unknown / Not Applicable |
| Schema format | | |

## Semantics

<!-- Meaning of fields, states, side effects, and business rules expressed by the contract. -->

| Concept | Meaning | Side effects | Classification |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown |

## Authentication

| Mechanism | Notes | Classification |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

<!-- No secret values. Document secret references only. -->

## Authorization

| Rule | Notes | Classification |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

## Validation

| Rule | Applied where | Notes | Classification |
| --- | --- | --- | --- |
| | producer / consumer / gateway / other | | Confirmed / Inferred / Unknown / Not Applicable |

## Errors

<!-- Prefer linking to an error-contract document when errors are non-trivial. Do not assume HTTP status codes. -->

| Error / Condition | Retryable | Consumer Action | Classification |
| --- | --- | --- | --- |
| | yes / no / Unknown | | Confirmed / Inferred / Unknown / Not Applicable |

Detailed error catalog (optional): [error-contract.md](error-contract.md).

## Retry Behavior

| Topic | Value | Classification |
| --- | --- | --- |
| Retryable conditions | | Confirmed / Inferred / Unknown / Not Applicable |
| Max attempts | | |
| Backoff | | |
| Non-retryable conditions | | |

## Timeout

| Timeout | Value | Classification |
| --- | --- | --- |
| Client / consumer timeout | | Confirmed / Inferred / Unknown / Not Applicable |
| Server / producer timeout | | |
| Other | | |

## Idempotency

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes / no / Unknown / Not Applicable | |
| Idempotency key / strategy | | Confirmed / Inferred / Unknown / Not Applicable |

## Ordering

| Topic | Value | Classification |
| --- | --- | --- |
| Ordering guarantee | none / per-key / global / Unknown / Not Applicable | Confirmed / Inferred / Unknown / Not Applicable |
| Notes | | |

## Delivery Semantics

| Topic | Value | Classification |
| --- | --- | --- |
| Delivery guarantee | at-most-once / at-least-once / exactly-once / Unknown / Not Applicable | Confirmed / Inferred / Unknown / Not Applicable |
| Acknowledgement model | | |
| Notes | | |

## Versioning

| Topic | Value | Classification |
| --- | --- | --- |
| Current version | | Confirmed / Inferred / Unknown |
| Version strategy | | |
| Deprecation policy | | |
| Contract ID | <!-- e.g. domain-capability-type@version --> | |

## Compatibility

| Change type | Compatible? | Notes |
| --- | --- | --- |
| Additive optional field | | |
| Field removal | | |
| Type change | | |
| Semantic change | | |
| Other | | |

Do not auto-classify a change as breaking without consumer and deployment context.

## Rate Limits

| Limit | Value | Classification |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

## Size Limits

| Limit | Value | Classification |
| --- | --- | --- |
| Payload / message / file size | | Confirmed / Inferred / Unknown / Not Applicable |
| Other | | |

## Security Considerations

| Topic | Summary | Classification |
| --- | --- | --- |
| Data sensitivity | | Confirmed / Inferred / Unknown / Not Applicable |
| Encryption in transit | | |
| Encryption at rest | | |
| PII / secrets handling | <!-- references only; never embed secrets --> | |
| Other | | |

## Observability

| Signal | What to observe | Classification |
| --- | --- | --- |
| Logs | | Confirmed / Inferred / Unknown / Not Applicable |
| Metrics | | |
| Traces | | |
| Correlation / IDs | | |

## Examples

### Example — success

```text
<!-- representative example without secrets or sensitive data -->
```

### Example — error

```text
<!-- representative example -->
```

## Failure Scenarios

| Scenario | Impact | Expected behavior | Mitigation | Classification |
| --- | --- | --- | --- | --- |
| | | | | Confirmed / Inferred / Unknown / Not Applicable |

## Related Components

| Component | Relationship | Path / ID |
| --- | --- | --- |
| | producer / consumer / depends-on | |

## Related Architecture

| Document | Path |
| --- | --- |
| Architecture overview | |
| System context | |
| Data flow / sequence | |

## Related ADRs

| ADR | Relevance | Path |
| --- | --- | --- |
| | | |
