# Attack Surface

> Language: EN | [Português (pt-BR)](../pt-BR/attack-surface.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects inventory **where the system can be reached or influenced** for security analysis.

Attack surface documentation complements [trust-boundaries.md](trust-boundaries.md) and [system-boundaries.md](system-boundaries.md). It focuses on exposure classes, not a full port scan dump.

## Purpose

Answer:

> What can an actor interact with, from which trust zone, and what is unknown?

## Exposure Classes

Use these labels (or an equivalent project set):

| Class | Meaning |
| --- | --- |
| **Exposed** | Reachable from less-trusted or external zones without already being inside the system |
| **Internal** | Reachable only from within a defined internal trust zone |
| **Restricted** | Reachable only from privileged / tightly controlled paths (admin, break-glass, selected networks) |
| **Unknown** | Exposure not established — treat as a documentation and risk gap |

An interface can move between classes by environment. Document per environment when they differ. Prefer **Unknown** over guessing.

## What to Inventory

| Kind | Examples (illustrative) |
| --- | --- |
| Network / API edges | Public APIs, webhooks, admin endpoints |
| Async edges | Queues, topics, file drop locations |
| Identity edges | Login, token issuance, impersonation |
| Operator edges | Consoles, SSH/bastion patterns, runbooks that change state |
| Build / deploy edges | Pipelines that can alter production |
| Data edges | Exports, replicas, analytics pipelines |

Never list secret values. Credential *entry points* may be named by purpose.

## Suggested Surface Record

| Field | Meaning |
| --- | --- |
| **ID** | Stable short id |
| **Entry / interface** | Name + link to contract or component |
| **Exposure class** | Exposed / Internal / Restricted / Unknown |
| **Trust zone** | From → to summary |
| **Authn / authz** | Summary or link — [authentication.md](authentication.md), [authorization.md](authorization.md) |
| **Data classes** | Classifications that cross — [security-classification.md](security-classification.md) |
| **Owner** | Technical or security owner |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| ID | Entry | Exposure | Trust zone | Authn/Authz | Data classes | Owner | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Integration

| Area | Link |
| --- | --- |
| Trust crossings | [trust-boundaries.md](trust-boundaries.md) |
| Threats on surfaces | [threat-modeling.md](threat-modeling.md) |
| Interface detail | [contract-model.md](contract-model.md) |
| Ops exposure (health, metrics) | [observability-model.md](observability-model.md) — do not confuse scrape endpoints with authz policy |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | List Exposed edges + any Restricted admin path |
| Medium | Include Internal service interfaces that carry Confidential data |
| Large | Full inventory with Unknown backlog and owners |

## Anti-Patterns

- Only documenting the happy-path public API.
- Marking everything Internal without evidence.
- Leaving admin and CI edges undocumented.
- Copying firewall rule dumps into docs without interpretation.

## Related Documents

- [security-model.md](security-model.md)
- [trust-boundaries.md](trust-boundaries.md)
- [threat-modeling.md](threat-modeling.md)
- [security-scope.md](security-scope.md)
- [architecture-model.md](architecture-model.md)
