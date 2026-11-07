# Service Levels

> Language: EN | [Português (pt-BR)](../pt-BR/service-levels.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document service level indicators, objectives, and agreements — when the project uses them.

**Not every project needs an SLA.** Many need SLIs; some need SLOs; formal SLAs are optional and often contractual.

## SLI → SLO → SLA

| Term | Meaning | Required? |
| --- | --- | --- |
| **SLI** (Service Level Indicator) | A measurable signal of user-visible or capability quality (e.g. success ratio, latency percentile, freshness) | Recommended when reliability matters |
| **SLO** (Service Level Objective) | A target for an SLI over a window (e.g. 99.9% success over 30 days) | Optional; use when the team commits to a target |
| **SLA** (Service Level Agreement) | A commitment to another party (often with consequences) | Optional; **Not Applicable** for many internal systems |

```text
SLI (measure) → SLO (target) → SLA (external commitment, if any)
```

Do not invent SLOs to fill a template. Prefer **Not Defined** / **Not Applicable** over fictional percentages.

## What to Document for an SLI

| Field | Question |
| --- | --- |
| Name | What is measured? |
| Definition | Exact formula / event set (include and exclude) |
| Source | Where the measurement comes from |
| Window | Rolling period, calendar month, etc. |
| Good event / bad event | What counts as success vs failure |
| Scope | Which users, regions, endpoints, or flows |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## What to Document for an SLO

| Field | Question |
| --- | --- |
| SLI | Which indicator |
| Target | Numeric objective |
| Window | Time window |
| Owner | Who watches burn and prioritizes work — [operational-ownership.md](operational-ownership.md) |
| Error budget policy | Link to [error-budget.md](error-budget.md) if used |
| Not Applicable | Reason if the project does not set SLOs |

## SLA Guidance

Document an SLA only when a real agreement exists. Capture:

- parties;
- covered SLIs/SLOs;
- exclusions (maintenance, force majeure — as actually written);
- consequences / credits if any;
- how disputes or measurements are resolved.

If there is no SLA: state **Not Applicable — no formal SLA**.

## Relationship to Contracts and Architecture

| Concern | Where it lives |
| --- | --- |
| Latency / timeout expectations between parties | Often [timing-contract.md](timing-contract.md) |
| Retry and delivery under failure | [retry-policy.md](retry-policy.md), [delivery-semantics.md](delivery-semantics.md) |
| User-facing reliability target | This document / project SLO table |
| Structural capacity limits | [capacity.md](capacity.md), architecture constraints |

Contract timing is not automatically an SLO. Link them when they intentionally align.

## Suggested Table

| SLI | Definition | SLO | Window | SLA? | Owner | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| | | or N/A | | yes / no / N/A | | |

## Related Documents

- [error-budget.md](error-budget.md)
- [observability-model.md](observability-model.md)
- [criticality.md](criticality.md)
- [operations-model.md](operations-model.md)
- [templates/observability.md](templates/observability.md)
