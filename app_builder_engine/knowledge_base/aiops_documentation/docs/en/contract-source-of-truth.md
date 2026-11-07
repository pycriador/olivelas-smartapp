# Contract Source of Truth

> Language: EN | [Português (pt-BR)](../pt-BR/contract-source-of-truth.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

A contract may exist in several representations. One of them must be declared as the **Source of Truth** for each concern, or teams will diverge silently.

## Representations

| Representation | Role |
| --- | --- |
| **Documentation** | Human-oriented contract document (Markdown, etc.) |
| **Schema** | Machine-readable structure definition |
| **Specification** | Formal or semi-formal API/event spec artifact |
| **Code** | Types, validators, handlers in implementation |
| **Generated artifact** | Output derived from a source (docs, clients, stubs, exported schemas) |

## Avoid Triple Drift

Dangerous state:

```text
Documentation ≠ Schema ≠ Implementation
```

Prevent it by:

1. Declaring which artifact is authoritative for structure, for semantics, and for runtime behavior (they may differ by concern).
2. Linking non-authoritative copies back to the source.
3. Updating the source first, then regenerating or revising dependents.
4. Treating unexplained divergence as [contract drift](contract-drift.md).

## How to Declare Source of Truth

In the contract document (or metadata), state explicitly:

| Concern | Authoritative source | Path / id |
| --- | --- | --- |
| Structure | Schema / Spec / Doc / Code | … |
| Semantics | Documentation (usually) | … |
| Runtime behavior | Code + tests (with doc summary) | … |

Example statement:

> Schema file `schemas/order-accepted.schema.*` is authoritative for structure. This Markdown document is authoritative for semantics, retry, and ownership. Implementation must conform; divergence is drift.

## Generated Contracts

When contracts or derivatives are generated:

| Element | Document |
| --- | --- |
| **Source** | Input that humans/agents edit (IDL, schema, annotated code, etc.) |
| **Generated artifact** | Output not edited by hand |
| **Generation process** | How/when generation runs (command, pipeline name — no mandatory tool) |

Rules:

- Do not treat a hand-edited "generated" file as primary without justification.
- Do not edit generated artifacts as the main workflow; change the source and regenerate.
- If documentation is generated from schema, say so — and still ensure semantics (meaning, retry, ownership) are not lost.

## Related Documents

- [contract-drift.md](contract-drift.md)
- [schema-documentation.md](schema-documentation.md)
- [contract-testing.md](contract-testing.md)
- [architecture-vs-implementation.md](architecture-vs-implementation.md)
