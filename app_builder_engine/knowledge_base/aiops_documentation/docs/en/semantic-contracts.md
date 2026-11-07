# Semantic Contracts

> Language: EN | [Português (pt-BR)](../pt-BR/semantic-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

A contract can be **structurally valid** and still **semantically wrong**. Structure alone is not enough.

## Structural vs Semantic

### Structural Contract

Defines shape: names, types, presence, formats.

```text
name: string
age: integer
```

### Semantic Contract

Defines meaning: how participants must interpret values.

```text
age = completed years of age (not months, not "apparent age")
```

| Aspect | Structural | Semantic |
| --- | --- | --- |
| Question | What fields exist and in what form? | What do values mean and imply? |
| Failure mode | Parse/type error | Silent misuse, wrong business outcome |
| Example defect | Field missing or wrong type | `amount` treated as major units when it is minor units |

## How to Document Meaning

For each important field or concept, document:

| Element | Guidance |
| --- | --- |
| Plain-language meaning | One clear sentence |
| Units | Currency minor units, seconds, meters, etc. |
| Time semantics | Timezone, clock source, event time vs processing time |
| Identity | What the ID identifies; uniqueness and stability |
| Lifecycle | When the value is set, updated, or invalidated |
| Null / absent | Difference between missing, null, empty, and zero |
| Allowed interpretations | What consumers may and must not assume |
| Related business rule | Link or short statement when meaning depends on process |

Place semantics in the field **Description** column ([schema-documentation.md](schema-documentation.md)), in a dedicated **Semantics** section, or both. Prefer the Description column for field-level meaning; use a Semantics section for cross-field or domain concepts.

## Cross-Field Semantics

Document when meaning depends on other fields (for example: `status` + `closed_at` must be consistent). Cross-field rules belong with [contract-validation.md](contract-validation.md) and should still state the intended meaning, not only the check.

## Classification

Semantic claims need evidence like any other claim:

- **Confirmed** — code, schema comments, tests, or accepted domain definition
- **Inferred** — deduced; label clearly
- **Unknown** — do not invent units or business meaning
- **Proposed** — future reinterpretation; not current contract

## Related Documents

- [schema-documentation.md](schema-documentation.md)
- [contract-validation.md](contract-validation.md)
- [contract-model.md](contract-model.md)
- [breaking-changes.md](breaking-changes.md)
