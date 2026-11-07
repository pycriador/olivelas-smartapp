# Architecture Review

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-review.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

When and how to review architecture documentation, integrated with the documentation lifecycle ([lifecycle.md](lifecycle.md), [review-policy.md](review-policy.md)).

## When to Review

Trigger an architecture documentation review when any of the following occur:

| Trigger | Examples |
| --- | --- |
| **Structural change** | New subsystem shape, split/merge of major units |
| **New component** | New architectural component or deployable unit |
| **Removed component** | Decommission or replacement |
| **Dependency change** | New, removed, or materially changed dependency |
| **Contract change** | Schema/semantics/compatibility of a published or consumed interface |
| **Boundary change** | System, trust, or ownership boundary shifts |
| **Significant flow change** | Primary data or control path changes behavior |
| **New ADR** | Architectural decision that affects structure or trade-offs |

Secondary triggers: staleness signals ([architecture-drift.md](architecture-drift.md), [stale-documentation.md](stale-documentation.md)), ownership change, or incident showing docs were wrong.

Prefer **change-driven** review over calendar rituals. There is no universal review frequency for all architecture docs.

## Who Reviews

| Role | Responsibility |
| --- | --- |
| **Owner** | Ensures docs are updated and review happens ([ownership.md](ownership.md)) |
| **Reviewer** | Engineers familiar with the system; optionally architect/EM role |
| **Consumers** | Producing/consuming teams when contracts or cross-system flows change |
| **Security-aware reviewer** | When trust boundaries or auth paths change |
| **Approver** | Optional; use when the project requires formal acceptance |

Owner ≠ sole reviewer for high-impact changes — prefer at least one reviewer who did not author the last major revision.

## What to Verify

Use [architecture-checklist.md](architecture-checklist.md) as the backbone, plus:

- claims match code, config, contracts, or accepted ADRs — or are classified;
- diagrams match current state unless labeled Proposed;
- relationship edges are labeled ([component-relationships.md](component-relationships.md));
- failure and trust sections remain accurate when those views apply;
- ADR and contract links resolve;
- no secrets or unnecessary sensitive data;
- status, owner, and `updated` metadata are correct;
- bilingual pairs stay aligned when the project adopts [language.md](language.md).

## How to Record

For material architecture reviews, create a short record from [templates/review-record.md](templates/review-record.md):

- document(s) reviewed;
- date;
- reviewers;
- result (`Pass` / `Pass with follow-ups` / `Fail`);
- follow-ups, documentation debt IDs, or architecture debt IDs.

Lightweight PR review is enough for small, well-scoped updates. Prefer a review record when the change is broad, cross-team, security-sensitive, or closes a drift remediation.

## Status Updates (Lifecycle)

Architecture docs use the same status tokens as the rest of the standard:

```text
DRAFT → REVIEW → ACCEPTED → DEPRECATED → ARCHIVED
```

| Situation | Status action |
| --- | --- |
| New architecture doc | Start `DRAFT`, move to `REVIEW`, then `ACCEPTED` |
| Relevant change to an `ACCEPTED` doc | `ACCEPTED → REVIEW → ACCEPTED` (update cycle; not a status named `UPDATED`) |
| Superseded overview | `DEPRECATED` with `replaced_by` when available |
| Historical only | `ARCHIVED` per [archive-policy.md](archive-policy.md) |

Do not invent alternate status tokens. Details: [status.md](status.md), [lifecycle.md](lifecycle.md).

## Related Documents

- [architecture-checklist.md](architecture-checklist.md)
- [architecture-drift.md](architecture-drift.md)
- [architecture-debt.md](architecture-debt.md)
- [review-policy.md](review-policy.md)
- [lifecycle.md](lifecycle.md)
- [templates/review-record.md](templates/review-record.md)
- [architecture/README.md](architecture/README.md)
