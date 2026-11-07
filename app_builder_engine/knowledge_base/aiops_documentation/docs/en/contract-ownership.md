# Contract Ownership

> Language: EN | [Português (pt-BR)](../pt-BR/contract-ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Who is accountable for a technical contract and for the participants that implement it.

General ownership rules: [ownership.md](ownership.md). This document specializes them for contracts.

## Roles

| Role | Accountability |
| --- | --- |
| **Contract owner** | Canonical document quality, lifecycle status, discoverability, change process facilitation |
| **Producer owner** | Correct production/emission behavior relative to the contract |
| **Consumer owner** | Correct consumption/interpretation relative to the contract |

These may be the same team or different teams. **Do not assume the producer alone owns the contract.**

## Shared Responsibility

When multiple teams depend on a boundary:

- The **contract owner** is the accountable author of the agreement (often a platform or leading producer team — but not always).
- **Producer and consumer owners** must be consulted on breaking changes.
- Shared ownership is valid: document co-owners or a RACI-style note in the contract.
- Disputes over meaning are resolved through review and, when architectural, ADRs — not silent divergence.

## Change Process Expectations

| Change kind | Who must be involved |
| --- | --- |
| Clarification (no behavior change) | Contract owner; notify participants if useful |
| Non-breaking additive | Contract owner + producer owner; inform known consumers |
| Breaking / semantic | Contract owner + producer owner + known consumer owners |
| Deprecation / archive | Contract owner; communicate to all known participants |

See [contract-change-management.md](contract-change-management.md).

## Metadata

Record at least:

| Field | Guidance |
| --- | --- |
| `owner` | Contract owner (required for substantive contracts) |
| `producer` | Producing system/component (recommended) |
| `consumer` | Primary consumer(s) or "multiple / see section" (recommended when known) |

Unknown consumers should be marked Unknown — not invented. See [standards.md](standards.md) for contract metadata fields.

## Related Documents

- [ownership.md](ownership.md)
- [contract-lifecycle.md](contract-lifecycle.md)
- [contract-change-management.md](contract-change-management.md)
- [breaking-changes.md](breaking-changes.md)
