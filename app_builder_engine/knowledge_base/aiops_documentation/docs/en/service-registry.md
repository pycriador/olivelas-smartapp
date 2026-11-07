# Service Registry

> Language: EN | [Português (pt-BR)](../pt-BR/service-registry.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How adopting projects inventory **services** as operable units.

## Service Definition

A **service** is a named runnable/operable unit the project deploys, schedules, or otherwise runs (process, job, function group, edge app). Naming should match the project’s real identifiers.

## Component ≠ Service

See comparison in [component-registry.md](component-registry.md). Never assume one-to-one. Always document mappings.

## Minimum Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | `SVC-XXX` or stable name |
| `name` | Yes | Runtime / deploy name |
| `owner` | Yes | Operational and/or engineering owner |
| `criticality` | Recommended | Per [criticality.md](criticality.md) |
| `components` | Recommended | Component ids implemented |
| `dependencies` | Recommended | Other services / external deps |
| `runbooks` | Recommended | Primary runbook ids |
| `slo` | Optional | Links to SLOs if defined |
| `status` | Yes | Registry entry lifecycle |
| `updated` | Yes | `YYYY-MM-DD` |

## Example

| ID | Name | Owner | Criticality | Components | Updated |
| --- | --- | --- | --- | --- | --- |
| SVC-001 | checkout-api | platform-team | High | CMP-001 | 2026-08-07 |

## Rules

1. Do not invent SLOs, owners, or criticality without evidence/owner agreement.
2. Align names with deploy manifests when they exist.
3. Link ops docs (`operates` relationships) rather than duplicating runbook bodies.

## Related Documents

- [component-registry.md](component-registry.md)
- [operational-ownership.md](operational-ownership.md)
- [dependency-model.md](dependency-model.md)
