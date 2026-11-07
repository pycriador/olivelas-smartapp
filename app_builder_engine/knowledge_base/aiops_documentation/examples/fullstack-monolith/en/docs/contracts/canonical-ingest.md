---
title: "Contract — canonical-ingest (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "Data"
---

# canonical-ingest

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/contracts/canonical-ingest.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional example.** Not a production contract. Illustrative stack ≠ standard.

## Purpose
Map spreadsheet headers to canonical names via aliases and GLOBAL/GROUP policies.

## Illustrative V1 alias
| Alias | Canonical | Classification |
| --- | --- | --- |
| `dataforge_data_date` | `data_date` | Confirmed (within example) |
| `data_date` | `data_date` | Confirmed (within example) |

## V2 policies
Hierarchy GLOBAL → GROUP override; user may apply/skip at import.

## Illustrative APIs
Canonical columns, import validate, policy CRUD, prompt preferences.

## Related

- [spreadsheet-import.md](spreadsheet-import.md)
- [../application/project-pipeline.md](../application/project-pipeline.md)

