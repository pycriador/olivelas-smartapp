---
title: "Dependency Map"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
---

# Dependency Map

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/dependency-map.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Inventory of dependencies that shape runtime or operational behavior. Current state only unless labeled Proposed. Do not invent dependencies. -->

## Purpose

<!-- Why this map exists and which system or scope it covers. -->

## Direction Semantics

Arrows and table rows must have explicit meaning. Prefer:

```text
A → B
```

with a typed relation, for example:

| Notation | Meaning |
| --- | --- |
| `A → B` (depends on) | A cannot fulfill its responsibility without B |
| `A → B` (calls) | A invokes B |
| `A → B` (publishes to) | A emits to B |
| `A → B` (consumes from) | A reads or subscribes from B |
| `A → B` (reads from) | A reads data owned or exposed by B |
| `A → B` (writes to) | A writes data into B |

Do not draw unlabeled arrows. If direction is unknown, mark **Unknown** rather than guessing.

## Internal Dependencies

| Component | Dependency | Type | Criticality | Failure Impact |
| --- | --- | --- | --- | --- |
| | | internal | critical / high / medium / low / unknown | |

## External Dependencies

| Component | Dependency | Type | Criticality | Failure Impact |
| --- | --- | --- | --- | --- |
| | | external | critical / high / medium / low / unknown | |

## Infrastructure Dependencies

| Component | Dependency | Type | Criticality | Failure Impact |
| --- | --- | --- | --- | --- |
| | | infrastructure | critical / high / medium / low / unknown | |

## Data Dependencies

| Component | Dependency | Type | Criticality | Failure Impact |
| --- | --- | --- | --- | --- |
| | | data | critical / high / medium / low / unknown | |

## Operational Dependencies

| Component | Dependency | Type | Criticality | Failure Impact |
| --- | --- | --- | --- | --- |
| | | operational | critical / high / medium / low / unknown | |

## Consolidated Map

| Component | Dependency | Type | Criticality | Failure Impact |
| --- | --- | --- | --- | --- |
| | | internal / external / infrastructure / data / operational / other | critical / high / medium / low / unknown | |

## Dependency Diagram

```mermaid
flowchart LR
  component[Component] -->|depends on| dependency[Dependency]
```

<!-- Label edges with relation semantics. Keep diagrams scoped; split when overcrowded. -->

## Related Documentation

| Document | Path |
| --- | --- |
| Architecture | |
| Failure domains | |
| Contracts | |
| ADRs | |
