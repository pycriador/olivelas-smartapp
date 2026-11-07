# Security Controls

> Language: EN | [Português (pt-BR)](../pt-BR/security-controls.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **measures that enforce requirements or reduce risk**.

Controls implement [security-requirements.md](security-requirements.md). Prefer describing control *intent and placement* over vendor feature lists. Technology choices may appear as evidence, not as a substitute for the control statement.

## Control Types

| Type | Meaning | Example intent (illustrative) |
| --- | --- | --- |
| **Preventive** | Stops a bad event from occurring | Deny unauthorized action; encrypt channel; block anonymous admin |
| **Detective** | Reveals that something undesirable occurred or is occurring | Alert on privilege use; integrity check failure signal |
| **Corrective** | Limits damage or restores a safe state after an event | Revoke credentials; isolate component; rotate secret |
| **Compensating** | Partially substitutes when a preferred control is absent or weak | Extra monitoring while a design fix is pending — must state residual risk |

A single mechanism may serve more than one type. Record the primary type and note others when useful.

## Suggested Control Record

| Field | Meaning |
| --- | --- |
| **ID** | Stable short id |
| **Name** | Short label |
| **Type** | Preventive / Detective / Corrective / Compensating |
| **Requirement(s)** | Links |
| **Description** | What it does, where it sits (trust boundary / component) |
| **Owner** | Technical or security owner |
| **Evidence** | How effectiveness is shown |
| **Monitoring** | Related signals — link ops docs |
| **Status** | active / planned / exception / Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| ID | Name | Type | Requirements | Owner | Evidence | Status | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Mapping Guidance

```text
Requirement → Control(s) → Evidence → Monitoring → Response
```

| Gap | Documentation action |
| --- | --- |
| Requirement with no control | Record as open risk or exception |
| Control with no requirement | Either add the requirement or remove/clarify the control |
| Control with no evidence | Mark certainty Inferred/Unknown; do not claim Confirmed |
| Compensating only | Document residual risk and expiration/review |

## Integration

| Area | Link |
| --- | --- |
| Trust boundary crossings | [trust-boundaries.md](trust-boundaries.md) |
| Identity controls | [identity.md](identity.md), [authentication.md](authentication.md), [authorization.md](authorization.md) |
| Data / crypto | [encryption.md](encryption.md), [key-management.md](key-management.md), [data-security.md](data-security.md) |
| Detect / respond | [monitoring.md](monitoring.md), [incident-management.md](incident-management.md) |
| Architecture placement | [security-architecture.md](security-architecture.md) — avoid duplicating diagrams |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Name the few controls that guard the edge and secrets |
| Medium | Inventory by type with requirement links |
| Large | Evidence and monitoring hooks; compensating controls with review dates |

## Anti-Patterns

- Listing tools without stating the control intent.
- Marking planned controls as active.
- Compensating controls with no residual risk and no owner.
- Duplicating full ops runbooks inside the control catalog.

## Related Documents

- [security-model.md](security-model.md)
- [security-requirements.md](security-requirements.md)
- [security-risk-model.md](security-risk-model.md)
- [threat-modeling.md](threat-modeling.md)
- [auditability.md](auditability.md)
