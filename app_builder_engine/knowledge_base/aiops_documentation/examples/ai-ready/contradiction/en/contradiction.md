---
title: "Contradiction: notify-bridge max retries (Fictional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "CONTRA-NB-001"
type: "Evidence"
---

# Contradiction

> Language: EN | [Português (pt-BR)](../pt-BR/contradiction.md)
>
> **Fictional example — not a real project.**

## ID

| Field | Value |
| --- | --- |
| Contradiction ID | CONTRA-NB-001 |
| Status | Open |
| Severity | Medium |
| Owner | example-platform-team |

## Conflicting Statements

| # | Statement | Source ID / path | Classification | Observed date |
| --- | --- | --- | --- | --- |
| A | Max delivery retries is 3 | CLAIM-NB-001 / code evidence | Confirmed | 2026-08-07 |
| B | “Worker retries five times before DLQ” | Fictional ops note `ops/notify-bridge-legacy.md` | Deprecated (suspected) / Inferred from stale doc | 2026-01-12 |

## Conflict Type

| Field | Value |
| --- | --- |
| Type | Doc↔Doc |
| Topic | Max delivery retries |

## Impact

Operators or AI answers may prescribe the wrong retry expectation; monitoring thresholds may disagree with runtime behavior.

## Resolution

| Field | Value |
| --- | --- |
| Resolution | |
| Winning source | |
| Actions taken | |
| Resolved on | — |
| Evidence of resolution | |

## Related

| Kind | ID / path |
| --- | --- |
| Claims | CLAIM-NB-001 |
| Drift records | Not Documented |
| Debt | Open — update or deprecate legacy ops note |
