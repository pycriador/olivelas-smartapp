---
title: "Contract: catalog.price-batch (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
contract_type: "File"
producer: "pricing-exporter"
consumer: "catalog-importer"
contract_id: "catalog.price-batch@v1"
---

# Contract: catalog.price-batch

> Language: EN | [Português (pt-BR)](../pt-BR/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Contract ID: catalog.price-batch@v1
>
> **Fictional example — not a real project.**

## Purpose

Define the batch file exchange for catalog price updates between an exporter and an importer. Format is **generic** — the project chooses the concrete encoding.

## Scope

| In scope | Out of scope |
| --- | --- |
| Filename pattern, record fields, validation, failure handling | Pricing calculation rules |
| Delivery location agreement | Real-time price APIs |

## Participants

| Participant | Role | Notes | Classification |
| --- | --- | --- | --- |
| pricing-exporter | producer | Writes/publishes the batch file | Confirmed (example) |
| catalog-importer | consumer | Reads/imports the batch file | Confirmed (example) |

## Producer

| Field | Value | Classification |
| --- | --- | --- |
| System / component | pricing-exporter (fictional) | Confirmed (example) |
| Team / owner | example-team | Confirmed (example) |
| Evidence | fictional example | Confirmed (example) |

## Consumer

| Consumer | Notes | Classification |
| --- | --- | --- |
| catalog-importer (fictional) | Loads prices into catalog | Confirmed (example) |

## Contract Type

- [ ] API
- [ ] Event
- [ ] Message
- [x] File
- [ ] Command
- [ ] Callback
- [ ] Library
- [ ] Data
- [ ] Integration
- [ ] Other:

## Protocol

| Field | Value | Classification |
| --- | --- | --- |
| Protocol | File / object drop (technology-agnostic) | Confirmed (example) |
| Interaction style | batch | Confirmed (example) |

## Endpoint / Channel / Interface

| Field | Value | Classification |
| --- | --- | --- |
| Locator | drop path / object prefix `catalog/prices/` (logical) | Confirmed (example) |
| Method / operation / verb | Not Applicable | Confirmed (example) |
| Notes | Filename pattern: `prices_YYYYMMDD_HHMM_<seq>.batch` | Confirmed (example) |

## Request / Input

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| file header: `batch_id` | string | yes | Unique batch identifier | Confirmed (example) |
| file header: `generated_at` | string (ISO 8601) | yes | Generation time | Confirmed (example) |
| file header: `schema_version` | string | yes | e.g. `v1` | Confirmed (example) |
| record: `sku` | string | yes | Item identifier | Confirmed (example) |
| record: `unit_price` | decimal string | yes | Price amount (see semantics) | Confirmed (example) |
| record: `currency` | string | yes | ISO-like currency code | Confirmed (example) |
| record: `effective_from` | string (ISO 8601 date) | yes | Price effective date | Confirmed (example) |

## Response / Output

| Field / part | Type | Required | Description | Classification |
| --- | --- | --- | --- | --- |
| import result (side channel) | — | — | Success/failure reported via ops signal or receipt file if used | Confirmed (example) |

## Schema

```text
catalog.price-batch.v1:
  header:
    batch_id: string
    generated_at: string
    schema_version: "v1"
  records[]:
    sku: string
    unit_price: decimal-string
    currency: string
    effective_from: date
```

| Topic | Value | Classification |
| --- | --- | --- |
| Schema location | embedded in this document (example) | Confirmed (example) |
| Schema format | format-agnostic field model (CSV/JSON/Parquet/etc. chosen by project) | Confirmed (example) |

## Semantics

| Concept | Meaning | Side effects | Classification |
| --- | --- | --- | --- |
| `unit_price` | Major currency units as decimal string (e.g. `"19.90"`) | Importer must not reinterpret as cents | Confirmed (example) |
| Full-file replace vs upsert | Upsert by `sku` for this contract | Missing SKUs in file are not deleted | Confirmed (example) |

## Authentication

| Mechanism | Notes | Classification |
| --- | --- | --- |
| Storage credentials | Documented by name/source only | Confirmed (example) |

## Authorization

| Rule | Notes | Classification |
| --- | --- | --- |
| Write ACL | Only pricing-exporter may publish to drop location | Confirmed (example) |
| Read ACL | Only catalog-importer may consume | Confirmed (example) |

## Validation

| Rule | Applied where | Notes | Classification |
| --- | --- | --- | --- |
| Header complete | consumer | Reject whole file → quarantine | Confirmed (example) |
| Required record fields | consumer | Quarantine bad records or whole file per policy | Confirmed (example) |
| `schema_version` supported | consumer | Reject unsupported versions | Confirmed (example) |

## Errors

| Error / Condition | Retryable | Consumer Action | Classification |
| --- | --- | --- | --- |
| `file_incomplete` | yes (wait/retry fetch) | Do not partially import | Confirmed (example) |
| `schema_unsupported` | no | Quarantine; alert producer | Confirmed (example) |
| `record_invalid` | no | Quarantine record or file; do not silent-skip without policy | Confirmed (example) |
| `storage_unavailable` | yes | Retry with backoff | Confirmed (example) |

## Retry Behavior

| Topic | Value | Classification |
| --- | --- | --- |
| Retryable conditions | `file_incomplete`, `storage_unavailable` | Confirmed (example) |
| Max attempts | 5 | Confirmed (example) |
| Backoff | exponential | Confirmed (example) |
| Non-retryable conditions | `schema_unsupported`, corrupt payload | Confirmed (example) |

## Timeout

| Timeout | Value | Classification |
| --- | --- | --- |
| Business deadline | file expected by 06:00 local (illustrative) | Confirmed (example) |
| Import processing | 30m per batch (illustrative) | Confirmed (example) |

## Idempotency

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes | Confirmed (example) |
| Idempotency key / strategy | `batch_id` — re-import same batch is a no-op or safe upsert | Confirmed (example) |

## Ordering

| Topic | Value | Classification |
| --- | --- | --- |
| Ordering guarantee | by `generated_at` / filename sequence when multiple files arrive | Confirmed (example) |
| Notes | Apply older batches before newer when both pending | Confirmed (example) |

## Delivery Semantics

| Topic | Value | Classification |
| --- | --- | --- |
| Delivery guarantee | at-least-once (duplicate drops possible) | Confirmed (example) |
| Acknowledgement model | importer moves/marks file as processed | Confirmed (example) |
| Notes | Partial uploads must not be imported | Confirmed (example) |

## Versioning

| Topic | Value | Classification |
| --- | --- | --- |
| Current version | v1 (`schema_version`) | Confirmed (example) |
| Version strategy | new `schema_version` for breaking layout changes | Confirmed (example) |
| Deprecation policy | dual-support window for N days (project-defined) | Confirmed (example) |
| Contract ID | catalog.price-batch@v1 | Confirmed (example) |

## Compatibility

| Change type | Compatible? | Notes |
| --- | --- | --- |
| Additive optional field | yes | Prefer trailing/optional columns or nullable fields |
| Field removal | no | New `schema_version` |
| Type change | no | New `schema_version` |
| Semantic change | no | New `schema_version` (e.g. cents vs major units) |

## Size Limits

| Limit | Value | Classification |
| --- | --- | --- |
| Payload / message / file size | 100 MB illustrative max | Confirmed (example) |
| Other | split into multiple sequenced files if larger | Confirmed (example) |

## Examples

### Example — success

```text
header:
  batch_id: "batch-20260807-01"
  generated_at: "2026-08-07T05:00:00Z"
  schema_version: "v1"
records:
  - sku: "SKU-42"
    unit_price: "19.90"
    currency: "BRL"
    effective_from: "2026-08-08"
```

### Example — error

```text
# Incomplete upload detected (size/marker missing)
# → file_incomplete: do not import; retry fetch
```

## Related Components

| Component | Relationship | Path / ID |
| --- | --- | --- |
| pricing-exporter | producer | fictional |
| catalog-importer | consumer | fictional |

## Related Architecture

| Document | Path |
| --- | --- |
| Architecture overview | Not Applicable (standalone contract example) |
| Methodology | [docs/en/file-contracts.md](../../../../docs/en/file-contracts.md) |
