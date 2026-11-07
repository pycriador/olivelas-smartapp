---
title: "Contract — spreadsheet-import (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "File"
---

# spreadsheet-import

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/contracts/spreadsheet-import.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional example.** Not a production contract. Illustrative stack ≠ standard.

## Purpose
File contract for CSV/XLSX ingestion into a project.

## Scope
| In scope | Out of scope |
| --- | --- |
| CSV and XLSX | Arbitrary binary formats |
| Canonical aliases and schema evolution | Infinite streaming without chunking |

## Participants
| Participant | Role | Classification |
| --- | --- | --- |
| User / upload | producer (file) | Confirmed (within example) |
| backend-api | consumer | Confirmed (within example) |

## Semantics
`data_date` header and aliases; date validation; illustrative `schema.*` / `duplicate.*` permissions.

## Related
[canonical-ingest.md](canonical-ingest.md), [../application/project-pipeline.md](../application/project-pipeline.md)

