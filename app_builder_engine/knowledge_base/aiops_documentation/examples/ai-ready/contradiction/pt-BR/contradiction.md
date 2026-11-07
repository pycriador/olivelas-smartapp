---
title: "Contradição: max retries do notify-bridge (Ficcional)"
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

> Language: pt-BR | [English](../en/contradiction.md)
>
> **Exemplo ficcional — não é um projeto real.**

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
| A | Max de retries de entrega é 3 | CLAIM-NB-001 / evidência de código | Confirmed | 2026-08-07 |
| B | “Worker retenta cinco vezes antes da DLQ” | Nota ops fictícia `ops/notify-bridge-legacy.md` | Deprecated (suspeita) / Inferred de doc stale | 2026-01-12 |

## Conflict Type

| Field | Value |
| --- | --- |
| Type | Doc↔Doc |
| Topic | Max de retries de entrega |

## Impact

Operadores ou respostas de IA podem prescrever expectativa de retry errada; limiares de monitoramento podem divergir do runtime.

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
| Debt | Open — atualizar ou deprecar nota ops legada |
