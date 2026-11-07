# Breaking Changes

> Language: EN | [Português (pt-BR)](../pt-BR/breaking-changes.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to characterize, identify, communicate, version, migrate, and deprecate breaking contract changes.

This standard **does not mandate a single migration strategy**. It defines the process expectations.

## What Characterizes a Breaking Change

A change is breaking when it can cause a previously compliant participant to fail, mis-behave, or mis-interpret the contract under documented (or reasonably assumed) behavior.

Common cases:

| Change | Why breaking |
| --- | --- |
| Remove field / operation | Consumers may require it |
| Rename without alias | Hard-coded names fail |
| Change type | Parsing/validation fails |
| Change semantics | Same bytes, wrong meaning |
| Make optional → required | Producers/clients unprepared |
| Tighten validation | Previously valid payloads rejected |
| Change error meaning | Retry/automation reacts wrongly |
| Change auth requirements | Callers fail closed |

Structural identity with semantic change is still breaking ([semantic-contracts.md](semantic-contracts.md)).

## How to Identify

1. Diff schema and documented behavior (Added / Removed / Changed / Deprecated).
2. Map each delta to known producers and consumers.
3. Ask: would a compliant participant built against the previous version still be correct?
4. If impact is unclear, label **Unknown Impact** — do not auto-classify as safe.
5. Use [contract-change-management.md](contract-change-management.md) nine points.

## How to Communicate

- Notify contract, producer, and consumer owners ([contract-ownership.md](contract-ownership.md)).
- State what breaks, who is affected, timeline, and migration path.
- Update the contract document and related architecture/integration links.
- Prefer explicit deprecation notice before removal when participants need time.

## How to Version

- Publish a new contract version identity for incompatible agreements ([contract-versioning.md](contract-versioning.md)).
- Do not silently overwrite `@v1` with incompatible behavior.
- Keep the previous version available until deprecated/archived.

## How to Migrate

Choose a strategy that fits the project (examples — not mandatory):

| Strategy | Idea |
| --- | --- |
| Dual publish | Producer emits old and new for a window |
| Expand/contract | Additive expand, migrate consumers, then remove |
| Flagged cutover | Coordinated switch with feature flag |
| Big-bang | Single cutover when participant set is small and controlled |

Document the chosen strategy, owners, and success criteria. Record Unknowns.

## How to Deprecate the Previous Version

1. Mark previous version `DEPRECATED` with `replaced_by`, dates, and reason ([deprecation.md](deprecation.md)).
2. State support window and what happens after (reject, ignore, archive).
3. Archive when no operational use remains ([archive-policy.md](archive-policy.md)).
4. Remove only after migration evidence or accepted risk.

## Related Documents

- [contract-compatibility.md](contract-compatibility.md)
- [contract-versioning.md](contract-versioning.md)
- [contract-change-management.md](contract-change-management.md)
- [contract-lifecycle.md](contract-lifecycle.md)
- [deprecation.md](deprecation.md)
