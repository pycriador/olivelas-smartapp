# Incident Timeline

> Language: EN | [Português (pt-BR)](../pt-BR/incident-timeline.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to record what happened during an incident without mixing facts and guesses.

A timeline is the spine of response notes, [root-cause analysis](root-cause-analysis.md), and [post-incident review](post-incident-review.md).

## Entry Markers

Tag each entry:

| Marker | Meaning |
| --- | --- |
| **FACT** | Observed or recorded evidence (metric, log, message, action taken) |
| **HYPOTHESIS** | Working theory not yet proven |
| **CONFIRMED** | Former hypothesis validated by evidence |
| **UNKNOWN** | Open question; do not fill with invention |

Promote HYPOTHESIS → CONFIRMED or reject it explicitly. Keep UNKNOWN visible — gaps drive detective corrective actions.

## Entry Shape

| Time (UTC or stated TZ) | Marker | Entry | Source / evidence | Author role |
| --- | --- | --- | --- | --- |
| | FACT / HYPOTHESIS / CONFIRMED / UNKNOWN | | | |

Rules:

- Use a single timezone and state it.
- Record detection time, mitigation times, and resolution time when known.
- Separate “we did X” (FACT) from “X fixed it because Y” (HYPOTHESIS until evidenced).

## What Belongs

- Alerts firing / clearing
- Severity changes
- Commands and changes applied (not secrets)
- Customer or stakeholder reports
- Links to graphs, logs, deploys, config diffs
- Decisions and why (as FACT that the decision was made; rationale may be HYPOTHESIS)

## What Does Not Belong

- Blame or personal judgments
- Secret values or unnecessary PII
- Rewriting history to look tidy — append corrections as new FACT entries

## Lightweight Option

Small incidents can use a short bullet list with the same markers. Large incidents need a table or dedicated doc.

## Related Documents

- [incident-management.md](incident-management.md)
- [root-cause-analysis.md](root-cause-analysis.md)
- [post-incident-review.md](post-incident-review.md)
- [standards.md](standards.md)
