# Component Registry

> Language: EN | [Português (pt-BR)](../pt-BR/component-registry.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How adopting projects maintain an inventory of **architectural components**.

A **component** is a unit of architectural responsibility (bounded deployable, package, worker, UI surface, etc.). Not every class or file is a component ([architecture-model.md](architecture-model.md), [component-relationships.md](component-relationships.md)).

## Component ≠ Service

| | Component | Service |
| --- | --- | --- |
| Focus | Architectural responsibility / structure | Operable / runnable unit (often deployable) |
| Registry | This document | [service-registry.md](service-registry.md) |
| Example | `payments-domain` library boundary | `checkout-api` Deployment |

One service may implement one component, or multiple components may live in one service — document the mapping explicitly.

## Minimum Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | `CMP-XXX` or stable name |
| `name` | Yes | Human-readable name |
| `responsibility` | Yes | One short paragraph |
| `owner` | Yes | Team / squad / role |
| `status` | Yes | Lifecycle of the *registry entry* / doc |
| `services` | Recommended | Service ids that realize this component |
| `contracts` | Recommended | Exposed/consumed contract ids |
| `docs` | Recommended | Primary architecture doc links |
| `updated` | Yes | `YYYY-MM-DD` |

## Example

| ID | Name | Responsibility | Owner | Services | Updated |
| --- | --- | --- | --- | --- | --- |
| CMP-001 | checkout-api edge | HTTP entry for checkout commands | platform-team | SVC-001 | 2026-08-07 |

## Rules

1. Do not auto-promote files to components.
2. Unknown components discovered in code → register as Unknown responsibility or open documentation debt — do not invent purpose.
3. Keep the registry Current; move removed components to Historical/Deprecated per [history-model.md](history-model.md).

## Related Documents

- [service-registry.md](service-registry.md)
- [dependency-model.md](dependency-model.md)
- [architecture-model.md](architecture-model.md)
