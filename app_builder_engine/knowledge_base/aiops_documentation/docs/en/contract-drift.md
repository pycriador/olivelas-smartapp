# Contract Drift

> Language: EN | [Português (pt-BR)](../pt-BR/contract-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

**Contract drift** is the gap between the documented (or schema-declared) contract and the actual runtime agreement.

```text
Documented Contract
        ≠
Actual Contract
```

Related concepts: [architecture-drift.md](architecture-drift.md), [stale-documentation.md](stale-documentation.md), [contract-source-of-truth.md](contract-source-of-truth.md).

## Signals

| Signal | Example |
| --- | --- |
| Divergent schema | Code emits fields not in schema/doc |
| Documented field missing | Doc lists `discount`; runtime never sends it |
| Undocumented required field | Runtime requires `tenant_id`; docs omit it |
| Different behavior | Retry or error handling differs from doc |
| Different errors | New error identities undocumented |
| Wrong version | Clients call `@v1` semantics while producer shipped `@v2` behavior under old id |
| Producer/consumer divergence | Producer and consumer encode incompatible assumptions |

## How to Register

When drift is found:

1. **Classify impact** — cosmetic vs integration-breaking vs security-sensitive.
2. **Record** — review follow-up, issue, or debt item with evidence (code path, payload sample, test).
3. **Assign owner** — usually contract owner coordinating with producer/consumer owners ([contract-ownership.md](contract-ownership.md)).
4. **Do not "fix" docs by inventing** a desired contract as current state.

Suggested fields:

| Field | Meaning |
| --- | --- |
| **ID** | Optional (`CDRIFT-003`) |
| **Documented** | What docs/schema claim |
| **Actual** | What runtime does (with evidence) |
| **Impact** | Who breaks or is misled |
| **Owner** | Who reconciles |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

## How to Treat

| Finding | Action |
| --- | --- |
| Docs/schema wrong, runtime correct | Update contract docs/schema; lifecycle `ACCEPTED → REVIEW → ACCEPTED` when material |
| Runtime wrong vs accepted contract | Fix implementation **or** deliberately revise the contract via change management |
| Both evolving | Coordinate version, migration, tests, and docs |
| Temporary gap | Register [contract debt](contract-debt.md) or documentation debt; do not mark Confirmed |

## What This Standard Does Not Require

No mandatory drift bots or continuous verification tooling in this version. Projects may add automation later without changing these definitions.

## Related Documents

- [contract-debt.md](contract-debt.md)
- [contract-source-of-truth.md](contract-source-of-truth.md)
- [contract-change-management.md](contract-change-management.md)
- [architecture-drift.md](architecture-drift.md)
