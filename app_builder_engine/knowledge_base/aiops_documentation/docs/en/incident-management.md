# Incident Management

> Language: EN | [Português (pt-BR)](../pt-BR/incident-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document the incident lifecycle from detection through learning.

Projects may use lightweight or formal process. Document what you actually do. If there is no incident process, state **Not Defined** rather than copying a large framework.

## Lifecycle

```text
Detection → Triage → Response → Mitigation → Resolution → Communication → Post-Incident Review
```

| Stage | Meaning |
| --- | --- |
| **Detection** | Something is wrong (alert, health, user report, synthetic) |
| **Triage** | Severity, scope, owner, whether it is an incident |
| **Response** | Mobilize people; start timeline; follow runbooks |
| **Mitigation** | Reduce user impact (degrade, failover, feature off, scale) |
| **Resolution** | Underlying issue fixed or stable workaround accepted |
| **Communication** | Status to stakeholders as the project defines |
| **Post-Incident Review** | Blameless learning — [post-incident-review.md](post-incident-review.md) |

Stages can overlap (mitigate before full diagnosis). Record facts in the [incident timeline](incident-timeline.md).

## Roles During an Incident

Align with [operational-ownership.md](operational-ownership.md):

| Role | Duty (typical) |
| --- | --- |
| Incident lead / commander | Coordinates; decides focus |
| Technical responders | Diagnose and fix |
| Communicator | External/internal updates when used |
| Escalation | Unblocks or brings specialists |

Small teams may combine roles — say so.

## Severity

Classify with the project’s model — example SEV-1..4 in [incident-severity.md](incident-severity.md). Severity drives urgency and communication, not blame.

## Inputs and Outputs

| Input | Output |
| --- | --- |
| Alerts, health, user reports | Severity, channel, responders |
| Runbooks, architecture, contracts | Mitigation / resolution actions |
| Timeline facts | PIR, RCA, corrective actions |

## Integration

| Artifact | Use |
| --- | --- |
| [alerting.md](alerting.md) | Detection path |
| [runbooks/README.md](runbooks/README.md) | Response actions |
| [degradation.md](degradation.md) | Intentional mitigation modes |
| [failure-modes.md](failure-modes.md) | Known modes |
| [root-cause-analysis.md](root-cause-analysis.md) | After stabilization |
| [corrective-actions.md](corrective-actions.md) | Improvements |

## Anti-Patterns

- Skipping mitigation to chase root cause while users burn.
- No timeline until days later (memory is not a record).
- Review that assigns personal blame ([post-incident-review.md](post-incident-review.md)).

## Related Documents

- [incident-severity.md](incident-severity.md)
- [incident-timeline.md](incident-timeline.md)
- [post-incident-review.md](post-incident-review.md)
- [operations-model.md](operations-model.md)
