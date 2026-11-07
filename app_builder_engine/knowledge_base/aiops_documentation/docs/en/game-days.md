# Game Days

> Language: EN | [Português (pt-BR)](../pt-BR/game-days.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **game days** (scheduled reliability exercises) when the project uses them.

## Optional for Small Projects

Game days are **optional**. Small or low-criticality projects may state:

> Game days not practiced — **Not Applicable**.

Do not invent a game-day program to satisfy a template.

## What a Game Day Is

A planned exercise that rehearses failure, detection, diagnosis, and recovery under controlled conditions — often with explicit hypotheses (“if X fails, we degrade to Y within Z”).

Related: [reliability-testing.md](reliability-testing.md), [incident-management.md](incident-management.md).

## What to Document When Practiced

| Topic | Question |
| --- | --- |
| Objective | What hypothesis or skill is being rehearsed |
| Scope | Systems, environments, blast-radius limits |
| Scenario | Injected or simulated failure (high level — no invented attack payloads) |
| Participants | Roles (facilitator, on-call, observers) |
| Safety limits | Stop conditions, production safeguards |
| Signals watched | Metrics, logs, alerts expected |
| Outcome | What was learned; gaps found |
| Follow-ups | Corrective actions / reliability debt |
| Date | When held |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Cadence Guidance

| Criticality (example) | Typical stance |
| --- | --- |
| Critical / High | Periodic exercises for top failure modes when feasible |
| Medium | Occasional or after major architecture change |
| Low / small project | Often N/A |

Replace with the project’s actual practice.

## Anti-Patterns

- Calling an unreviewed outage a “game day.”
- Running destructive exercises without stop conditions or ownership.
- Documenting fictional past game days.

## Related Documents

- [reliability-testing.md](reliability-testing.md)
- [failure-modes.md](failure-modes.md)
- [post-incident-review.md](post-incident-review.md)
- [corrective-actions.md](corrective-actions.md)
- [reliability-debt.md](reliability-debt.md)
- [criticality.md](criticality.md)
