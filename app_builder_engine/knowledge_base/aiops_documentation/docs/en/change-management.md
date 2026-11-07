# Operational Change Management

> Language: EN | [Português (pt-BR)](../pt-BR/change-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **operational** change management: Planned vs Emergency changes that affect running systems.

This complements [change-policy.md](change-policy.md) (documentation must follow relevant technical changes). Here the focus is **how production (or shared) environments are changed safely**.

## Change Classes

| Class | Meaning | Typical traits |
| --- | --- | --- |
| **Planned** | Scheduled, reviewed, reversible when possible | Lead time, peer review, standard deploy path, announced window when needed |
| **Emergency** | Urgent risk reduction (incident, security, data loss) | Shortened approval, heightened communication, mandatory follow-up review |

Projects may add subclasses (standard / normal / major). Document the **project’s** model; do not invent a bureaucracy the team does not use.

## What to Document per Change (When Material)

| Topic | Question |
| --- | --- |
| Intent | What changes and why |
| Risk | Blast radius, irreversibility, data impact |
| Plan | Steps, owner, window |
| Validation | How success is judged |
| Rollback | Path or explicit “not rollback-safe” |
| Communication | Who is informed |
| Follow-up | PIR, corrective actions, doc updates |

## Planned Changes

Document or link:

1. How changes are proposed and approved.
2. Standard deploy/validate path ([deployment-operations.md](deployment-operations.md)).
3. When maintenance windows apply ([maintenance.md](maintenance.md)).
4. When error-budget or freeze policies slow change ([error-budget.md](error-budget.md)).

## Emergency Changes

Document or link:

1. Who may authorize an emergency change.
2. Minimum validation still required.
3. How the change is recorded during the incident ([incident-timeline.md](incident-timeline.md)).
4. Mandatory post-change review ([post-incident-review.md](post-incident-review.md) when tied to an incident).

Emergency speed does **not** excuse inventing steps or skipping ownership.

## Anti-Patterns

- Treating every hotfix as “no process.”
- Documenting a heavy CAB process the team does not follow.
- Silent production changes with no timeline entry or deploy record.

## Related Documents

- [deployment-operations.md](deployment-operations.md)
- [rollback.md](rollback.md)
- [maintenance.md](maintenance.md)
- [incident-management.md](incident-management.md)
- [change-policy.md](change-policy.md)
- [operational-ownership.md](operational-ownership.md)
