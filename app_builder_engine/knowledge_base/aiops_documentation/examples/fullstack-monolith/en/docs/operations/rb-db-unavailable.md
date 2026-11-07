---
title: "Runbook — Database unavailable (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Runbook: database unavailable

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/operations/rb-db-unavailable.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / Fictional example.**

## Symptoms
- Health with `database: false`
- Illustrative HTTP 503 on connection failure
- Live UI fails authenticated listings

## Checks
1. Call health and inspect database fields
2. Validate connection env **without logging passwords**
3. Network reachability to DB and illustrative search_path

## Mitigation
1. Restore connectivity/credentials
2. Restart API process if pool is wedged
3. Confirm startup retries if present in runtime

## Escalation
Operational / on-call: **Unknown** (fill in real projects).

## Evidence
Illustrative in this example — do not invent cloud-specific commands.

