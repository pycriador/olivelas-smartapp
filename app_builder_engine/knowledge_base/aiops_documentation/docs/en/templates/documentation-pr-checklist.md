# Documentation PR Checklist

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/documentation-pr-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Copy into a pull request description or use as a review checklist when documentation changes (alone or with code).

Not every item applies to every PR. Mark N/A explicitly.

## Scope

- [ ] Relevant docs updated for this change ([change-policy.md](../change-policy.md))
- [ ] Canonical documents edited (no conflicting duplicates)
- [ ] Root README document index + language READMEs updated when docs structure/packs change (or N/A)
- [ ] Diagrams updated or labeled Proposed when not current state
- [ ] ADRs added/updated when a material decision was made

## Lifecycle and Metadata

- [ ] `status` is one of `DRAFT` | `REVIEW` | `ACCEPTED` | `DEPRECATED` | `ARCHIVED`
- [ ] No invented statuses (`FINAL`, `DONE`, `UPDATED` as token, etc.)
- [ ] `ACCEPTED` docs with relevant edits moved through `REVIEW` when required
- [ ] YAML frontmatter present for substantive docs (`title`, `status`, `owner`, `updated`)
- [ ] `updated` set to today (`YYYY-MM-DD`) when content changed
- [ ] Owner set or still correct ([ownership.md](../ownership.md))
- [ ] Deprecated docs include Replaced by, Deprecated on, Reason

## Quality

- [ ] No invented facts; unknowns marked Unknown / Inferred / Proposed as needed
- [ ] No secrets, credentials, or secret values
- [ ] Links and identifiers resolve
- [ ] Terminology consistent with related docs
- [ ] Security / ops / contract impacts covered when applicable

## Bilingual (when [language.md](../language.md) applies)

- [ ] EN and pt-BR paths updated together when possible
- [ ] Cross-language link present at the top of each document
- [ ] Machine tokens remain English (Status, Classification, IDs)
- [ ] Lagging translation marked `Translation status: pending` if needed

## Review

- [ ] Appropriate review type completed (Technical / Operational / Mandatory for security)
- [ ] Review record created when material ([review-record.md](review-record.md))
- [ ] Documentation debt filed for deferred follow-ups ([documentation-debt.md](../documentation-debt.md))

## Sign-off

| Field | Value |
| --- | --- |
| Author | |
| Reviewers | |
| Date | YYYY-MM-DD |
| Result | Pass / Pass with follow-ups / Fail |
| Debt IDs | |

## Related Documents

- [../change-policy.md](../change-policy.md)
- [../review-policy.md](../review-policy.md)
- [../lifecycle.md](../lifecycle.md)
- [../documentation-checklist.md](../documentation-checklist.md)
