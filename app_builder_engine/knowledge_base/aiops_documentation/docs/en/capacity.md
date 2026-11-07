# Capacity

> Language: EN | [Português (pt-BR)](../pt-BR/capacity.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document capacity that matters for safe operation.

**Document relevant metrics only.** Do not paste every infrastructure gauge. If capacity is not managed for the project, state **Not Defined** or **Not Applicable**.

## Purpose

Capacity documentation answers:

> What resource or throughput limits constrain us, and how do we know we are approaching them?

## What “Relevant” Means

Include a metric when it:

- bounds user-visible performance or availability; or
- appears in saturation failure modes; or
- drives scaling / throttling decisions; or
- is required for incident diagnosis.

Exclude vanity metrics and unused dashboards.

## Suggested Fields

| Field | Meaning |
| --- | --- |
| Resource / dimension | e.g. request rate, queue depth, storage, workers, connections |
| Metric | How it is measured |
| Soft limit | Warning / scale threshold if any |
| Hard limit | Failure / rejection point if known |
| Headroom practice | How much spare capacity is intentional — or Not Defined |
| Owner | Who watches it |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Table Shape

| Dimension | Metric | Soft limit | Hard limit | Signal / alert | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Relationship to Other Docs

| Topic | Link |
| --- | --- |
| Scaling actions | [scaling.md](scaling.md) |
| Saturation failure modes | [failure-modes.md](failure-modes.md) |
| SLIs that are capacity-sensitive | [service-levels.md](service-levels.md) |
| Contract rate limits | Relevant contract + [timing-contract.md](timing-contract.md) |

## Anti-Patterns

- Documenting only “CPU” when the real limiter is queue depth or downstream quota.
- Hard limits marked Confirmed without measurement evidence.
- Capacity docs that never mention what happens at the limit (reject, block, shed, crash).

## Related Documents

- [scaling.md](scaling.md)
- [reliability-model.md](reliability-model.md)
- [monitoring.md](monitoring.md)
- [operations-model.md](operations-model.md)
