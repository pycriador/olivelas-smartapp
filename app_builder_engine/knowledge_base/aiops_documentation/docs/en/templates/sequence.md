---
title: "Sequence"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
# sequence_id: "stable-name"
---

# Sequence

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/sequence.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Ordered interactions for one meaningful operation or scenario. Prefer Mermaid sequence diagrams when they clarify timing. Current state only unless labeled Proposed. -->

## Purpose

<!-- What scenario this sequence documents and when it applies. -->

## Actors and Components

| Participant | Kind | Role |
| --- | --- | --- |
| | actor / origin / component / external | |

## Preconditions

| Condition | Notes |
| --- | --- |
| | |

## Steps

| Step | From | To | Interaction | Notes |
| --- | --- | --- | --- | --- |
| 1 | | | call / response / event / other | |

## Calls

| Call | From | To | Contract | Timeout |
| --- | --- | --- | --- | --- |
| | | | | |

## Responses

| Response | From | To | Meaning |
| --- | --- | --- | --- |
| | | | |

## Events

| Event | Publisher | Consumer | Contract |
| --- | --- | --- | --- |
| | | | |

<!-- Mark Not Applicable if the sequence has no events. -->

## Timeouts

| Interaction | Timeout | On timeout |
| --- | --- | --- |
| | | |

## Errors

| Error | Detection | Handling | Classification |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown |

## Retries

| Interaction | Policy | Limit | Notes |
| --- | --- | --- | --- |
| | | | |

<!-- Mark Not Applicable if no retry behavior exists. -->

## Result

| Outcome | Condition | Observable effect |
| --- | --- | --- |
| Success | | |
| Failure | | |
| Partial / other | | |

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Actor as Actor
  participant Origin as Origin
  participant Component as Component
  Actor->>Origin: request
  Origin->>Component: call
  Component-->>Origin: response
  Origin-->>Actor: result
```

<!-- Recommended when timing and ordering matter. Label error, timeout, and retry paths when they are architecturally relevant. -->

## Related Documentation

| Document | Path |
| --- | --- |
| Data flow | |
| Contracts | |
| Components | |
| ADRs | |
