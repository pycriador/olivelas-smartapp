---
title: "Recovery Procedure: catalog-cache restore (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
recovery_id: "rcv-catalog-cache-restore"
severity: "SEV-2"
---

# Recovery Procedure: catalog-cache restore

> Language: EN | [Português (pt-BR)](../pt-BR/recovery-procedure.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Recovery ID: rcv-catalog-cache-restore
>
> **Fictional example — not a real project.**

## Purpose

Restore catalog-cache contents from a named backup so lookups can serve a recent snapshot when the live cache is empty or corrupt.

## Scope

| In scope | Out of scope |
| --- | --- |
| Restore of catalog-cache from backup artifact | Full site disaster recovery, inventory-store restore |

## Preconditions

| Precondition | How to verify |
| --- | --- |
| Backup artifact name and timestamp known | Check backup catalog / inventory |
| Restore permission granted for environment | Confirm access via project access process |
| Stakeholders notified of maintenance / recovery | Status note posted |

## Safety Notes

- Confirm **environment** and **target cache** before acting.
- Restore may **overwrite** current cache contents — call out before execution.
- Never embed secrets; reference secret names only.
- Do not invent storage paths or vendor CLIs; use project-evidenced restore steps.
- Prefer read-only validation of the backup before cutover when the project supports it.

## RPO / RTO Context

| Field | Value |
| --- | --- |
| RPO | 1 hour (example) |
| RTO | 30 minutes (example) |
| Recovery criteria | Lookups succeed against restored snapshot; freshness within RPO |

## Procedure

1. Identify the latest backup within RPO; record artifact name and timestamp.
2. Put catalog-service into documented maintenance or degraded mode if required by project process.
3. Restore backup into the target catalog-cache using the project's evidenced restore mechanism (name the mechanism; do not invent commands).
4. Run validation checks below.
5. Exit maintenance / degraded mode when checks pass.
6. Record artifact used and outcome in the incident or change record.

## Validation

| Check | Expected result |
| --- | --- |
| Sample lookups | Success within timeout |
| Cache freshness | Within RPO of chosen backup |
| Error ratio | Stable or improving vs pre-restore |

## Rollback / Abort

| Condition | Action |
| --- | --- |
| Restore fails validation | Abort cutover; keep prior cache if still present; escalate |
| Wrong environment detected | Stop immediately; do not proceed |

Recovery itself may not be safely reversible if the prior cache was empty — document that state before overwrite.

## Escalation

| Condition | Escalate to | Provide |
| --- | --- |
| No valid backup within RPO | example-platform | RPO miss, last known good artifact |
| Restore fails repeatedly | example-platform | Artifact name, validation failures |

## Related Documentation

| Document | Path |
| --- | --- |
| Backup / restore | docs/en/backup-restore.md |
| Disaster recovery | docs/en/disaster-recovery.md (formal DR not defined for this example) |
| Runbook | ../runbook/ |
| Service profile | ../service-profile/ |
| RPO / RTO | docs/en/rpo-rto.md |
