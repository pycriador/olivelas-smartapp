# Corrective Actions

> Language: EN | [Português (pt-BR)](../pt-BR/corrective-actions.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document follow-ups from incidents, reviews, and reliability gaps so they actually change outcomes.

An action without owner, type, and success criteria is a wish.

## Action Types

| Type | Meaning | Example |
| --- | --- | --- |
| **Preventive** | Reduce likelihood of recurrence | Fix bug; add guardrail; remove SPOF |
| **Detective** | Notice faster or more accurately next time | New alert; better SLI; synthetic check |
| **Mitigative** | Reduce impact while failure is happening | Graceful degrade; bulkhead; cache fallback |
| **Recovery** | Restore faster or more safely | Runbook; safer rollback; automated failover |
| **Documentation** | Close knowledge gaps | Update architecture, contract, runbook, ownership |

A single work item may span types; pick the primary type or list both.

## What to Record

| Field | Meaning |
| --- | --- |
| ID | Stable reference |
| Description | Concrete outcome |
| Type | Preventive / Detective / Mitigative / Recovery / Documentation |
| Owner | Team/role — [operational-ownership.md](operational-ownership.md) |
| Priority | Tied to severity/criticality when useful |
| Due / target | Date or milestone — or Not Defined |
| Status | Open / In progress / Done / Won’t do (with reason) |
| Success criteria | How we know it worked |
| Related incident / PIR | Link |
| Classification of underlying issue | Confirmed / Inferred / … |

## Suggested Table

| ID | Action | Type | Owner | Due | Status | Success criteria |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Prioritization Hints

| Prefer first when… | Action type often |
| --- | --- |
| Still blind to the failure | Detective |
| Users hurt for too long | Mitigative / Recovery |
| Same incident class will repeat | Preventive |
| Only tribal knowledge exists | Documentation |

Error-budget exhaustion may elevate preventive/detective work — [error-budget.md](error-budget.md).

## Documentation Actions Matter

If the failure exposed wrong architecture, contract, or runbook content, ship Documentation actions with the same seriousness as code. See [change-policy.md](change-policy.md) and architecture/contract drift docs when relevant.

## Anti-Patterns

- “Be more careful” as an action.
- Preventive-only lists that ignore detection and recovery gaps.
- Closing PIR while all actions remain Open with no owner.

## Related Documents

- [post-incident-review.md](post-incident-review.md)
- [root-cause-analysis.md](root-cause-analysis.md)
- [incident-management.md](incident-management.md)
- [operations-model.md](operations-model.md)
- [runbooks/README.md](runbooks/README.md)
