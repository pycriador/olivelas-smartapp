# Data Retention

> Language: EN | [Português (pt-BR)](../pt-BR/data-retention.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **how long data is kept** and what happens afterward.

## Hard Rule for Unknowns

When retention is not established, write **Not Defined**. Do not invent periods, legal holds, or deletion SLAs.

## Purpose

Answer:

> For each material data set, how long is it retained, in which stores (including backups), and what is the deletion or archival outcome?

## Suggested Record

| Field | Meaning |
| --- | --- |
| **Data set** | Asset / category name |
| **Classification** | Link [security-classification.md](security-classification.md) |
| **Primary store retention** | Duration or policy name — or **Not Defined** |
| **Backups / replicas** | Retention if different — or Not Defined / Not Applicable |
| **Archives** | If any |
| **Deletion / anonymization** | Outcome after retention — or Not Defined |
| **Owner** | Data owner |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| Data set | Classification | Primary retention | Backups | Deletion / anonymization | Owner | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | Not Defined if unknown | | | | |

## Guidance

- Align with [data-security.md](data-security.md) lifecycle stages Retention and Deletion.
- Include derivative stores (warehouses, search indexes, logs) when they keep the same data longer.
- Log retention may be shorter or longer than business data — document separately via [secure-logging.md](secure-logging.md) when material.
- Link [backup-restore.md](backup-restore.md) and [rpo-rto.md](rpo-rto.md) for operational backup windows without conflating them with privacy retention policy.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Not Defined explicitly for main data, or the real period if known |
| Medium | Inventory for Confidential/Restricted sets |
| Large | Backups/replicas/logs called out; deletion method |

## Anti-Patterns

- “Retained as long as needed” without owner or review.
- Claiming deletion while backups indefinitely restore the data, undocumented.
- Copying regulatory retention tables without project adoption.
- Using Proposed periods as current policy.

## Related Documents

- [data-security.md](data-security.md)
- [privacy.md](privacy.md)
- [security-assets.md](security-assets.md)
- [backup-restore.md](backup-restore.md)
- [secure-logging.md](secure-logging.md)
