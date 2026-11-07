# Failure Modes

> Language: EN | [Português (pt-BR)](../pt-BR/failure-modes.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Guidance for cataloging how a system can fail — for design review, monitoring, and runbooks.

Categories below are **examples, not exhaustive**. Projects invent categories that fit their domain. Omit modes that do not apply.

## Purpose

A failure mode entry answers:

> What goes wrong, how we notice, what users feel, and what we do?

## Suggested Entry Fields

| Field | Meaning |
| --- | --- |
| ID / name | Stable identifier |
| Description | What fails |
| Category | See examples below |
| Trigger | Conditions that provoke it |
| Detectable? | How (metric, log, health, user report) — or Unknown |
| User / business impact | |
| Criticality | [criticality.md](criticality.md) |
| Propagation | Link [failure-propagation.md](failure-propagation.md) |
| Mitigation | Automatic or manual |
| Recovery | Steps / runbook |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Example Categories (Non-Exhaustive)

| Category | Examples |
| --- | --- |
| Crash / stop | Process exit, job stuck not scheduling |
| Timeout | Caller or callee exceeds time budget |
| Saturation | CPU, memory, queue, connection pool exhaustion |
| Dependency failure | Downstream unavailable or refusing |
| Data / state | Corruption, inconsistency, poison message |
| Partial incorrectness | Wrong results while appearing healthy |
| Throttling / rejection | Rate limits, admission control |
| Configuration | Bad config, expired credentials |
| Capacity | Demand exceeds provisioned capacity |
| Security / abuse | Credential theft, traffic floods — when in scope |

Add or rename categories freely. Do not force every row into this list.

## Catalog Shape

| ID | Mode | Category | Detection | Impact | Mitigation | Recovery | Criticality |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

Start with modes that are Confirmed from incidents or tests. Mark Proposed modes clearly so they are not treated as current risk without evidence.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Top 3–5 realistic modes in architecture or ops overview |
| Medium | Catalog for critical paths + dependency failures |
| Large | Per-subsystem catalogs + shared dependency modes |

## Anti-Patterns

- Exhaustive theoretical FMEA for a simple tool with no owners to maintain it.
- Listing only infrastructure crashes and ignoring “wrong but up” modes.
- Duplicating the entire architecture doc instead of linking [failure-domains.md](failure-domains.md).

## Related Documents

- [reliability-model.md](reliability-model.md)
- [failure-propagation.md](failure-propagation.md)
- [failure-domains.md](failure-domains.md)
- [degradation.md](degradation.md)
- [runbooks/README.md](runbooks/README.md)
