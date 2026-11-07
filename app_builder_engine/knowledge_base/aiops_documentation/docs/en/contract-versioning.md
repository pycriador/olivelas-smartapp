# Contract Versioning

> Language: EN | [Português (pt-BR)](../pt-BR/contract-versioning.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to version technical contracts. Contract versions are distinct from **Documentation Standard** versions ([versioning.md](versioning.md)) and from optional document content `version` fields.

## Version Identity

Use a stable contract identifier plus a version, for example:

```text
order-created@v1
order-created@v2
```

Projects may use semver (`1.2.0`), integer versions (`v3`), or dated versions — pick one scheme per contract family and stay consistent. See [standards.md](standards.md).

## Change Classes

| Class | Meaning |
| --- | --- |
| **Breaking change** | May invalidate existing consumers or producers under current expectations |
| **Non-breaking change** | Existing compliant participants continue to work under stated assumptions |
| **Additive change** | Adds optional capability (often non-breaking for tolerant consumers) |
| **Removal** | Removes a field, value, endpoint, or behavior (usually breaking) |
| **Deprecation** | Marks something as outgoing while still supported for a period |
| **Migration** | Planned move from one version/behavior to another |

Compatibility always depends on **both** producer and consumer behavior — [contract-compatibility.md](contract-compatibility.md).

### Potentially breaking examples

- Remove a field
- Change field meaning (semantic change)
- Change type
- Make an optional field required
- Change error semantics in a way consumers rely on
- Rename identifiers that participants hard-code

### Potentially non-breaking examples

- Add an optional field (if consumers ignore unknowns)
- Add a new allowed enum value (depends on consumer strictness)
- Add a new operation that existing clients never call
- Clarify documentation without changing behavior

**Additive is not automatically safe.** Strict consumers that reject unknown fields may break on additive producer changes. Analyze both sides.

## Versioning Practices

1. Bump the contract version when the published agreement changes materially.
2. Prefer additive evolution within a version only when compatibility analysis supports it.
3. For breaking changes, publish a new version and run [breaking-changes.md](breaking-changes.md) process.
4. Document deprecation windows and migration steps.
5. Keep old versions discoverable until archived ([contract-lifecycle.md](contract-lifecycle.md)).

## Related Documents

- [contract-compatibility.md](contract-compatibility.md)
- [breaking-changes.md](breaking-changes.md)
- [contract-change-management.md](contract-change-management.md)
- [versioning.md](versioning.md)
- [deprecation.md](deprecation.md)
