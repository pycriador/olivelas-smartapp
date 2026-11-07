# Reliability Debt

> Language: EN | [Português (pt-BR)](../pt-BR/reliability-debt.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to distinguish and register **reliability debt** versus other debt kinds.

## Debt Kinds (Keep Them Distinct)

| Kind | Meaning | Typical example |
| --- | --- | --- |
| **Technical debt** | Implementation quality / shortcuts in code or config | Missing tests, fragile module |
| **Architecture debt** | Structural/decision cost — [architecture-debt.md](architecture-debt.md) | Shared writable DB coupling |
| **Contract debt** | Missing/wrong interface rules — [contract-debt.md](contract-debt.md) | Undocumented retry semantics |
| **Documentation debt** | Missing/wrong/stale docs — [documentation-debt.md](documentation-debt.md) | No runbook |
| **Reliability debt** | Accepted or unnoticed **operability/reliability risk** in how the system fails, is detected, or recovered | No alert on critical path; untested restore; SPOF with no mitigation |

They often co-exist. Register each under the right kind so remediation targets the right artifact.

## When Something Is Reliability Debt

Treat as reliability debt when the issue is primarily about:

- missing or ineffective detection for material failures;
- missing or unsafe recovery paths;
- known SPOFs / failure modes without mitigation or acceptance;
- untested backup/restore or claimed DR without evidence;
- alerts that are non-actionable or routinely ignored;
- error-budget / SLO commitments without ownership;
- operational knowledge that exists only as tribal memory for critical paths.

Do **not** label every bug or missing unit test as reliability debt.

## How to Register

| Field | Meaning |
| --- | --- |
| **ID** | Stable id (e.g. `REL-014`) |
| **Description** | What reliability/operability gap exists |
| **Impact** | Failure mode, blast radius, MTTD/MTTR effect if known |
| **Owner** | Accountable team/role |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Optional: linked failure mode, runbook gap, incident, game day finding, architecture/contract debt IDs.

## Priority Guidance

| Priority | Guidance |
| --- | --- |
| **High** | Critical path blind or unrecoverable; repeated SEV-level incidents |
| **Medium** | Meaningful detection/recovery gap; workarounds exist |
| **Low** | Hardening preference; low blast radius |

`Accepted Risk` requires explicit owner acknowledgment — not neglect.

## Related Documents

- [operational-drift.md](operational-drift.md)
- [failure-modes.md](failure-modes.md)
- [operational-readiness.md](operational-readiness.md)
- [corrective-actions.md](corrective-actions.md)
- [reliability-metrics.md](reliability-metrics.md)
- [operations-model.md](operations-model.md)
