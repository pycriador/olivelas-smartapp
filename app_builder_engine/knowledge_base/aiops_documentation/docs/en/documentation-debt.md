# Documentation Debt

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-debt.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

Documentation debt is technical debt: known gaps or inaccuracies that reduce trust, slow delivery, or increase operational risk.

Treat it with the same seriousness as code debt — visible, owned, prioritized, and either fixed or explicitly accepted as risk.

## Debt Types

| Type | Description |
| --- | --- |
| Missing document | Required topic has no canonical doc |
| Incomplete document | Structure exists but critical sections are empty or Unknown without plan |
| Stale document | Content no longer matches system behavior |
| Incorrect document | Content is wrong or misleading |
| Orphan document | No owner; unclear who maintains it |
| Duplicate / conflicting | Multiple sources disagree without a canonical link |
| Missing contract | Interface exists but is undocumented |
| Missing runbook | Operational procedure needed but absent |
| Weak classification | Claims presented as fact without evidence or Confirmed/Inferred/Unknown/Proposed marks |
| Translation lag | Bilingual projects where one language is behind (when language policy applies) |

## Register Fields

Keep a simple register (issue tracker, Markdown table, or project backlog). Each item should include:

| Field | Meaning |
| --- | --- |
| **ID** | Stable identifier (for example `DOC-012`) |
| **Description** | What is wrong or missing |
| **Impact** | Who/what fails if unresolved (incident response, onboarding, integrators, security) |
| **Owner** | Team, squad, or role accountable |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Example row:

| ID | Description | Impact | Owner | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| DOC-014 | Checkout runbook missing rollback steps | On-call delay during failed deploy | checkout-squad | High | Open |

## Priority

| Priority | Guidance |
| --- | --- |
| **High** | Security, production operation, or external contract accuracy at risk |
| **Medium** | Material understanding gap; workarounds exist |
| **Low** | Nice-to-have completeness; low operational blast radius |

## Debt Status

| Status | Meaning |
| --- | --- |
| `Open` | Acknowledged, not started |
| `In Progress` | Actively being fixed |
| `Resolved` | Fixed and verified (docs updated / reviewed as needed) |
| `Accepted Risk` | Explicitly deferred; impact understood by owner |

`Accepted Risk` is a decision, not neglect. Record who accepted it and why.

## Relationship to Lifecycle and Review

- Discovering debt does not invent a new document status token.
- Fixing material debt on an `ACCEPTED` doc uses `ACCEPTED → REVIEW → ACCEPTED`.
- Staleness signals often become debt items — see [stale-documentation.md](stale-documentation.md).
- Change-driven work that cannot finish docs in the same PR should open debt per [change-policy.md](change-policy.md).

## Practices

- Prefer few accurate debt items over a graveyard of vague tickets.
- Link debt IDs from review records and PR descriptions.
- Close or re-prioritize during periodic reviews when used.
- Do not hide Known gaps as Confirmed content.

## This repository's register

Instance register for **this Documentation Standard repo** (not an example for adopters). The `DOC-014` row above remains a fictional illustration.

| ID | Description | Impact | Owner | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| DOC-015 | Cursor agents, hooks, and slash commands are not packaged (credai-api / lead-qualify also omit them). Add only when a concrete workflow exists (for example a `/docs-validate` command). | Adopters who want Cursor commands must invent them locally | documentation-standard | Low | Open |

## Related Documents

- [change-policy.md](change-policy.md)
- [stale-documentation.md](stale-documentation.md)
- [review-policy.md](review-policy.md)
- [quality-model.md](quality-model.md)
- [lifecycle.md](lifecycle.md)
