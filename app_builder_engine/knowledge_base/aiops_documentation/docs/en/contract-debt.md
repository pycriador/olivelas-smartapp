# Contract Debt

> Language: EN | [Português (pt-BR)](../pt-BR/contract-debt.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to distinguish and register **contract debt** versus documentation debt and technical debt when the problem sits on a contract boundary.

## Three Distinct Debts

| Kind | Meaning | Typical example |
| --- | --- | --- |
| **Contract Debt** | The agreement itself is incomplete, inconsistent, hard to evolve, or weakly specified while the boundary exists | No idempotency story on a retried command; conflicting consumer assumptions; unversioned breaking churn |
| **Documentation Debt** | Information about the contract is missing, wrong, or stale | Runtime contract exists; Markdown/schema docs absent or drifted |
| **Technical Debt** | Implementation quality problem in producing/consuming the contract | Fragile parser, no tests, duplicated validation logic |

They often co-exist. Register each under the right kind so remediation targets the right artifact (agreement vs docs vs code).

See also: [documentation-debt.md](documentation-debt.md), [architecture-debt.md](architecture-debt.md).

## When Something Is Contract Debt

Treat as contract debt when the issue is primarily about:

- missing rules that participants need (retry, errors, semantics, compatibility);
- incompatible or ambiguous expectations between producers and consumers;
- inability to evolve safely (no versioning, no deprecation path);
- weak or conflicting Source of Truth declarations.

Do **not** label every missing wiki paragraph as contract debt if the agreement in schema+code is clear — that may be documentation debt only. Do **not** label a buggy handler as contract debt if the contract is clear — that is technical debt.

## How to Register Contract Debt

| Field | Meaning |
| --- | --- |
| **ID** | Stable id (for example `CDEBT-012`) |
| **Description** | What is weak or missing in the agreement |
| **Impact** | Integration risk, evolution cost, incident risk |
| **Owner** | Contract owner (and participant owners if needed) |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Priority guidance mirrors architecture debt: High blocks safe integration or evolution; Medium has workarounds; Low is cleanup.

## Relationship to Drift and Lifecycle

- [Contract drift](contract-drift.md) often creates documentation debt and may reveal contract debt.
- Fixing contract debt may require [change management](contract-change-management.md) and lifecycle transitions — not a new status token.
- `Accepted Risk` is an explicit decision, not neglect.

## Related Documents

- [contract-drift.md](contract-drift.md)
- [documentation-debt.md](documentation-debt.md)
- [architecture-debt.md](architecture-debt.md)
- [quality-model.md](quality-model.md)
- [contract-checklist.md](contract-checklist.md)
