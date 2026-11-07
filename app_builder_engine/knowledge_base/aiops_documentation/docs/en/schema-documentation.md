# Schema Documentation

> Language: EN | [Português (pt-BR)](../pt-BR/schema-documentation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document the structure of data that crosses a contract boundary.

A schema is incomplete if it only lists field names. **Semantic meaning is part of the contract** — see [semantic-contracts.md](semantic-contracts.md).

## What a Schema Must Enable

A reader (or agent) should understand, for each relevant field:

| Concern | Meaning |
| --- | --- |
| Field | Stable name |
| Type | Data type used by this contract |
| Required | Whether the field must be present |
| Description | What the field means (semantic) |
| Format / constraints | Allowed values, ranges, patterns, defaults |
| Example | Representative non-secret value |

## Field Table Model

Use this table (or an equivalent that covers the same columns) as the default human-readable schema form:

| Field | Type | Required | Description | Constraints | Example |
| --- | --- | --- | --- | --- | --- |
| `order_id` | string | yes | Stable identifier of the order | UUID preferred; immutable after create | `a1b2c3d4-...` |
| `amount` | integer | yes | Amount in minor currency units (e.g. cents) | `>= 0` | `1599` |
| `currency` | string | yes | ISO 4217 currency code | enum of supported codes | `BRL` |

Rules:

- **Description** is mandatory for fields that consumers must interpret.
- Do not leave Description blank or copy the field name.
- Put format, range, length, enum, pattern, and default under **Constraints**.
- Mark classification when certainty matters (`Confirmed` / `Inferred` / `Unknown`).

## Additional Schema Notes

Document when applicable:

| Topic | Guidance |
| --- | --- |
| Nested structures | Flatten with dotted paths or nested subsections; stay consistent |
| Collections | State element type and emptiness rules |
| Defaults | Explicit default vs "absent means null/unknown" |
| Deprecated fields | Mark deprecated; do not silently remove from docs while still emitted |
| Sensitive fields | Identify sensitivity; never put secret values in examples |
| External schema | Link to the authoritative schema artifact; keep the field table aligned or state that the linked schema is Source of Truth |

## Input and Output

Apply the same model to request/input and response/output (or event payload, message body, file record). Not every contract has a response — events, files, and fire-and-forget messages may have other result shapes. Document what actually crosses the boundary.

For each input field when useful: origin, validation, default, limits. For each output: conditions under which it appears, codes/metadata if any, and behavior on partial failure.

## Source of Truth

Prefer a single authoritative schema representation. If documentation embeds a table **and** a machine schema exists, declare which is authoritative — [contract-source-of-truth.md](contract-source-of-truth.md).

## Related Documents

- [semantic-contracts.md](semantic-contracts.md)
- [contract-validation.md](contract-validation.md)
- [contract-source-of-truth.md](contract-source-of-truth.md)
- [templates/contract.md](templates/contract.md)
