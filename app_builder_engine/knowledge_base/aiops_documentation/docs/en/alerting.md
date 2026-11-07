# Alerting

> Language: EN | [Português (pt-BR)](../pt-BR/alerting.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document alerts so they are **actionable**.

An alert that cannot drive a decision wastes attention and erodes trust. Prefer fewer, clearer alerts over noisy coverage theater.

## Actionable Alert Chain

```text
Condition → Alert → Owner → Action → Escalation
```

| Stage | Meaning |
| --- | --- |
| **Condition** | Observable predicate (threshold, absence of signal, health fail) |
| **Alert** | Notification channel and severity / priority label |
| **Owner** | Who receives it ([operational-ownership.md](operational-ownership.md)) |
| **Action** | First steps or runbook link |
| **Escalation** | When and to whom if not resolved |

## Suggested Inventory

| Condition | Alert | Owner | Action | Escalation |
| --- | --- | --- | --- | --- |
| | | | link runbook / steps | |

## Quality Rules

| Do | Avoid |
| --- | --- |
| Alert on symptoms tied to user or SLO impact when possible | Alert on every internal gauge |
| Include enough context to start diagnosis | Page with a bare metric name only |
| Link a runbook or explicit action | Expect tribal knowledge at 3am |
| Define escalation | Leave on-call stuck alone |
| Tune after false positives | Shame people for muting bad alerts without fixing them |

If no on-call exists, document who is notified and that formal paging is **Not Applicable**.

## Severity vs Criticality

Alert urgency may follow [incident-severity.md](incident-severity.md). Component [criticality.md](criticality.md) informs whether an alert should exist — they are related, not identical.

## Absence of Signal

“No data” can be as important as a bad value. Document monitors for observability-backend failure when blindness is unacceptable ([operational-dependencies.md](operational-dependencies.md)).

## Related Documents

- [monitoring.md](monitoring.md)
- [runbooks/README.md](runbooks/README.md)
- [incident-management.md](incident-management.md)
- [incident-severity.md](incident-severity.md)
- [operational-ownership.md](operational-ownership.md)
- [error-budget.md](error-budget.md)
