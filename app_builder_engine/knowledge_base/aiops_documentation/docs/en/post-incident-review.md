# Post-Incident Review

> Language: EN | [Português (pt-BR)](../pt-BR/post-incident-review.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to run and document a **blameless** post-incident review (PIR / postmortem).

The goal is learning and safer systems — not finding a person to fault.

## Blameless Principle

- Assume people acted reasonably with the information, tools, and incentives they had.
- Focus on systems, processes, signals, and design.
- Name roles and decisions; do not humiliate individuals.
- Psychological safety is required for honest timelines and hypotheses.

If a review is not blameless, it will optimize for silence, not reliability.

## When to Hold One

| Guidance | |
| --- | --- |
| SEV-1 / SEV-2 (or project equivalent) | Usually yes |
| Novel failure or near miss | Often yes |
| Repeat SEV-3 with rising trend | Consider |
| Trivial SEV-4 | Optional / lightweight |

If the project has no PIR practice: **Not Defined** — do not fake a template fill.

## Inputs

- [incident-timeline.md](incident-timeline.md) with FACT / HYPOTHESIS / CONFIRMED / UNKNOWN
- Impact summary (users, duration, SLO/error budget burn if used)
- [root-cause-analysis.md](root-cause-analysis.md) distinctions
- Related architecture, contracts, runbooks as they were *during* the incident

## Suggested Agenda

1. Impact and severity (agree facts)
2. Timeline walkthrough
3. What went well
4. What went poorly (systems, not people)
5. Root causes, contributing factors, detection/recovery gaps
6. Corrective actions with owners and due dates
7. Documentation updates required (ops, architecture, contracts)

## Outputs

| Output | Required? |
| --- | --- |
| Short incident summary | Recommended |
| Timeline | Recommended for material incidents |
| Cause analysis | Recommended |
| Corrective actions | Recommended — [corrective-actions.md](corrective-actions.md) |
| Follow-up review date | Optional |

## Anti-Patterns

- Rewriting the timeline to remove uncomfortable UNKNOWNs.
- Action items without owners or with perpetual “investigate”.
- Skipping architecture/contract updates when the failure crossed a boundary.

## Related Documents

- [incident-management.md](incident-management.md)
- [incident-timeline.md](incident-timeline.md)
- [root-cause-analysis.md](root-cause-analysis.md)
- [corrective-actions.md](corrective-actions.md)
- [error-budget.md](error-budget.md)
