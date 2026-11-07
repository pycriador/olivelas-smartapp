# Error Budget

> Language: EN | [Português (pt-BR)](../pt-BR/error-budget.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document error budgets when a project uses SLO-based reliability management.

If the project has no SLOs or no error-budget practice, state **Not Applicable** or **Not Defined**. Do not invent a budget policy.

## Concept

An **error budget** is the allowed amount of unreliability in a period, derived from an SLO.

Example (illustrative only):

- SLO: 99.9% successful requests over 30 days
- Allowed failure fraction: 0.1%
- Error budget: 0.1% of eligible events (or equivalent downtime for availability SLIs)

Exact formulas depend on the SLI definition ([service-levels.md](service-levels.md)).

## Calculation (Document the Project’s Formula)

Record:

| Field | Content |
| --- | --- |
| SLI / SLO | Reference |
| Window | e.g. 28-day rolling |
| Budget definition | How remaining budget is computed |
| Measurement source | Same source as the SLI, or document differences |
| Classification | Confirmed / Inferred / Unknown / Proposed |

If calculation is Unknown, say so — do not copy a vendor default as Confirmed.

## Consumption

Document how budget is consumed and reported:

| Topic | Question |
| --- | --- |
| What burns budget | Failed events, downtime, SLO misses — as defined |
| What does not | Exclusions actually applied (bad client input, planned maintenance — only if true) |
| Visibility | Who sees burn rate / remaining budget |
| Thresholds | When burn triggers review, freeze, or incident |

## Change Impact

Error budget exists to make **reliability vs change** trade-offs explicit. Document the project’s policy, for example:

| Remaining budget (example policy) | Typical stance (example) |
| --- | --- |
| Healthy | Normal change velocity |
| Fast burn | Slow risky changes; prioritize reliability work |
| Exhausted | Freeze non-essential changes affecting the SLI; focus on recovery and hardening |

Replace the example with the **actual** policy. If there is no policy: **Not Defined**.

## Suggested Policy Block

Projects should record:

1. Whether error budgets are used (yes / no / planned).
2. Linked SLOs.
3. Who decides when budget exhaustion changes release policy ([operational-ownership.md](operational-ownership.md)).
4. What happens to incidents that burn budget ([incident-management.md](incident-management.md)).
5. How corrective actions are prioritized ([corrective-actions.md](corrective-actions.md)).

## Anti-Patterns

- Publishing an SLO without a budget or without ownership of burn.
- Using budget exhaustion as blame instead of prioritization.
- Excluding failures ad hoc to “save” the budget without documenting exclusions.

## Related Documents

- [service-levels.md](service-levels.md)
- [alerting.md](alerting.md)
- [post-incident-review.md](post-incident-review.md)
- [corrective-actions.md](corrective-actions.md)
- [operations-model.md](operations-model.md)
