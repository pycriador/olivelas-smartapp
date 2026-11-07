# Operational Metrics

> Language: EN | [Português (pt-BR)](../pt-BR/operational-metrics.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Purpose of common **operational metrics**. Not every project needs every metric — document those that drive decisions.

For SLI/SLO selection see [service-levels.md](service-levels.md). For MTTD/MTTR/MTBF see [reliability-metrics.md](reliability-metrics.md).

## Metric Purposes

| Metric family | Purpose | Typical questions answered |
| --- | --- | --- |
| **Availability / uptime** | Whether the capability was reachable/usable | Were we up for users who needed us? |
| **Error rate / success rate** | Correctness of outcomes | Are requests/jobs succeeding? |
| **Latency** | How long work takes | Are we slow for users or dependents? |
| **Saturation** | How full resources or queues are | Are we approaching a cliff? |
| **Throughput** | Work completed per time | Are we keeping up with demand? |
| **Freshness / lag** | How stale data or projections are | Is async state acceptably current? |
| **Queue depth / backlog** | Pending work | Is work accumulating? |
| **Utilization** | Resource use vs capacity | Do we need capacity action? |
| **Traffic / demand** | Incoming load shape | Is load anomalous? |
| **Dependency health** | Downstream/upstream status | Is the fault inside or outside? |
| **Deploy / change markers** | Correlate changes with symptoms | Did a release coincide with pain? |

Projects may use different names. Map local terms once.

## What to Document per Metric Used

| Field | Content |
| --- | --- |
| Name | Stable metric name |
| Purpose | Decision it supports |
| Definition | Formula / event set |
| Source | Where it comes from |
| Owner | Who maintains meaning and quality |
| Related alerts / SLIs | Links |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Rules

- **Not all required.** Prefer a few decision-driving metrics over a vanity catalog.
- Do not invent metrics or dashboards.
- Avoid high-cardinality or PII-bearing labels in documented examples.
- Align metric definitions with contract and architecture language when they measure the same boundary.

## Related Documents

- [reliability-metrics.md](reliability-metrics.md)
- [monitoring.md](monitoring.md)
- [observability-model.md](observability-model.md)
- [service-levels.md](service-levels.md)
- [capacity.md](capacity.md)
- [standards.md](standards.md)
