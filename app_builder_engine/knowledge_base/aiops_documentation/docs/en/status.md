# Document Status Policy

> Language: EN | [Português (pt-BR)](../pt-BR/status.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Status tells readers how much they can trust a document as current guidance.

## Allowed Status Tokens

Only these English machine tokens are valid:

| Status | Meaning |
| --- | --- |
| `DRAFT` | Work in progress; may be incomplete or wrong |
| `REVIEW` | Ready for or under review |
| `ACCEPTED` | Approved as current documentation |
| `DEPRECATED` | Superseded or no longer the primary source |
| `ARCHIVED` | Historical only; not active guidance |

Do **not** invent or store statuses such as `FINAL`, `DONE`, `OK`, `GOOD`, `OLD`, `TEMP`, or `UPDATED`.

`UPDATED` describes an update cycle (`ACCEPTED → REVIEW → ACCEPTED`), not a stored token. See [lifecycle.md](lifecycle.md).

## When to Use Each Status

### DRAFT

Use when:

- content is still being written;
- structure exists but evidence is incomplete;
- the document is not ready for formal review.

Do not use `DRAFT` for documents that teams already treat as authoritative production guidance.

### REVIEW

Use when:

- the author believes the document is ready to evaluate;
- a relevant change moved an `ACCEPTED` doc back into review;
- reviewers are actively checking accuracy and completeness.

Do not leave `REVIEW` indefinitely. Close to `ACCEPTED` or return to `DRAFT`.

### ACCEPTED

Use when:

- review is complete for the current scope;
- the document is the approved current description or guidance;
- unknowns and limitations are explicit rather than hidden.

Owner is recommended for `ACCEPTED` docs. See [ownership.md](ownership.md).

### DEPRECATED

Use when:

- a newer document or design replaced this one;
- the topic is no longer primary but readers may still find the file;
- you need a visible warning before archive.

Required markers: see [deprecation.md](deprecation.md).

### ARCHIVED

Use when:

- the document has no operational use;
- it is kept only for history or audit context.

See [archive-policy.md](archive-policy.md).

## Relationship to YAML Metadata

Prefer YAML frontmatter for substantive docs:

```yaml
---
title: Checkout Architecture
status: ACCEPTED
owner: platform-team
updated: 2026-08-07
---
```

The `status` field must use one of the five allowed tokens above.

For short docs, the blockquote form remains acceptable:

```markdown
> Status: ACCEPTED
```

When both exist, YAML `status` is authoritative. Keep them consistent.

Full metadata rules: [standards.md](standards.md) — Document Metadata.

## Allowed Transitions

Follow the transition matrix in [lifecycle.md](lifecycle.md). Summary:

| From | To |
| --- | --- |
| `DRAFT` | `REVIEW`, `ARCHIVED` |
| `REVIEW` | `ACCEPTED`, `DRAFT` |
| `ACCEPTED` | `REVIEW`, `DEPRECATED` |
| `DEPRECATED` | `ARCHIVED` |

Any other transition requires an explicit exception recorded in review notes.

## Responsibilities

| Role | Responsibility |
| --- | --- |
| Author / Contributor | Set `DRAFT` or move to `REVIEW` when ready; keep status honest |
| Reviewer | Challenge accuracy; request `DRAFT` if not ready; do not accept invented facts |
| Approver / Owner | Confirm `ACCEPTED` (or equivalent team process); ensure owner is recorded |
| Anyone discovering staleness | Open review or register documentation debt — do not invent a "stale" status |

## Deprecation and Archive Callouts

When status is `DEPRECATED`:

- set `Status: DEPRECATED` (YAML or blockquote);
- record **Replaced by**, **Deprecated on**, and **Reason**;
- keep the document readable until archive.

When status is `ARCHIVED`:

- move or mark per [archive-policy.md](archive-policy.md);
- do not present archived content as current guidance;
- preserve enough context for history.

## Forbidden Practices

- Using free-form status strings in metadata.
- Skipping `REVIEW` for substantive project docs that claim `ACCEPTED`.
- Treating `DEPRECATED` as a soft delete without markers.
- Encoding freshness as a status (`UPDATED`, `STALE`, `OLD`).

## Related Documents

- [lifecycle.md](lifecycle.md)
- [ownership.md](ownership.md)
- [review-policy.md](review-policy.md)
- [deprecation.md](deprecation.md)
- [archive-policy.md](archive-policy.md)
- [standards.md](standards.md)
