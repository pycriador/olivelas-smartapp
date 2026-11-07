# Operational Drift

> Language: EN | [Português (pt-BR)](../pt-BR/operational-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

**Operational drift** is the gap between documented operational reality and how the system is actually run, observed, and recovered.

```text
Documented Operations
        ≠
Actual Operations
```

Related concepts: [architecture-drift.md](architecture-drift.md), [contract-drift.md](contract-drift.md), [stale-documentation.md](stale-documentation.md).

## Signals

| Signal | Example |
| --- | --- |
| Stale runbook | Steps reference removed jobs, dashboards, or hosts |
| Alert without action | Page fires; on-call improvises every time |
| Undocumented recovery | Team uses a tribal restore path |
| Phantom SLO | Docs claim 99.9%; no measurement exists |
| Ownership drift | Escalation list names a dissolved team |
| Deploy drift | Pipeline changed; deploy docs still describe old path |
| State language drift | Status page uses states docs never defined |

## How to Register Drift

1. **Classify impact** — cosmetic vs blocks incident response / misleads AI or new on-call.
2. **Record** — lightweight item with evidence:

| Field | Meaning |
| --- | --- |
| **ID** | Optional (`OP-DRIFT-003`) |
| **Documented** | What docs claim |
| **Actual** | What operators do (with evidence) |
| **Impact** | Risk if left unfixed |
| **Owner** | Who reconciles |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

3. **Treat** — update docs, fix process/tooling, or accept risk explicitly. Do not invent a “desired ops model” as current state.

## Relationship to Debt

| Finding | Often becomes |
| --- | --- |
| Docs wrong, practice correct | Documentation debt |
| Practice unsafe / fragile | [reliability-debt.md](reliability-debt.md) |
| Both diverged | Both, with clear owners |

## What This Standard Does Not Do

No required continuous verification bot in this version. Detection remains human and change/incident-driven.

## Related Documents

- [reliability-debt.md](reliability-debt.md)
- [operations-checklist.md](operations-checklist.md)
- [runbooks/README.md](runbooks/README.md)
- [operational-readiness.md](operational-readiness.md)
- [stale-documentation.md](stale-documentation.md)
