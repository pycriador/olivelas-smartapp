# Monitoring

> Language: EN | [Português (pt-BR)](../pt-BR/monitoring.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document what is monitored, why, and who acts on it.

Monitoring is continuous watching of signals ([observability-model.md](observability-model.md)). Alerting is when that watch notifies a human or automation ([alerting.md](alerting.md)).

## What to Document per Monitor

| Field | Question |
| --- | --- |
| **What** | Signal or check being watched |
| **Why** | Risk or decision it supports |
| **Source** | Where the data comes from |
| **Frequency** | How often evaluated / scraped / sampled |
| **Threshold** | Condition that means “notable” (or qualitative rule) |
| **Owner** | Who maintains the monitor |
| **Action** | What happens when threshold is crossed (ticket, alert, auto-scale, log-only) |

If a field is unknown, write **Not Defined**. If monitoring is intentionally absent for a non-critical tool, **Not Applicable**.

## Suggested Inventory

| What | Why | Source | Frequency | Threshold | Owner | Action |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Good Monitoring

- Tied to user impact, capacity risk, or dependency failure — not every metric.
- Thresholds reviewed after false positives/negatives.
- Action column is non-empty (even if “log only / weekly review”).

## Bad Monitoring

- Monitors nobody owns.
- Thresholds copied from another system without meaning.
- “Watch everything” with no action path.
- Silent failure of the monitoring system itself undocumented ([operational-dependencies.md](operational-dependencies.md)).

## Linkage

| If action is… | Also document… |
| --- | --- |
| Page / notify | [alerting.md](alerting.md) |
| Run a procedure | [runbooks/README.md](runbooks/README.md) |
| Scale | [scaling.md](scaling.md) |
| Open an incident | [incident-management.md](incident-management.md) |

## Related Documents

- [observability-model.md](observability-model.md)
- [alerting.md](alerting.md)
- [health-checks.md](health-checks.md)
- [service-levels.md](service-levels.md)
- [capacity.md](capacity.md)
