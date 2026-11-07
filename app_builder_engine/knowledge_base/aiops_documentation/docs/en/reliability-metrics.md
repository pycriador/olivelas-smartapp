# Reliability Metrics

> Language: EN | [Português (pt-BR)](../pt-BR/reliability-metrics.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Definitions for common **reliability process metrics**. Clarify ambiguity — teams often mean different things by the same acronym.

Document definitions the project actually uses. Mark **Not Defined** when unused.

## Core Definitions

| Metric | Meaning (default in this standard) | Notes |
| --- | --- | --- |
| **MTTD** | Mean Time **To Detect** — time from failure start (or user impact start) until the team becomes aware | Requires a clear “start” and “detected” event |
| **MTTR** | Mean Time **To Restore** / **To Recover** — time from detection (or from failure start — **declare which**) until service meets recovery criteria | Ambiguous in industry; **document the project’s clock** |
| **MTBF** | Mean Time **Between Failures** — average interval between failure events in a class | Needs a stable failure definition; poor fit for continuous error streams without eventization |

```text
failure start ──► detected ──► mitigated / restored
     │               │                │
     └──── MTTD ─────┘                │
     └──────── MTTR (if from start) ──┘
                     └─ MTTR (if from detect) ─┘
```

## Clarify Ambiguity Explicitly

When documenting MTTR (or similar), always state:

| Clarification | Example choices |
| --- | --- |
| Clock start | Failure start vs detection vs incident open |
| Clock end | Mitigation vs full restore vs PIR close |
| Population | SEV-1 only, all incidents, per capability |
| Aggregation | Mean, median, percentiles |
| Exclusions | Mispages, external provider failures — only if true |

If clarification is missing, label the metric **Unknown** / poorly defined — do not compare teams on incomparable MTTR.

## Optional Related Metrics

| Metric | Meaning |
| --- | --- |
| **MTTM** | Mean Time To Mitigate (stop bleeding) |
| **MTTF** | Mean Time To Failure (often similar intent to MTBF; define locally) |
| **Alert noise rate** | Fraction of alerts that are non-actionable |
| **Recurrence rate** | Repeat incidents with same root cause class |

## What to Document

| Field | Content |
| --- | --- |
| Metric | Name |
| Definition | Precise clock and population |
| Purpose | What decision it informs |
| Source | Incident system, timeline, monitoring |
| Target | Only if real; else Not Defined |
| Owner | |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Anti-Patterns

- Optimizing MTTD by paging on noise.
- Claiming improving MTTR while silently narrowing the incident population.
- Publishing MTBF without defining what counts as a failure.

## Related Documents

- [operational-metrics.md](operational-metrics.md)
- [incident-management.md](incident-management.md)
- [incident-timeline.md](incident-timeline.md)
- [post-incident-review.md](post-incident-review.md)
- [service-levels.md](service-levels.md)
