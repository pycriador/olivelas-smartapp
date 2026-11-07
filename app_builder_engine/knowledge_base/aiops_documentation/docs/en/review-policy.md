# Documentation Review Policy

> Language: EN | [Português (pt-BR)](../pt-BR/review-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Review exists to keep documentation trustworthy. Prefer **change-driven** review over calendar rituals.

## Principles

1. A relevant technical change is incomplete until required docs are updated and reviewed as needed ([change-policy.md](change-policy.md)).
2. Periodic review is secondary — use it when change signals are weak or risk is high.
3. There is **no universal frequency** that fits every document.

## Review Triggers (Primary)

Start or require a documentation review when any of the following change:

| Trigger | Examples |
| --- | --- |
| Architecture | Boundaries, components, data flow, failure domains |
| Contract | API/event/message schema, semantics, compatibility |
| Behavior | User-visible or integrator-visible behavior shifts |
| Infrastructure | Environments, resources, networking, scaling assumptions |
| Security | AuthN/AuthZ, secrets handling, trust boundaries, threat model |
| Operations | Runbooks, escalation, recovery, on-call procedures |
| Critical dependency | New, removed, or materially changed dependency that operators or integrators must know |
| Incorrect information | Known wrong or misleading claims in existing docs |

When a trigger fires on an `ACCEPTED` document, move status to `REVIEW` (update cycle), fix content, then return to `ACCEPTED` after review. See [lifecycle.md](lifecycle.md).

## Who Reviews

| Content | Typical reviewer |
| --- | --- |
| Architecture / design | Engineers familiar with the system; optionally EM or architect role |
| Contracts | Producing and consuming sides when possible |
| Security | Security-aware engineer or security role |
| Operations / runbooks | On-call or ops-owning team |
| Observability | Team that owns alerts and dashboards |

Owner ensures review happens. Reviewer challenges accuracy. Approver is optional. See [ownership.md](ownership.md).

## What to Check

At minimum:

- claims match code, config, contracts, or accepted ADRs — or are classified (`Confirmed` / `Inferred` / `Unknown` / `Proposed`);
- no secrets or unnecessary sensitive data;
- links and identifiers still resolve;
- diagrams match current state unless labeled Proposed;
- status, owner, and `updated` metadata are correct;
- deprecated docs point to replacements when available;
- bilingual pairs stay aligned when the project adopts [language.md](language.md).

Use [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md) on pull requests.

## How to Record a Review

For material reviews, create a short record from [templates/review-record.md](templates/review-record.md):

- document reviewed;
- date;
- reviewers;
- result (`Pass` / `Pass with follow-ups` / `Fail`);
- follow-ups or documentation debt IDs.

Lightweight PR review is enough for small, well-scoped updates. Prefer a review record when the change is broad, security-sensitive, or closes a periodic review.

## Periodic Review (Secondary)

Periodic review is optional tooling for risk management — not a mandatory cadence for every file.

### When to use

Consider periodic review when:

- the document is high impact (security, production runbooks, public contracts) and changes are infrequent;
- ownership changed or tribal knowledge left the team;
- staleness signals appear ([stale-documentation.md](stale-documentation.md));
- an audit or incident showed docs were wrong or missing.

Do **not** invent a global "review every N months" rule for all docs. Choose a cycle per document or category when it adds value, and record it in the ownership matrix if useful.

### Who reviews

Same roles as change-driven review. Prefer the current owner plus at least one reviewer who did not write the last major revision when risk is high.

### How to record

- Set or update `review_date` in metadata when used.
- File a [review-record](templates/review-record.md) for the outcome.
- Move `ACCEPTED → REVIEW → ACCEPTED` if material edits are required.
- Open documentation debt for deferred fixes ([documentation-debt.md](documentation-debt.md)).

### What to check

Same checklist as change-driven review, plus:

- still the right canonical document for the topic;
- replacements exist if the doc should be deprecated;
- operational procedures still match reality.

### What if stale

| Finding | Action |
| --- | --- |
| Minor drift | Fix in place; update `updated`; keep or briefly revisit `REVIEW` |
| Material drift | `REVIEW`, correct, re-accept; log debt for unfinished items |
| Superseded | Deprecate with markers ([deprecation.md](deprecation.md)) |
| No operational use | Archive ([archive-policy.md](archive-policy.md)) |
| Unknown ownership | Assign owner before treating the doc as governed |

Age alone is not proof of staleness — it is a signal. See [stale-documentation.md](stale-documentation.md).

## Related Documents

- [lifecycle.md](lifecycle.md)
- [change-policy.md](change-policy.md)
- [ownership.md](ownership.md)
- [stale-documentation.md](stale-documentation.md)
- [documentation-debt.md](documentation-debt.md)
- [templates/review-record.md](templates/review-record.md)
- [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md)
