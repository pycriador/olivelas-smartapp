# Root Cause Analysis

> Language: EN | [Português (pt-BR)](../pt-BR/root-cause-analysis.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document causes and gaps after an incident — without collapsing everything into a single slogan.

RCA methods (5 Whys, fishbone, fault trees, etc.) are **optional**. Choose a method that fits the incident, or use structured narrative. Prefer clarity over ceremony.

## Distinctions

| Term | Meaning |
| --- | --- |
| **Root cause** | A cause that, if adequately addressed, would have prevented this incident class (there may be more than one) |
| **Contributing factor** | Condition that increased likelihood or impact but was not sufficient alone |
| **Trigger** | The event that precipitated the failure (deploy, traffic spike, dependency outage, poison message) |
| **Detection gap** | Why it took too long to notice (missing signal, bad threshold, no ownership) |
| **Recovery gap** | Why it took too long to mitigate or restore (missing runbook, unsafe rollback, skill/access gap) |

Do not label a trigger as the only root cause when deeper conditions enabled the outage. Do not invent a single root cause when evidence supports a set of factors.

## Evidence Discipline

Ground RCA in the [incident timeline](incident-timeline.md):

- FACT and CONFIRMED support causes;
- HYPOTHESIS stays labeled until proven;
- UNKNOWN remains UNKNOWN.

Classify certainty: Confirmed / Inferred / Unknown / Proposed ([standards.md](standards.md)).

## Suggested Structure

| Section | Content |
| --- | --- |
| Summary | What broke, impact, duration |
| Trigger | What started it |
| Root cause(s) | With evidence |
| Contributing factors | With evidence |
| Detection gap | If any |
| Recovery gap | If any |
| What went well | Optional but useful |
| Corrective actions | Link [corrective-actions.md](corrective-actions.md) |

## Methods (Optional)

| Method | When it may help |
| --- | --- |
| 5 Whys | Linear causal chain |
| Causal graph / factor map | Multiple interacting factors |
| Fault tree | Known failure logic |
| Timeline-only analysis | Small incidents |

State which method was used, or “narrative / timeline-based”.

## Anti-Patterns

- “Human error” as root cause without systemic factors (training, UX, safeguards).
- Stopping at the trigger (“bad deploy”) without asking why bad config passed.
- RCA that never produces [corrective actions](corrective-actions.md).

## Related Documents

- [incident-timeline.md](incident-timeline.md)
- [post-incident-review.md](post-incident-review.md)
- [corrective-actions.md](corrective-actions.md)
- [failure-modes.md](failure-modes.md)
- [incident-management.md](incident-management.md)
