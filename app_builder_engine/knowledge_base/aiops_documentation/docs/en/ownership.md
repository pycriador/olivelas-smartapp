# Documentation Ownership

> Language: EN | [Português (pt-BR)](../pt-BR/ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Ownership makes documentation maintainable. Without a clear owner, docs rot silently.

## Roles

| Role | Required? | Meaning |
| --- | --- | --- |
| **Owner** | Recommended for `ACCEPTED` docs; strongly recommended for substantive docs | Stable team, squad, or role accountable for keeping the document accurate |
| **Contributor** | Optional | People who write or update content without owning the whole document |
| **Reviewer** | Optional | People who review for technical or operational accuracy |
| **Approver** | Optional | Person or role that confirms acceptance when the team uses a formal approval step |

Owner is a **team, squad, or role**, not a personal name that disappears when someone leaves. Personal names may appear in review records, but metadata should prefer durable identifiers.

Examples of good owners:

- `platform-team`
- `payments-squad`
- `sre-oncall`
- `security-engineering`

Avoid:

- only a person's first name with no team;
- empty owner on long-lived `ACCEPTED` docs.

## When Owner Is Expected

| Document type | Owner expectation |
| --- | --- |
| Architecture, contracts, runbooks, security, observability | Owner recommended before or at `ACCEPTED` |
| ADRs | Owner or decision group recommended |
| Short notes / scratch docs | Owner optional |
| `DEPRECATED` / `ARCHIVED` | Keep last known owner when useful for history |

## How to Assign

1. Choose the team or role that will feel the pain if the doc is wrong.
2. Record `owner` in YAML frontmatter (preferred) or in the document header metadata.
3. Optionally list `reviewers` and `approver`.
4. For inventories across many docs, use [templates/ownership-matrix.md](templates/ownership-matrix.md).

Example:

```yaml
---
title: Order API Contract
status: ACCEPTED
owner: checkout-squad
reviewers:
  - platform-team
approver: checkout-em
updated: 2026-08-07
---
```

## How to Transfer

1. Agree the new owner (team/squad/role).
2. Update `owner` in metadata in the same change that transfers responsibility.
3. Notify the new owner through the project's normal channel (PR review is enough when they approve).
4. If the document is under active change, keep status honest (`REVIEW` if material edits are in flight).

Do not leave ownership blank after a reorg. Prefer an interim team owner over "nobody".

## Recording Ownership

| Field | Where | Notes |
| --- | --- | --- |
| `owner` | YAML frontmatter | Preferred |
| `reviewers` | YAML optional | List of teams/roles or handles per project convention |
| `approver` | YAML optional | Single role or person when used |
| Ownership matrix | Optional project doc | Cross-doc view; not a substitute for per-doc `owner` |

Blockquote form for short docs:

```markdown
> Status: ACCEPTED
> Owner: platform-team
```

## Responsibilities Snapshot

| Role | Typical duties |
| --- | --- |
| Owner | Ensure updates after relevant changes; trigger review; accept or reject stale content |
| Contributor | Propose accurate updates; mark unknowns; do not invent facts |
| Reviewer | Verify claims against evidence; request classification when certainty is unclear |
| Approver | Confirm readiness for `ACCEPTED` when the team uses that step |

## Related Documents

- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [review-policy.md](review-policy.md)
- [standards.md](standards.md)
- [templates/ownership-matrix.md](templates/ownership-matrix.md)
