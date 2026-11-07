# Contract Lifecycle

> Language: EN | [Português (pt-BR)](../pt-BR/contract-lifecycle.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Contracts use the **same documentation lifecycle** as the rest of this standard. There is **no parallel incompatible lifecycle**.

```text
DRAFT → REVIEW → ACCEPTED → DEPRECATED → ARCHIVED
```

Full rules: [lifecycle.md](lifecycle.md), [status.md](status.md).

## Status Meanings for Contracts

| Status | Meaning for contracts |
| --- | --- |
| `DRAFT` | Contract being written; not ready for integration reliance |
| `REVIEW` | Ready for or under review against evidence and consumers/producers |
| `ACCEPTED` | Approved current contract for the stated version |
| `DEPRECATED` | Still visible; superseded or no longer recommended for new use |
| `ARCHIVED` | Historical only; not active integration guidance |

`UPDATED` is not a stored status. Material changes follow `ACCEPTED → REVIEW → ACCEPTED`.

## Lifecycle Activities

### Create

1. Identify the boundary and participants ([contract-model.md](contract-model.md)).
2. Choose type(s) ([contract-types.md](contract-types.md)).
3. Draft using [templates/contract.md](templates/contract.md) (sections as applicable).
4. Set `status: DRAFT`, owner, and initial evidence links.
5. Mark unknowns; do not invent fields or guarantees.

### Review

1. Move to `REVIEW` when structure is evaluable.
2. Review against code/schema/tests/consumers/producers ([review-policy.md](review-policy.md)).
3. Check schema, semantics, errors, retry, idempotency, versioning as applicable ([contract-checklist.md](contract-checklist.md)).
4. Return to `DRAFT` if material gaps remain.

### Approve

1. On successful review, set `ACCEPTED`.
2. Ensure discoverability (contracts index / links from architecture and components).
3. Confirm Source of Truth is declared ([contract-source-of-truth.md](contract-source-of-truth.md)).

### Change

1. Assess impact with [contract-change-management.md](contract-change-management.md).
2. For material `ACCEPTED` contracts: `ACCEPTED → REVIEW → ACCEPTED`.
3. Update producers, consumers, tests, and related docs in coordinated fashion when needed.

### Version

1. Apply [contract-versioning.md](contract-versioning.md) and [contract-compatibility.md](contract-compatibility.md).
2. Breaking changes typically introduce a new contract version identity.
3. Keep prior versions in lifecycle until deprecated/archived.

### Deprecate

1. Follow [deprecation.md](deprecation.md) and [breaking-changes.md](breaking-changes.md).
2. Set `DEPRECATED`, `replaced_by`, `deprecated_on`, `deprecation_reason`.
3. Communicate migration window to participant owners ([contract-ownership.md](contract-ownership.md)).

### Archive

1. When no operational use remains, move to `ARCHIVED` ([archive-policy.md](archive-policy.md)).
2. Retain for history; do not present as current integration guidance.

## Governance Alignment

Contracts also follow ownership, review, change, debt, and stale-doc policies from lifecycle governance. Do not invent alternate status tokens for contracts.

## Related Documents

- [lifecycle.md](lifecycle.md)
- [contract-ownership.md](contract-ownership.md)
- [contract-change-management.md](contract-change-management.md)
- [contract-versioning.md](contract-versioning.md)
- [deprecation.md](deprecation.md)
- [archive-policy.md](archive-policy.md)
