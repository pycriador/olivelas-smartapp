# Contracts

> Language: EN | [Português (pt-BR)](../../pt-BR/contracts/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Category for interface and contract documentation in adopting projects, plus the technical contracts methodology defined by this standard.

## Objective

Document APIs, events, messages, files, commands, libraries, data, and other contracts as canonical, verifiable boundaries between participants.

A technical contract answers: *How does one part of the system expect to interact with another?*

## Architecture Integration

```text
Architecture
      │
      ├── Component
      │
      └── Contract
             │
             ├── Producer
             └── Consumer
```

Architecture docs describe structure and relationships; contracts hold the detailed, verifiable interface agreement. Prefer links from architecture/components to contracts over copying schemas into architecture prose.

See [../architecture-model.md](../architecture-model.md) (Interfaces level) and [../contract-model.md](../contract-model.md).

## Guidance

- Do not assume HTTP, Kafka, JSON, or any specific protocol or format.
- One canonical document per contract (or versioned contract family).
- Other docs should link here instead of copying schemas.
- Include compatibility, versioning, retry, idempotency, and delivery expectations when applicable.
- Use the shared lifecycle: `DRAFT` → `REVIEW` → `ACCEPTED` → `DEPRECATED` → `ARCHIVED` — no parallel status system.
- Classify uncertain claims (`Confirmed` / `Inferred` / `Unknown` / `Proposed`).

## Methodology (Documentation Standard)

### Model and types

| Document | Purpose |
| --- | --- |
| [../contract-model.md](../contract-model.md) | Contract as boundary; participants (Producer/Consumer/Provider/Client/Sender/Receiver) |
| [../contract-types.md](../contract-types.md) | API, Event, Message, File, Command, Callback, Library, Data, Integration |

### Schema and meaning

| Document | Purpose |
| --- | --- |
| [../schema-documentation.md](../schema-documentation.md) | Field tables; structure with required semantic description |
| [../semantic-contracts.md](../semantic-contracts.md) | Structural vs semantic contracts |
| [../contract-validation.md](../contract-validation.md) | Validation categories; structural vs business |

### Behavior

| Document | Purpose |
| --- | --- |
| [../retry-policy.md](../retry-policy.md) | When to retry; counts; backoff; exhaustion |
| [../idempotency.md](../idempotency.md) | Idempotency questions; "not guaranteed" when unknown |
| [../delivery-semantics.md](../delivery-semantics.md) | at-most-once, at-least-once, exactly-once, best effort; sync/async |
| [../ordering.md](../ordering.md) | Global/key/entity/none/parallel ordering |
| [../timing-contract.md](../timing-contract.md) | Timeout vs business deadline vs processing duration |

### Evolution and governance

| Document | Purpose |
| --- | --- |
| [../contract-versioning.md](../contract-versioning.md) | Breaking/non-breaking/additive/removal/deprecation/migration |
| [../contract-compatibility.md](../contract-compatibility.md) | Backward, forward, breaking; producer+consumer analysis |
| [../contract-lifecycle.md](../contract-lifecycle.md) | Lifecycle integrated with documentation statuses |
| [../contract-ownership.md](../contract-ownership.md) | Contract, producer, and consumer owners; shared responsibility |
| [../contract-change-management.md](../contract-change-management.md) | Nine evaluation points for changes |
| [../breaking-changes.md](../breaking-changes.md) | Characterize, communicate, version, migrate, deprecate |

### Type-specific guidance

| Document | Purpose |
| --- | --- |
| [../api-contracts.md](../api-contracts.md) | API guidance without making HTTP mandatory |
| [../event-contracts.md](../event-contracts.md) | Event fields; Event vs Command |
| [../message-contracts.md](../message-contracts.md) | Message fields; heterogeneous mechanisms |
| [../file-contracts.md](../file-contracts.md) | File integrations; format-agnostic |

### Quality, truth, and verification

| Document | Purpose |
| --- | --- |
| [../contract-testing.md](../contract-testing.md) | Conceptual producer/consumer/schema/compatibility/integration verification |
| [../contract-source-of-truth.md](../contract-source-of-truth.md) | Documentation/Schema/Spec/Code/Generated; avoid Doc≠Schema≠Impl |
| [../contract-drift.md](../contract-drift.md) | Documented ≠ actual; signals and treatment |
| [../contract-debt.md](../contract-debt.md) | Contract vs documentation vs technical debt |
| [../contract-checklist.md](../contract-checklist.md) | Quality checklist |
| [../quality-model.md](../quality-model.md) | Includes contract quality dimensions |

## Templates

| Template | Purpose |
| --- | --- |
| [../templates/contract.md](../templates/contract.md) | Primary contract document template |
| [../templates/integration.md](../templates/integration.md) | Integration overview when broader than a single contract |

## Suggested Project Contents

| Document | Purpose |
| --- | --- |
| One file per contract (or versioned family) | Canonical agreement |
| Links from components / architecture | Discoverability without duplication |
| Schema artifacts (when used) | Machine-readable structure; declare Source of Truth |

## Related Documents

- [../standards.md](../standards.md) — naming, IDs, contract metadata
- [../lifecycle.md](../lifecycle.md)
- [../ownership.md](../ownership.md)
- [../architecture/README.md](../architecture/README.md)
