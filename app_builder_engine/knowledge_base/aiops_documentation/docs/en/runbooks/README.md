# Runbooks

> Language: EN | [Português (pt-BR)](../../pt-BR/runbooks/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

What a runbook is, how adopting projects should structure them, and safety rules for operational procedures.

## Concept

A **runbook** is an executable procedure for diagnosing and/or resolving an operational situation. It tells a trained responder what to check, what to do, how to validate, and when to escalate.

Runbooks sit in the Respond / Recover stages of the [operations model](../operations-model.md). They must stay aligned with current [architecture](../architecture-model.md) and [contracts](../contract-model.md).

## When to Write One

| Situation | Guidance |
| --- | --- |
| Recurring or high-impact failure | Write a runbook |
| Rare but Critical path | Write at least diagnosis + escalation |
| Obvious one-step restart with no risk | Short runbook or section in troubleshooting may suffice |
| Unknown procedure | Do not invent; mark gaps and escalate |

## Minimum Contents

| Section | Purpose |
| --- | --- |
| Purpose / scope | What outcome; what is out of scope |
| Preconditions | What must be true before acting |
| Symptoms | How the situation presents |
| Diagnosis | Ordered checks |
| Resolution | Ordered actions |
| Validation | How to confirm success |
| Rollback | How to undo if resolution makes things worse |
| Escalation | Who next, with what context |

Use the project template: [../templates/runbook.md](../templates/runbook.md). Related: [../templates/troubleshooting.md](../templates/troubleshooting.md).

## Safety Rules

### Destructive actions

- Label destructive steps explicitly (data delete, failover, force unlock, drop traffic).
- Require precondition checks before destructive steps.
- Prefer least-destructive mitigation first when safe.
- Never paste secrets, credentials, or raw PII into runbooks.

### Preconditions

- State environment, role/permissions needed, and “do not proceed if…”.
- Verify the incident matches the runbook scope before irreversible actions.

### Validation

- Every resolution path needs validation checks with expected results.
- Include “what good looks like” for metrics/health/user journey.

### Rollback

- Document rollback when the resolution can worsen impact.
- If rollback is impossible, say **irreversible** and require explicit confirmation / escalation.
- See also project rollback policy when present.

### Ownership and freshness

- Owner recommended for `ACCEPTED` runbooks ([../ownership.md](../ownership.md), [../operational-ownership.md](../operational-ownership.md)).
- Update runbooks when architecture, contracts, or alerts change; stale runbooks are operational debt.

## Indexing

Adopting projects should keep a simple index (name → symptom → link → owner). This README is the **standard’s** guidance; project runbooks live in the adopting repo’s operations area.

## Related Documents

- [../templates/runbook.md](../templates/runbook.md)
- [../templates/troubleshooting.md](../templates/troubleshooting.md)
- [../alerting.md](../alerting.md)
- [../incident-management.md](../incident-management.md)
- [../operations-model.md](../operations-model.md)
- [../operations/README.md](../operations/README.md)
