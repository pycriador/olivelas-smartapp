# Troubleshooting: Inventory Projector

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/operations/troubleshooting.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
>
> **Fictional example — not a real project.**

## Purpose

Diagnose projection lag, retries, and poison-event behavior for `inventory-projector`.

## Scope

| In scope | Out of scope |
| --- | --- |
| Consumer lag and apply failures | Write-model business rule bugs |

## How to Use

1. Match symptoms.
2. Run diagnosis checks in order.
3. Apply the resolution.
4. Escalate if validation fails.

## Symptom Index

| Symptom | Likely area | Jump to |
| --- | --- | --- |
| Growing consumer lag | bus or consumer capacity | Issue: Projection lag |
| Repeated failures on one event | poison payload | Issue: Poison event |
| High retry rate | store instability | Issue: Store apply failures |

## Common Issues

### Issue: Projection lag

| Field | Value |
| --- | --- |
| Symptoms | Lag metric rising; projection feels stale |
| Likely causes | underscaled consumers; bus backpressure; slow store |
| Diagnosis | Check lag, consumer count, store latency |
| Resolution | Scale consumers or restore store performance |
| Validation | Lag trend decreases |
| Related runbook | this document |
| Classification | Confirmed (example) |

### Issue: Poison event

| Field | Value |
| --- | --- |
| Symptoms | One event fails repeatedly; partition progress stalls |
| Likely causes | schema_invalid; unexpected nulls |
| Diagnosis | Inspect dead-letter payload fields (no secrets) |
| Resolution | Route to dead-letter; fix producer; replay if needed |
| Validation | Consumer resumes; dead-letter alert acknowledged |
| Related runbook | this document |
| Classification | Confirmed (example) |

### Issue: Store apply failures

| Field | Value |
| --- | --- |
| Symptoms | Elevated retry metrics; transient errors in logs |
| Likely causes | projection-store unavailable or slow |
| Diagnosis | Check store health and error signatures |
| Resolution | Restore store; keep backoff enabled |
| Validation | Success rate recovers; retries normalize |
| Related runbook | this document |
| Classification | Confirmed (example) |

## Diagnostic Signals

| Signal | Where to find | What “healthy” looks like |
| --- | --- | --- |
| consumer lag | metrics | stable / near zero |
| dead-letter count | metrics | zero or rare |
| apply error rate | metrics | within normal band |

## Escalation

| Condition | Escalate to | Provide |
| --- | --- | --- |
| Lag grows for > 30 minutes after mitigation | platform on-call (fictional) | timelines, metrics, event_ids |

## Related Documentation

| Document | Path |
| --- | --- |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| Contract | [../contracts/inventory-adjusted.md](../contracts/inventory-adjusted.md) |
| Component | [../application/inventory-projector.md](../application/inventory-projector.md) |
| Integration | [../application/integration-inventory-adjusted.md](../application/integration-inventory-adjusted.md) |
