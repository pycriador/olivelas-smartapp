# Contract Compatibility

> Language: EN | [Português (pt-BR)](../pt-BR/contract-compatibility.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Compatibility describes whether participants can keep working correctly when a contract evolves. It is **not** a property of the producer alone. Analyze **producer and consumer** together.

## Definitions

### Backward Compatibility

Existing consumers continue to work with a new producer (or new contract version) under documented assumptions.

Typical question: *Can today's consumers still process tomorrow's producer output?*

### Forward Compatibility

Consumers can handle newer contract versions than they were built against (for example by ignoring unknown fields), within stated limits.

Typical question: *Can today's consumer tolerate tomorrow's additive changes?*

### Breaking Change

A change that can invalidate existing participants' expectations — consumers, producers, or both. See [breaking-changes.md](breaking-changes.md).

## Producer + Consumer Analysis

| Change | Producer impact | Consumer impact | Notes |
| --- | --- | --- | --- |
| Add optional field (producer emits) | Low | Depends on unknown-field tolerance | Strict parsers may break |
| Remove field | May stop emitting | Breaks if field required by consumer | Usually breaking |
| Change semantics of existing field | Must emit new meaning | Misinterprets if unaware | Breaking even if types match |
| New required input | Callers must supply | Clients break until updated | Breaking for clients |
| Loosen validation | Accepts more | May send newly allowed values | Check other consumers |

Always ask:

1. Who produces under this contract today?
2. Who consumes?
3. What assumptions does each side encode (required fields, enums, error codes, order)?
4. Does the change violate those assumptions?

## Documenting Compatibility

| Change type | Compatible? | Conditions | Notes |
| --- | --- | --- | --- |
| Additive optional field | conditional | consumers ignore unknowns | |
| Field removal | no | — | requires new version |
| Semantic change | no | — | requires new version / migration |

State assumptions explicitly (for example: "Consumers must ignore unknown fields").

## Related Documents

- [contract-versioning.md](contract-versioning.md)
- [breaking-changes.md](breaking-changes.md)
- [contract-change-management.md](contract-change-management.md)
- [semantic-contracts.md](semantic-contracts.md)
