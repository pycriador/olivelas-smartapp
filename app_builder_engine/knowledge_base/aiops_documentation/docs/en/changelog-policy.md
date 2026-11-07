# Changelog Policy

> Language: EN | [Português (pt-BR)](../pt-BR/changelog-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Changelogs help humans and agents see what changed in documentation that matters. They are optional tooling, not a requirement for every edit.

## When a Changelog Adds Value

Record changelog entries when the change:

- alters contracts or compatibility expectations;
- changes architecture or operational procedures;
- deprecates or archives substantive docs;
- introduces a new mandatory or recommended documentation category;
- bumps this documentation standard version ([versioning.md](versioning.md));
- changes security or observability guidance in a way operators must notice.

For adopting projects, a docs changelog is useful when external consumers or multiple teams rely on the docs set.

## When Not to Bother

Skip changelog noise for:

- typo and formatting fixes;
- link repairs without semantic change;
- rephrasing that does not change meaning;
- template whitespace or style-only edits;
- routine translation sync with no semantic delta.

Git history remains the source of truth for those edits.

## What to Record

Keep entries short and scannable:

| Field | Guidance |
| --- | --- |
| Date | `YYYY-MM-DD` |
| Summary | One or two sentences on **why** it matters |
| Impact | Who should re-read (operators, integrators, all) |
| Links | Paths to changed docs or PRs |
| Standard version | When the standard itself changes (`v1.0` → `v1.1`, etc.) |

Example:

```markdown
## 2026-08-07

- Documentation Standard v1.0: added lifecycle governance (status, ownership, review, debt).
- Impact: authors of substantive docs should adopt YAML metadata and lifecycle transitions.
- See: docs/en/lifecycle.md, docs/en/standards.md
```

## Placement

Projects may use:

- `CHANGELOG.md` at the docs root;
- a section in the project README;
- release notes that include a Documentation subsection.

Pick one canonical place. Do not maintain three divergent changelogs.

## Relationship to Document Versioning

Individual document content versioning (PATCH/MINOR/MAJOR) is separate from the standard version and from changelog entries. See [versioning.md](versioning.md) — Document content versioning.

A changelog entry may mention a document version bump when that helps consumers; it does not replace accurate `status` and `updated` metadata.

## Related Documents

- [changelog.md](changelog.md) — this repository’s canonical log
- [versioning.md](versioning.md)
- [change-policy.md](change-policy.md)
- [lifecycle.md](lifecycle.md)
- [deprecation.md](deprecation.md)
