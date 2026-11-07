# API Contracts

> Language: EN | [Português (pt-BR)](../pt-BR/api-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Guidance for documenting **API-shaped** contracts. APIs are one contract type among many ([contract-types.md](contract-types.md)). This document does **not** make HTTP (or any protocol) the center of the model.

An API contract documents a capability interface: how a client invokes a provider and what comes back (when anything comes back).

## Document When Applicable

| Topic | Guidance |
| --- | --- |
| Interface | Named capability or surface the client calls |
| Endpoint / channel / method | Address and operation identity **as used by the project** — not necessarily URL + HTTP verb |
| Parameters | Inputs to the operation (path/query/body/args — project terms) |
| Headers / metadata | Transport or call metadata if part of the agreement |
| Request / input | Schema + semantics ([schema-documentation.md](schema-documentation.md)) |
| Response / output | Success and alternate outcomes; omit if not applicable |
| Authentication | Mechanism names and where credentials come from — never secret values |
| Authorization | Who may call; required scopes/roles if any |
| Errors | Condition, identity, retryability, consumer action |
| Pagination | How large result sets are sliced |
| Filtering / sorting | Supported criteria and defaults |
| Rate limits | Throttling expectations and client guidance |
| Versioning | How API versions are selected and retired |

Use sections from [templates/contract.md](templates/contract.md) that apply; skip the rest.

## Protocol Neutrality

Valid API realizations include (examples only): HTTP APIs, RPC, GraphQL, local library-like service interfaces, and other project-specific protocols. Record the actual `protocol` in metadata. Do not require REST resource modeling.

## Relationship to Other Types

- File upload/download as part of an API → document file rules or link a [file contract](file-contracts.md).
- Async completion after an API accept → document delivery, callback, or polling in [timing-contract.md](timing-contract.md) / [delivery-semantics.md](delivery-semantics.md).
- Commands exposed as API operations → clarify Command vs mere query semantics.

## Related Documents

- [contract-types.md](contract-types.md)
- [contract-model.md](contract-model.md)
- [contract-validation.md](contract-validation.md)
- [retry-policy.md](retry-policy.md)
- [idempotency.md](idempotency.md)
- [timing-contract.md](timing-contract.md)
