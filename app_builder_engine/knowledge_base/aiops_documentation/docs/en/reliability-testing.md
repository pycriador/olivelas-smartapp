# Reliability Testing

> Language: EN | [Português (pt-BR)](../pt-BR/reliability-testing.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Conceptual strategies for testing reliability — **not** a mandate for a specific tool, chaos product, or load framework.

Document what the project actually practices. Mark **Not Applicable** or **Not Defined** when strategies are unused.

## Why Document Strategies (Not Recipes)

Reliability testing answers: *Do our failure and recovery assumptions hold?* Documentation should capture **intent and coverage**, not invent cluster-specific attack scripts.

## Strategy Catalog (Examples — Not Exhaustive)

| Strategy | Intent | Typical evidence |
| --- | --- | --- |
| **Failure injection** | Verify isolation and degradation when a dependency fails | Test notes, game day report, feature flag experiment |
| **Latency / timeout tests** | Verify behavior under slow dependencies | Contract timeout alignment, integration tests |
| **Load / saturation** | Find capacity cliffs and queue blow-ups | Capacity review, load test summary |
| **Failover / restore drills** | Verify RTO/RPO-relevant paths | Restore test date, DR exercise |
| **Idempotency / duplicate delivery** | Verify contract retry/delivery assumptions | Contract tests, replay drills |
| **Config / flag rollback drills** | Verify change undo paths | Change records |
| **Synthetic checks** | Continuous shallow verification of critical journeys | Monitoring config |

Projects may use other names. Map local terms once.

## What to Document per Strategy Used

| Field | Content |
| --- | --- |
| Strategy | Name |
| Scope | What is covered / excluded |
| Frequency | Continuous / periodic / ad hoc / never |
| Owner | Who designs and interprets results |
| Linked failure modes | [failure-modes.md](failure-modes.md) |
| Linked runbooks | Recovery validation |
| Last executed | Date or Unknown |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Rules

- Conceptual only in this standard — **no universal chaos commands**.
- Do not claim resilience that was never tested.
- Align tests with contract semantics (timeout, retry, idempotency) and architecture failure domains.
- Prefer linking to existing test docs over copying suites into ops docs.

## Related Documents

- [game-days.md](game-days.md)
- [failure-modes.md](failure-modes.md)
- [reliability-model.md](reliability-model.md)
- [capacity.md](capacity.md)
- [contract-testing.md](contract-testing.md)
- [operational-readiness.md](operational-readiness.md)
