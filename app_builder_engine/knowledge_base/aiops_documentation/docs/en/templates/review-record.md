# Documentation Review Record

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/review-record.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Template for recording a documentation review (change-driven or periodic).

Copy into the adopting project (for example `docs/reviews/YYYY-MM-DD-<doc-slug>.md`) or attach the filled table to a PR.

## Review Record

| Field | Value |
| --- | --- |
| Document | path/or/title |
| Document status before | DRAFT / REVIEW / ACCEPTED / DEPRECATED / ARCHIVED |
| Document status after | DRAFT / REVIEW / ACCEPTED / DEPRECATED / ARCHIVED |
| Review type | Change-driven / Periodic / Security / Operational / Other |
| Trigger | What prompted the review |
| Review date | YYYY-MM-DD |
| Reviewers | teams/roles/people |
| Owner | team/squad/role |
| Result | Pass / Pass with follow-ups / Fail |
| Summary | short outcome |
| Follow-ups | actions or `None` |
| Debt IDs | e.g. DOC-014 or `None` |
| Evidence checked | code, config, contract, ADR, runtime, etc. |

## Checklist (optional)

- [ ] Claims accurate or classified (Confirmed / Inferred / Unknown / Proposed)
- [ ] No secrets or unnecessary sensitive data
- [ ] Metadata current (`status`, `owner`, `updated`, …)
- [ ] Links and diagrams consistent
- [ ] Replacement/deprecation markers present if applicable
- [ ] Bilingual pair aligned if language policy applies

## Notes

<!-- Free-form notes. Keep factual. -->

## Related Documents

- [../review-policy.md](../review-policy.md)
- [../lifecycle.md](../lifecycle.md)
- [../documentation-debt.md](../documentation-debt.md)
- [documentation-pr-checklist.md](documentation-pr-checklist.md)
