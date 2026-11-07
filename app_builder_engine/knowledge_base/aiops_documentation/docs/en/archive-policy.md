# Archive Policy

> Language: EN | [Português (pt-BR)](../pt-BR/archive-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Archive keeps historical documentation available without presenting it as current guidance.

This policy is technology-agnostic. Adopting projects choose storage that fits their repository layout.

## When to Archive

Archive when:

- the document has **no operational use**;
- it is already `DEPRECATED` (or was abandoned as `DRAFT` with justification);
- readers should not treat it as active guidance;
- history still has value for audits, migrations, or learning.

Do not archive documents that on-call or integrators still need. Deprecate first if a replacement exists.

## Where to Archive

Suggested location:

```text
docs/archive/
```

or the project's equivalent (for example `docs/en/archive/` in bilingual trees).

Practices:

- preserve enough path clarity to recognize the original topic;
- keep language mirrors consistent when the project is bilingual;
- avoid scattering archived files without an index if the archive grows.

Example:

```text
docs/archive/contracts/order-created-v1.md
```

## How to Archive

1. Confirm no operational dependency remains.
2. Set `status: ARCHIVED` in metadata (and blockquote if used).
3. Preserve context: title, former purpose, replacement link, deprecation reason/date when applicable.
4. Move the file to the archive location (or mark in place if the project uses in-place archive markers — prefer a dedicated archive area when practical).
5. Update links from active docs; active docs should point to replacements, not rely on archived pages.
6. Record the change in the PR that archives the document.

Header example:

```markdown
# Order Created v1 (Archived)

> Language: EN | [Português (pt-BR)](../../pt-BR/archive/contracts/order-created-v1.md)
>
> Status: ARCHIVED
>
> Documentation Standard v1.0

> Replaced by: [order-updated.md](../../contracts/order-updated.md)
> Deprecated on: 2026-01-15
> Archived on: 2026-08-07
> Reason: Contract retired after v2 migration
```

## Preserve Context

Archived documents should still answer:

- what this used to describe;
- why it was removed from active use;
- what replaced it, if anything.

Do not strip the body to a stub unless legal or security policy requires redaction. If redacting, note that content was removed and why.

## Permanent Removal (Rare)

Permanent deletion is exceptional. Consider it only when:

- content must not remain in the repository (legal, security, or secret exposure — rotate secrets first if exposure occurred);
- retention policy explicitly requires removal;
- the file has no historical value and creates active harm (for example duplicated secrets — remove and rotate).

Normal lifecycle ends at `ARCHIVED`, not at delete. Prefer archive + git history over silent removal.

If permanent removal is required, document the removal decision outside the deleted file (PR description, ADR, or security incident notes as appropriate) without re-storing secrets.

## Related Documents

- [lifecycle.md](lifecycle.md)
- [deprecation.md](deprecation.md)
- [status.md](status.md)
- [stale-documentation.md](stale-documentation.md)
