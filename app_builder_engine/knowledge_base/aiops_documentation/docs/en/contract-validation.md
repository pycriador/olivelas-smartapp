# Contract Validation

> Language: EN | [Português (pt-BR)](../pt-BR/contract-validation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Validation rules define what makes an input, output, or message **acceptable** under the contract. Document the rules that producers and consumers rely on — not an aspirational wishlist.

## Validation Categories

| Category | Meaning | Example |
| --- | --- | --- |
| **required** | Field must be present | `order_id` always present |
| **type** | Value must match the declared type | integer, string, boolean, object |
| **format** | Representation constraint | date-time, UUID, email-shaped string |
| **range** | Numeric or comparable bounds | `0 <= score <= 100` |
| **length** | Size of string or collection | `1..64` characters |
| **enum** | Closed set of allowed values | `pending` \| `paid` \| `cancelled` |
| **pattern** | Regular expression or structural pattern | `^[A-Z]{3}$` |
| **cross-field** | Constraint spanning multiple fields | `end_at >= start_at` |
| **business constraint** | Domain rule beyond structural shape | cannot cancel an already fulfilled order |

List only categories that apply. Add project-specific categories if needed, with clear names.

## Structural vs Business Validation

### Structural Validation

Checks format and shape: type, required, length, pattern, enum membership as data shape.

Failure usually means "malformed" — the message/request is not well-formed under the schema.

### Business Validation

Checks domain rules that may require state, context, or policies beyond the payload shape.

Failure usually means "well-formed but not allowed" — the consumer/provider rejects the operation for business reasons.

| | Structural | Business |
| --- | --- | --- |
| Typical signal | Schema / type error | Domain / policy error |
| Can succeed structurally? | No if structural fails | Yes, then fail on business rule |
| Document | Schema + validation table | Validation + error contract |

Do not collapse both into a single vague "invalid" without stating which kind applies when consumers need different handling (retry, fix payload, escalate).

## How to Document Rules

Suggested table:

| Rule ID | Category | Target | Rule | Kind | Error / outcome |
| --- | --- | --- | --- | --- | --- |
| V-01 | required | `order_id` | Must be present | Structural | Reject |
| V-02 | range | `amount` | `>= 0` | Structural | Reject |
| V-03 | business | order | Cannot cancel fulfilled order | Business | Domain error |

Include valid and invalid examples when they clarify edge cases. Never put secrets in examples.

## Related Documents

- [schema-documentation.md](schema-documentation.md)
- [semantic-contracts.md](semantic-contracts.md)
- [breaking-changes.md](breaking-changes.md)
- [templates/contract.md](templates/contract.md)
