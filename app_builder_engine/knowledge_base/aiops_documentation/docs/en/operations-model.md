# Operations Model

> Language: EN | [Português (pt-BR)](../pt-BR/operations-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **operations and reliability** as a continuous loop — not a one-time checklist.

This methodology is technology-agnostic. It integrates with [Architecture](architecture-model.md) (structure, failure domains, dependencies) and [Contracts](contract-model.md) (retry, timeouts, delivery, errors). Architecture describes *what exists*; contracts describe *interaction rules*; operations docs describe *how the system is run, observed, and recovered*.

## Quality Distinctions

Use these terms precisely. Do not treat them as synonyms.

| Concept | Meaning | Typical documentation focus |
| --- | --- | --- |
| **Availability** | The system (or capability) can be reached and used when needed | Uptime, reachability, serving capacity, outage windows |
| **Reliability** | The system correctly performs its intended function under expected conditions over time | Correct outcomes, error rates, consistency with contracts |
| **Resilience** | The system withstands faults and stress without uncontrolled collapse | Isolation, degradation modes, bulkheads, retry/backoff behavior |
| **Recoverability** | The system can be restored to a usable state after failure or loss | Recovery steps, backups, RPO/RTO when defined, failover |
| **Operability** | Humans and automation can operate, diagnose, and change the system safely | Ownership, runbooks, signals, alerts, change/rollback clarity |

A system can be *available* (responding) but not *reliable* (wrong answers). It can be *resilient* under partial failure yet hard to *operate*. Document each dimension that matters for the project; mark others **Not Applicable** or **Not Defined**.

## Operations Loop

```text
Operate → Observe → Detect → Diagnose → Respond → Recover → Learn → Improve
    ↑                                                              │
    └──────────────────────────────────────────────────────────────┘
```

| Stage | Question | Typical artifacts |
| --- | --- | --- |
| **Operate** | How do we run it day to day? | Ownership, deployment ops, maintenance, operational state |
| **Observe** | What signals exist? | Metrics, logs, traces, events, health checks |
| **Detect** | How do we know something is wrong? | Monitoring, alerting, health signals |
| **Diagnose** | What is failing and why (working theory)? | Runbooks, timelines, dependency maps |
| **Respond** | What do we do now? | Incident process, escalation, mitigating actions |
| **Recover** | How do we restore service? | Runbooks, rollback, restore, degradation exit |
| **Learn** | What actually happened? | Timeline facts, RCA, post-incident review |
| **Improve** | What changes reduce recurrence or blast radius? | Corrective actions, docs/architecture/contract updates |

Stages may overlap in a real incident. Document the loop the project actually uses; do not invent process that does not exist.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Ownership, how to tell healthy vs broken, one runbook for the critical failure path |
| Medium | Service levels (or explicit N/A), monitoring/alerting, incident severity, key failure modes |
| Large / distributed | Full reliability model, dependency reliability, capacity/scaling, error budget policy, PIR practice |

## Integration Points

| Area | Link |
| --- | --- |
| Architecture failure domains | [failure-domains.md](failure-domains.md) |
| Component dependencies | [component-relationships.md](component-relationships.md), [reliability-model.md](reliability-model.md) |
| Contract behavior under failure | [retry-policy.md](retry-policy.md), [idempotency.md](idempotency.md), [delivery-semantics.md](delivery-semantics.md), [timing-contract.md](timing-contract.md) |
| Documentation ownership | [ownership.md](ownership.md), [operational-ownership.md](operational-ownership.md) |
| Observability template | [templates/observability.md](templates/observability.md) |
| Runbook template | [templates/runbook.md](templates/runbook.md) |

Prefer links over copying architecture diagrams or contract schemas into operations docs.

## Certainty

Classify operational claims as Confirmed / Inferred / Unknown / Proposed ([standards.md](standards.md)). Prefer **Unknown** or **Not Defined** over invented SLOs, recovery times, or monitoring that does not exist.

## Related Documents

- [operational-ownership.md](operational-ownership.md)
- [reliability-model.md](reliability-model.md)
- [service-levels.md](service-levels.md)
- [observability-model.md](observability-model.md)
- [incident-management.md](incident-management.md)
- [operations/README.md](operations/README.md)
