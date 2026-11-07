# Contract Testing

> Language: EN | [Português (pt-BR)](../pt-BR/contract-testing.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Conceptual guidance for verifying that participants honor a technical contract.

This standard **does not** mandate tools, frameworks, or vendors. Strategy depends on contract type and project risk.

## What Contract Testing Means

Contract testing checks that producers and consumers agree on the boundary — structure, and where feasible, critical behavior — without requiring a full end-to-end environment for every assertion.

It complements (does not replace) unit tests and broader integration tests.

## Verification Kinds

### Producer Verification

Evidence that the producer emits or accepts what the contract claims: schemas match output, required fields present, error shapes honored, version identifiers correct.

### Consumer Verification

Evidence that the consumer can handle the contract: required fields read correctly, unknown-field policy as documented, error handling matches expectations.

### Schema Validation

Machine or test checks that payloads conform to the declared schema ([schema-documentation.md](schema-documentation.md), [contract-validation.md](contract-validation.md)).

### Compatibility Testing

Checks that a change remains compatible with stated consumer/producer assumptions ([contract-compatibility.md](contract-compatibility.md)) — for example old consumer vs new producer fixtures.

### Integration Testing

Broader tests across real or simulated infrastructure. Useful for delivery, ordering, and timing behaviors that pure schema checks cannot prove. Still technology-agnostic at the documentation level: describe *what* is verified, not a mandatory stack.

## Guidance by Contract Type

| Type | Typical focus |
| --- | --- |
| API | Request/response shapes, errors, auth failure modes |
| Event / Message | Payload schema, duplicate handling, consumer tolerance |
| File | Row/record validation, encoding, partial file behavior |
| Library | Public API signatures and documented side effects |

## Documentation Expectations

When tests exist, the contract (or related ops doc) may link:

- what is verified;
- where tests live;
- what remains Unverified / Unknown.

Do not claim "fully contract-tested" without evidence. Do not invent green status.

## Related Documents

- [contract-compatibility.md](contract-compatibility.md)
- [contract-source-of-truth.md](contract-source-of-truth.md)
- [contract-drift.md](contract-drift.md)
- [contract-checklist.md](contract-checklist.md)
