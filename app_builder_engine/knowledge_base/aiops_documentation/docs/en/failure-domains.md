# Failure Domains

> Language: EN | [Português (pt-BR)](../pt-BR/failure-domains.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document failure domains: what fails, what is affected, how failure propagates, and how the system isolates or recovers.

## Purpose

A failure domain answers:

> If this component fails, which part of the system is affected?

Failure domains are architectural. They are **not** required to map 1:1 to physical infrastructure (racks, AZs, clusters). The same concept applies to software components, services, jobs, libraries in-process, and infrastructure.

## What to Document

For each material failure domain, capture:

| Field | Meaning |
| --- | --- |
| **Component / domain** | The unit whose failure you are analyzing |
| **Dependencies** | What it needs; which relationships are critical |
| **Impact** | User-visible, integrator-visible, or internal effect |
| **Propagation** | How failure spreads (sync call chain, shared store, poison events, shared thread pool, etc.) |
| **Isolation** | What limits blast radius (boundaries, bulkheads, separate deployables, backpressure, circuit breaking — as actually used) |
| **Recovery** | How the system returns to health (retry, replay, failover, manual runbook, degrade mode) |

Mark certainty with Confirmed / Inferred / Unknown / Proposed ([standards.md](standards.md)).

## Example Shape (Adapt)

| Domain | Includes | Failure effect | Isolation | Recovery |
| --- | --- | --- | --- | --- |
| `notification-api` | API process | Clients cannot submit sends | Separate from worker | Restart; clients retry |
| `notification-worker` | Async processor | Backlog grows; delayed delivery | Queue buffers API | Scale/replay; runbook |

Do not invent isolation mechanisms that are not present. Prefer Unknown over fiction.

## Software vs Infrastructure

| Scope | Example failure domain |
| --- | --- |
| In-process module | Shared mutable cache that takes down the whole process |
| Deployable unit | One service instance or job type |
| Shared dependency | Datastore or broker used by many components |
| Platform | Identity provider outage affecting all authenticated paths |
| Environment | Entire environment unavailable |

Document the level that matters for operations and design — often the deployable unit and shared critical dependencies.

## Relationship to Other Views

| View | Relationship |
| --- | --- |
| [System boundaries](system-boundaries.md) | External systems may define domains you do not control |
| [Component relationships](component-relationships.md) | Critical `calls` / `depends on` edges are propagation paths |
| [Trust boundaries](trust-boundaries.md) | Security controls ≠ failure isolation, but may coincide |
| Operations / runbooks | Recovery steps live in ops docs; architecture summarizes |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Note critical dependencies and "what breaks if X is down" in the architecture overview |
| Medium | Failure domain table for main components |
| Large / distributed | Per-subsystem domains + shared dependency domains |

## Anti-Patterns

- Equating "we use multiple instances" with documented isolation without stating what is actually isolated.
- Listing every class as a failure domain.
- Copying cloud vendor diagrams as a substitute for product blast-radius analysis.
- Treating Proposed resilience designs as current isolation.

## Related Documents

- [architecture-model.md](architecture-model.md)
- [system-boundaries.md](system-boundaries.md)
- [component-relationships.md](component-relationships.md)
- [trust-boundaries.md](trust-boundaries.md)
- [architecture-checklist.md](architecture-checklist.md)
- [architecture/README.md](architecture/README.md)
