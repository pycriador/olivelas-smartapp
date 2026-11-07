# Document Metadata

> Language: EN | [Português (pt-BR)](../pt-BR/document-metadata.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Canonical YAML metadata fields for AI-ready and substantive project documentation.

Aligns with and extends [standards.md](standards.md) Document Metadata. When both YAML and the header blockquote declare `status`, YAML is authoritative; keep them consistent.

## Required Fields

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable document identity (see [document-identity.md](document-identity.md)) |
| `title` | string | Document title |
| `type` | string | Document type token from [document-types.md](document-types.md) |
| `status` | enum | `DRAFT` \| `REVIEW` \| `ACCEPTED` \| `DEPRECATED` \| `ARCHIVED` |
| `owner` | string | Durable team, squad, or role |
| `created` | date | Creation date (`YYYY-MM-DD`) |
| `updated` | date | Last meaningful content update (`YYYY-MM-DD`) |

## Recommended Fields

| Field | Type | Meaning |
| --- | --- | --- |
| `source` | string / list | Authoritative origin(s): code path, contract id, ADR, config, ticket URL |
| `classification` | string | Default claim classification for uncertain content when useful (`Confirmed` / `Inferred` / `Unknown` / `Proposed`) |
| `review` | object / fields | Review tracking — prefer `review_date`, optional `reviewers`, `approver`, `next_review` |

Recommended review shape:

```yaml
review_date: 2026-08-07
reviewers:
  - platform-team
approver: engineering-manager
next_review: 2026-11-07
```

## Optional Fields

| Field | Type | Meaning |
| --- | --- | --- |
| `version` | string | Document content version ([versioning.md](versioning.md)) |
| `authority` | string | Authority level ([authority-levels.md](authority-levels.md)) |
| `confidence` | string | Default confidence for synthesized summaries — **not** lifecycle status ([confidence-model.md](confidence-model.md)) |
| `replaces` | string / list | Prior document id(s) or path(s) |
| `replaced_by` | string | Successor when deprecated |
| `deprecated_on` | date | Deprecation date |
| `deprecation_reason` | string | Why deprecated |
| `tags` | list | Free-form project tags (keep small) |
| `related` | list | Related document ids or relative paths |
| `components` | list | Component ids this doc covers |
| `services` | list | Service ids this doc covers |
| `language` | string | `en` or `pt-BR` when useful for tooling |
| `standard` | string | e.g. `Documentation Standard v1.0` |

## Example

```yaml
---
id: ARCH-001
title: Checkout Architecture Overview
type: Architecture
status: ACCEPTED
owner: platform-team
created: 2026-01-10
updated: 2026-08-07
source:
  - src/checkout/
  - ADR-012
classification: Confirmed
review_date: 2026-08-07
reviewers:
  - platform-team
approver: engineering-manager
version: "1.2.0"
authority: Authoritative
related:
  - CONTRACT-001
  - OPS-001
---
```


## Enforcement

Not every document in a corpus must carry every Required field on day one. For **Authoritative** documents listed in the manifest, automation enforces `owner` (and path/id consistency). See [validation-rules.md](validation-rules.md) and [../validation-config.yaml](../validation-config.yaml).

Adopting projects may tighten Required fields gradually via governance exceptions — never by silencing ERROR without a record.

## Rules

1. Do not invent owners; use Unknown ownership process from [ownership.md](ownership.md).
2. Do not set `status: ACCEPTED` via AI alone ([ai-documentation.md](ai-documentation.md)).
3. `classification` in metadata is a **default**, not a blanket claim that every sentence is Confirmed.
4. Keep bilingual pairs consistent when both languages exist ([language.md](language.md)).

## Related Documents

- [standards.md](standards.md)
- [document-identity.md](document-identity.md)
- [document-types.md](document-types.md)
- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
