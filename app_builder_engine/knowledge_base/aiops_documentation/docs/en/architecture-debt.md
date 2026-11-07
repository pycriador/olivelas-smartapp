# Architecture Debt

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-debt.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to distinguish and register architecture debt versus technical debt and documentation debt.

## Three Distinct Debts

| Kind | Meaning | Typical example |
| --- | --- | --- |
| **Technical Debt** | Problem in the **implementation** (code/config quality, shortcuts, missing tests) | Duplicated logic, fragile module, no automated tests for a path |
| **Architecture Debt** | **Structural or decision** choice that creates future cost, risk, or constraint | Cyclic dependencies between deployable units; shared DB coupling that blocks independent change; outdated pattern still enforced |
| **Documentation Debt** | Architecture (or other) **information** missing, wrong, or stale | No failure domains section; diagram contradicts runtime; missing contract doc |

They often co-exist. Register each under the right kind so remediation targets the right artifact (code vs structure vs docs).

Documentation debt details: [documentation-debt.md](documentation-debt.md). Drift (docs ≠ reality) often spawns documentation debt and may reveal architecture debt: [architecture-drift.md](architecture-drift.md).

## When Something Is Architecture Debt

Treat as architecture debt when the issue is primarily about:

- system structure, boundaries, or coupling;
- communication topology or dependency direction that is costly;
- quality-attribute shortfalls caused by structure (not a single buggy function);
- decisions that should be revisited (with or without an ADR);
- absence of isolation that the architecture claims or needs.

Do **not** label every bug or missing unit test as architecture debt.

## How to Register Architecture Debt

Keep a simple register (issue tracker, Markdown table, or backlog). Each item should include:

| Field | Meaning |
| --- | --- |
| **ID** | Stable identifier (for example `ARCH-012`) |
| **Description** | What structural or decision problem exists |
| **Impact** | Future cost, risk, or constraint if unresolved |
| **Owner** | Team, squad, or role accountable |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Example:

| ID | Description | Impact | Owner | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| ARCH-004 | Two services share a writable datastore without a contract | Blocks independent deploy; failure couples both | platform-squad | High | Open |

Optional useful fields: related ADR, related components, related drift/doc debt IDs, target resolution window.

## Priority Guidance

| Priority | Guidance |
| --- | --- |
| **High** | Blocks safe evolution, creates material outage blast radius, or violates an accepted constraint |
| **Medium** | Meaningful cost or coupling; workarounds exist |
| **Low** | Cleanup or preferred end-state; low blast radius |

## Status Guidance

| Status | Meaning |
| --- | --- |
| `Open` | Acknowledged, not started |
| `In Progress` | Actively being addressed (often via ADR + structural change) |
| `Resolved` | Structure/decision updated; docs aligned and reviewed as needed |
| `Accepted Risk` | Explicitly deferred; impact understood by owner |

`Accepted Risk` is a decision, not neglect. Record who accepted it and why. Consider an ADR when the acceptance itself is architectural.

## Relationship to Lifecycle

- Discovering architecture debt does not invent a new document status token.
- Remediations that change architecture docs use `ACCEPTED → REVIEW → ACCEPTED` when material.
- New structural decisions should land as ADRs when they meet the project's ADR bar ([decisions/README.md](decisions/README.md)).

## Practices

- Prefer few accurate debt items over a vague backlog.
- Link debt IDs from review records and PR descriptions.
- Separate "we wish we had microservices" aspirations from evidenced structural debt.
- Never present Accepted Risk debt as Confirmed healthy architecture.

## Related Documents

- [documentation-debt.md](documentation-debt.md)
- [architecture-drift.md](architecture-drift.md)
- [architecture-review.md](architecture-review.md)
- [architecture-traceability.md](architecture-traceability.md)
- [decisions/README.md](decisions/README.md)
- [quality-model.md](quality-model.md)
