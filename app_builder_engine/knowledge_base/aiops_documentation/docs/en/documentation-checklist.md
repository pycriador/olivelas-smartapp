# Documentation Checklist

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Minimum quality checklist for project documentation adopting this standard.

Use before opening a pull request or accepting AI-generated documentation.

Not every item applies to every project. Mark non-applicable items explicitly as N/A rather than skipping silently.

## Content

- [ ] Objective documented
- [ ] Scope documented
- [ ] Non-goals documented when relevant
- [ ] Architecture documented (current state)
- [ ] Components identified
- [ ] Dependencies identified
- [ ] Integrations identified
- [ ] Contracts documented when interfaces exist
- [ ] Security documented
- [ ] Operation documented
- [ ] Observability documented when applicable
- [ ] Known limitations documented
- [ ] Decisions recorded as ADRs when material choices exist

## Quality

- [ ] Information is verifiable or explicitly classified (Confirmed / Inferred / Unknown / Proposed)
- [ ] No invented information
- [ ] No secrets, credentials, or secret values
- [ ] Links resolve
- [ ] Packs synced to Confluence follow dual-surface link rules ([publishing-surfaces.md](publishing-surfaces.md)): relative inter-doc links, `repository_url` / footer, GitHub blob links for code citations
- [ ] Diagrams are updated and labeled correctly (current vs proposed)
- [ ] Terminology is consistent across documents
- [ ] No unnecessary duplication (canonical sources are linked)
- [ ] Heading hierarchy is consistent
- [ ] Technology-specific details are evidenced, not assumed by the standard
- [ ] Document represents current state (or is correctly labeled Proposed / DEPRECATED)

## Lifecycle and metadata

- [ ] Status defined (`DRAFT` / `REVIEW` / `ACCEPTED` / `DEPRECATED` / `ARCHIVED`)
- [ ] YAML frontmatter present for substantive docs (`title`, `status`, `owner`, `updated`)
- [ ] Owner defined when applicable
- [ ] `review_date` / periodic review considered when applicable
- [ ] References updated after renames or structural changes
- [ ] Deprecated documents point to replacements when available
- [ ] Relevant technical changes have matching documentation updates ([change-policy.md](change-policy.md))

## Bilingual documentation (this standard)

Required for documents in this repository. Optional for adopting projects unless they adopt [language.md](language.md).

- [ ] EN and pt-BR versions exist with the same relative path
- [ ] Cross-language link present at the top of each document
- [ ] Machine tokens remain in English (Status, Classification, IDs)
- [ ] Both languages updated in the same change when possible
- [ ] Lagging translation marked with `Translation status: pending` when applicable

## AI-Assisted Documentation (when applicable)

- [ ] Evidence summary present or references embedded
- [ ] Unknowns explicitly listed
- [ ] No code changes included in a docs-only change
- [ ] Human review completed before `ACCEPTED`
- [ ] AI did not auto-set `ACCEPTED`

## Sign-off

| Field | Value |
| --- | --- |
| Reviewed by | |
| Date | YYYY-MM-DD |
| Result | Pass / Pass with follow-ups / Fail |
| Follow-ups | |

## Related Documents

- [principles.md](principles.md)
- [lifecycle.md](lifecycle.md)
- [standards.md](standards.md)
- [style-guide.md](style-guide.md)
- [ai-documentation.md](ai-documentation.md)
- [quality-model.md](quality-model.md)
- [language.md](language.md)
- [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md)
