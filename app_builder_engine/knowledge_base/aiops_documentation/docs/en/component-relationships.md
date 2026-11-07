# Component Relationships

> Language: EN | [Português (pt-BR)](../pt-BR/component-relationships.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document relationships between architectural components — with explicit semantics, not unlabeled arrows.

## Purpose

Relationships answer:

> How do these parts connect, and what does each connection mean?

Components are architectural units of responsibility. Do not auto-promote every file or class to a component.

## Relationship Types

Projects may use any relationship type that is accurate. Common types include (not a closed list):

| Type | Typical meaning |
| --- | --- |
| **depends on** | A needs B to fulfill its responsibility (compile-time, runtime, or operational) |
| **calls** | A invokes B synchronously or with an expected response |
| **publishes** | A emits events/messages for others |
| **consumes** | A processes events/messages produced elsewhere |
| **stores** | A persists data into B |
| **reads** | A reads data from B |
| **writes** | A writes data to B |
| **triggers** | A causes B to start (schedule, webhook, event, pipeline step) |
| **authenticates** | A establishes identity for access involving B |
| **authorizes** | A decides or enforces permission involving B |

Add project-specific verbs when needed (`mirrors`, `indexes`, `schedules`, `proxies`, …). Prefer a small vocabulary used consistently over a large free-form set.

## Dependency Direction Semantics

Arrows must be labeled. An unlabeled arrow is invalid architecture documentation.

```text
A → B
```

means whatever the **label** says. The arrow direction alone is not enough.

Differentiate at least:

| Phrase | Prefer when |
| --- | --- |
| **depends on** | Structural or operational need (A cannot meet its role without B) |
| **calls** | Invocation / request path |
| **publishes to** | A writes to a channel, topic, stream, or outbox consumed by others |
| **consumes from** | A reads from a channel owned or fed by others |
| **reads from** | A retrieves data without implying it owns the store |
| **writes to** | A mutates data in a store or sink |

Examples of clear labeling:

```text
checkout-api —calls→ payment-gateway
checkout-api —publishes to→ order-events
inventory-projector —consumes from→ order-events
reporting —reads from→ analytics-store
order-service —writes to→ order-store
```

Ambiguous form to avoid:

```text
A → B
```

(no label — reader cannot tell call vs publish vs depends on)

## Depends On vs Calls

| | **depends on** | **calls** |
| --- | --- | --- |
| Scope | Broader: libraries, platforms, data, ops tooling | Narrower: invocation relationship |
| May include | Runtime services A never "calls" directly but requires | Explicit request/command path |
| Diagram tip | Use for criticality maps | Use for sequence and runtime collaboration |

A may **depend on** B without **calling** B (shared database schema owned elsewhere, required platform capability, build-time library). Prefer both labels when both are true and matter.

## Tables vs Diagrams

Use a table when the inventory matters:

| From | Relationship | To | Contract / notes | Criticality |
| --- | --- | --- | --- | --- |
| | calls / publishes to / … | | | High / Medium / Low |

Use a diagram when topology matters — still with edge labels. See [architecture-diagrams.md](architecture-diagrams.md) and [mermaid-standards.md](mermaid-standards.md).

## Criticality and Failure

For material relationships, document:

- **Criticality** — how badly A fails if the relationship breaks;
- **Failure impact** — user-visible or integrator-visible effect;
- link to [failure-domains.md](failure-domains.md) when blast radius is non-obvious.

## Consistency Rules

1. Names in relationship docs must match component and diagram names.
2. Direction must match runtime reality (who initiates, who owns the channel).
3. Proposed relationships must be labeled Proposed — never mixed unmarked with current state.
4. Prefer linking contracts for interface-bearing relationships.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Short dependency list with types |
| Medium | Relationship table + one component diagram |
| Large | Split by subsystem; keep a top-level summary map |

## Related Documents

- [architecture-model.md](architecture-model.md)
- [architecture-diagrams.md](architecture-diagrams.md)
- [mermaid-standards.md](mermaid-standards.md)
- [failure-domains.md](failure-domains.md)
- [architecture-traceability.md](architecture-traceability.md)
