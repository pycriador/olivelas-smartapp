# Contract Types

> Language: EN | [Português (pt-BR)](../pt-BR/contract-types.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Contract types classify **what kind of boundary** is being documented. A single contract document may declare more than one type when types genuinely overlap (for example Event + Data, or API + Integration).

Types are labels for documentation clarity — not a mandatory taxonomy that every project must exhaust.

## Types

### API Contract

A service or capability interface: request/response, query, mutation, or similar. May be realized with HTTP, RPC, GraphQL, local process calls, or other protocols. Protocol choice belongs in the contract metadata, not in the type definition.

Guidance: [api-contracts.md](api-contracts.md).

### Event Contract

Something that **happened**. The producer emits a fact; consumers react. Events describe past state changes; they do not instruct a specific consumer to act as a command would.

Guidance: [event-contracts.md](event-contracts.md).

### Message Contract

A message exchanged between sender and receiver (queue, stream, inbox, or other channel). Delivery, acknowledgement, and failure handling vary by system — document what this boundary actually does.

Guidance: [message-contracts.md](message-contracts.md).

### File Contract

Integration through files or file-like artifacts: batch drops, exports, imports, object storage objects. Do not assume CSV or any single format.

Guidance: [file-contracts.md](file-contracts.md).

### Command Contract

A request that something **should happen**. Distinct from an event (which reports that something already happened). Commands often imply an intended handler and expected outcome.

### Callback Contract

A reverse or secondary call: the provider later invokes a client-supplied interface, channel, or endpoint. Document callback timing, auth, payload, and failure handling.

### Library Contract

Public API of a library or package: functions, types, side effects, versioning, and compatibility for callers. Treat the published surface as the contract boundary.

### Data Contract

Structure and meaning of data shared across a boundary (records, projections, tables, documents). Often combined with API, Event, Message, or File types.

### Integration Contract

Cross-system or cross-platform agreement spanning multiple mechanisms. Use when the boundary is the integration relationship itself, not a single narrow interface.

## Overlap

| Situation | Guidance |
| --- | --- |
| Event with rich payload schema | Event + Data |
| API that accepts file uploads | API + File (or document file rules under the API contract) |
| Command delivered as a message | Command + Message — state both; clarify which is primary |
| External partner integration | Integration + the concrete type(s) used |

Pick the **primary** type for naming and discovery; list secondary types in metadata when useful.

## What Types Are Not

- Not a requirement to create one document per type for every system.
- Not a protocol requirement (an "API Contract" is not required to be HTTP).
- Not mutually exclusive labels.

## Related Documents

- [contract-model.md](contract-model.md)
- [api-contracts.md](api-contracts.md)
- [event-contracts.md](event-contracts.md)
- [message-contracts.md](message-contracts.md)
- [file-contracts.md](file-contracts.md)
- [standards.md](standards.md)
