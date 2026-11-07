---
title: "Component"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "CMP-XXX"
# component_id: "stable-name"
type: "Architecture"
---

# Component

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/component.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Operational and implementation-oriented view of a single component. Prefer [component-architecture.md](component-architecture.md) for the architectural unit view when structure and trade-offs matter more than ops detail.

## ID

| Field | Value |
| --- | --- |
| Component ID | CMP-XXX / stable-name |
| Canonical name | <!-- must match registries and other docs --> |
| Service ID (if distinct) | SVC-XXX / Not Applicable |
| Owner | |

## Purpose

<!-- Why this component exists. -->

## Type

| Field | Value |
| --- | --- |
| Kind | library / service / worker / gateway / batch / UI / data / infra / other |
| Deployable | yes / no / Unknown |
| Criticality | <!-- link ops criticality if defined; else Unknown --> |

## Responsibilities

| Responsibility | Notes |
| --- | --- |
| | |

## Non-Responsibilities

| Non-responsibility | Owner / elsewhere |
| --- | --- |
| | |

## Technology

<!-- Record technologies actually used. Do not invent. Mark Unknown if not identified. -->

| Concern | Choice | Classification |
| --- | --- | --- |
| Language / runtime | | Confirmed / Inferred / Unknown |
| Framework | | Confirmed / Inferred / Unknown |
| Datastore | | Confirmed / Inferred / Unknown / Not Applicable |
| Other | | |

## Inputs

| Input | Source | Format / contract |
| --- | --- | --- |
| | | |

## Outputs

| Output | Destination | Format / contract |
| --- | --- | --- |
| | | |

## Dependencies

| Dependency | ID | Purpose | Required | Direction | Classification |
| --- | --- | --- | --- | --- | --- |
| | CMP/SVC/external | | yes / no | inbound / outbound | Confirmed / Inferred / Unknown |

<!-- Prefer registry IDs. Link [dependency-map.md](dependency-map.md) when the graph is large. -->

## Interfaces

| Interface | Type | Contract ID / document | Authn / Authz notes |
| --- | --- | --- | --- |
| | API / event / message / file / command / other | | |

## Data

| Concern | Summary | Classification |
| --- | --- | --- |
| Owned data | | Confirmed / Inferred / Unknown / Not Applicable |
| Read data | | Confirmed / Inferred / Unknown / Not Applicable |
| Written data | | Confirmed / Inferred / Unknown / Not Applicable |
| Retention / lifecycle | | Confirmed / Inferred / Unknown / Not Applicable |
| Classification / sensitivity | | Confirmed / Inferred / Unknown / Not Applicable |

<!-- Do not assume persistence exists. Never document secret values. -->

## Configuration

| Name | Purpose | Source | Required | Secret |
| --- | --- | --- | --- | --- |
| | | env / file / vault / other | yes / no | yes / no |

<!-- Never document secret values. -->

## Security

| Topic | Summary |
| --- | --- |
| Trust boundary involvement | |
| Authentication | |
| Authorization | |
| Sensitive data handling | |
| Secrets (references only) | |
| Risks | |
| Linked security docs | |

## Observability

| Signal | Status | Notes |
| --- | --- | --- |
| Logging | Implemented / Partial / Not Applicable / Not Documented | |
| Metrics | Implemented / Partial / Not Applicable / Not Documented | |
| Tracing | Implemented / Partial / Not Applicable / Not Documented | |

## Failure Handling

| Failure | Detection | Response | Classification |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown |

## Operations

| Topic | Notes |
| --- | --- |
| Deployment | |
| Scaling | |
| Health checks | |
| Migration / rollback | |
| Runbooks | |
| On-call / escalation | |
| SLIs / SLOs | link or Unknown / Not Applicable |

## Related Documents

| Relation | Document ID | Path |
| --- | --- | --- |
| architecture | | |
| contracts | | |
| runbooks | | |
| security | | |
| ADRs | | |
| registry entry | | |
