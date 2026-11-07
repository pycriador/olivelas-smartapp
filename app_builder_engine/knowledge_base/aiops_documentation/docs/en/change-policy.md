# Documentation Change Policy

> Language: EN | [Português (pt-BR)](../pt-BR/change-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Core Rule

A **relevant technical change is not complete** until the required documentation is updated.

Code, infrastructure, and contracts ship with the docs that keep operators, integrators, and future engineers oriented. "We'll document later" is unfinished work unless tracked as explicit documentation debt with owner and priority.

Not every code change needs a docs update. Internal refactors with no external, operational, or architectural impact may need none.

## Change Matrix

| Change | Update docs? | Review |
| --- | --- | --- |
| New component | Yes | Technical |
| Component responsibility change | Yes | Technical |
| Contract change (API, event, message, file, command) | Yes | Technical |
| Behavior change visible to users or integrators | Yes | Technical |
| Architecture / boundary change | Yes | Technical |
| Infrastructure change (env, resources, networking, scaling) | Yes | Technical |
| Security change (auth, secrets, trust boundary, encryption) | Yes | Mandatory |
| Operational change (runbook, escalation, recovery) | Yes | Operational |
| Observability change (alerts, SLOs, critical dashboards) | Yes | Technical / Operational |
| Dependency change with operational or integration impact | Yes | Technical |
| ADR-worthy decision | Yes (ADR + related current-state docs) | Technical |
| Internal fix / refactor with no external or ops impact | Evaluate | Optional |
| Typo or formatting-only docs change | Docs only | Optional |
| Example or comment-only code change | Usually no | Optional |

**Evaluate** means: check whether any overview, contract, runbook, security, or architecture statement became false. If yes, update; if clearly no, skip.

## Completing a Change

For changes that require docs:

1. Update the canonical documents (avoid duplicate divergent edits).
2. Set status to `REVIEW` when editing an `ACCEPTED` substantive doc ([lifecycle.md](lifecycle.md)).
3. Update metadata (`updated`, owner if needed).
4. Get the review type listed in the matrix.
5. Return to `ACCEPTED` when review passes, or open [documentation debt](documentation-debt.md) for deferred follow-ups with explicit acceptance of risk.

Use [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md) on the pull request.

## What "Update Docs" Means

Depending on the change:

- correct current-state description;
- update contracts and compatibility notes;
- adjust diagrams;
- revise runbooks and troubleshooting;
- add or amend ADRs for material decisions;
- deprecate replaced documents instead of leaving silent contradiction.

Editorial polish alone is not a substitute for updating the documents that carry operational truth.

## Exceptions

Document exceptions as debt when docs cannot ship in the same change:

| Field | Required |
| --- | --- |
| Why docs lag | Short justification |
| Owner | Who will finish |
| Priority | High / Medium / Low |
| Target | Issue, ticket, or debt ID |

Untracked lag is not an exception — it is debt discovery waiting to happen.

## Related Documents

- [lifecycle.md](lifecycle.md)
- [review-policy.md](review-policy.md)
- [documentation-debt.md](documentation-debt.md)
- [changelog-policy.md](changelog-policy.md)
- [stale-documentation.md](stale-documentation.md)
