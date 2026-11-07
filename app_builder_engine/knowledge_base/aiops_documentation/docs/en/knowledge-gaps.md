# Knowledge Gaps

> Language: EN | [Português (pt-BR)](../pt-BR/knowledge-gaps.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How to label missing or uncertain knowledge without filling it with fiction.

## Gap Categories

| Category | Meaning | AI behavior |
| --- | --- | --- |
| **Known** | Fact established and documented | Use freely with citations |
| **Unknown** | Not identified; no adequate evidence | State Unknown; do not invent |
| **Assumed** | Taken as true for progress without proof | Label Assumed; seek verification |
| **Needs Verification** | Candidate fact with weak/aged evidence | Treat as unverified; plan check |

## Relationship to Classification

| Gap label | Typical claim classification |
| --- | --- |
| Known | Confirmed (when evidenced) |
| Unknown | Unknown |
| Assumed | Inferred or Proposed depending on intent |
| Needs Verification | Inferred (or Unknown if too weak) |

Assumed ≠ Confirmed. Needs Verification ≠ Confirmed.

## Registering Gaps

Keep a simple list (doc section, debt item, or table):

| ID | Gap | Category | Owner | Next action |
| --- | --- | --- | --- | --- |
| GAP-003 | Multi-region failover | Unknown | platform-team | Confirm with ops |

## Related Documents

- [evidence-model.md](evidence-model.md)
- [documentation-debt.md](documentation-debt.md)
- [documentation-coverage.md](documentation-coverage.md)
