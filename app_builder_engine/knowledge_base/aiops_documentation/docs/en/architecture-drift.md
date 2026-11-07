# Architecture Drift

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Architecture drift is the gap between documented architecture and actual architecture.

```text
Documented Architecture
          ≠
Actual Architecture
```

This standard defines how to recognize, register, and treat drift. It does **not** introduce automation in this version — detection remains human and change-driven (reviews, PRs, incidents, onboarding).

## Why It Matters

Drift erodes trust in documentation, misleads AI agents and new engineers, and hides real failure and trust boundaries. Treating docs as current when they are not is worse than marking Unknown.

## Signals of Drift

| Signal | Example |
| --- | --- |
| Documented component missing | Overview lists a worker that was removed |
| Existing component undocumented | New deployable unit in prod with no architecture mention |
| Undocumented dependency | Service calls a new external API with no dependency entry |
| Divergent flow | Sequence diagram no longer matches runtime path |
| Contract changed | Schema evolved; architecture still describes old shape |
| Infrastructure divergent | Deploy topology changed; infra diagram stale |
| ADR no longer valid | Decision superseded in practice without a new ADR or deprecation |

Related: [stale-documentation.md](stale-documentation.md). Age alone is a signal, not proof.

## How to Register Drift

When drift is found:

1. **Classify impact** — cosmetic naming vs structural/operational/security risk.
2. **Record** — PR comment, review record follow-up, or debt item:
   - documentation debt for missing/wrong docs ([documentation-debt.md](documentation-debt.md));
   - architecture debt when the *structure* itself is the problem ([architecture-debt.md](architecture-debt.md)).
3. **Point to evidence** — code path, config, contract, deploy manifest, incident link.
4. **Do not silently "fix" by inventing** a desired architecture as current state.

Suggested fields when logging drift (lightweight):

| Field | Meaning |
| --- | --- |
| **ID** | Optional stable id (`DRIFT-003`) |
| **Documented** | What docs claim |
| **Actual** | What exists (with evidence) |
| **Impact** | Who/what is misled or at risk |
| **Owner** | Who will reconcile |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

## How to Treat Drift

| Finding | Action |
| --- | --- |
| Docs wrong, system correct | Update docs; `ACCEPTED → REVIEW → ACCEPTED` for material docs |
| System wrong vs accepted architecture | Fix system **or** accept a new ADR / revise architecture intentionally — do not leave silent divergence |
| Both evolving | Land ADR + docs + code in coordinated changes when possible |
| Temporary gap | Open debt with owner and priority; do not present as Confirmed |

Proposed future architecture must stay labeled Proposed until it becomes current.

## What This Standard Does Not Do

- No required bots, linters, or continuous architecture verification in this version.
- No mandate for a separate drift tool.
- Projects may add automation later without changing these definitions.

## Related Documents

- [architecture-review.md](architecture-review.md)
- [architecture-debt.md](architecture-debt.md)
- [documentation-debt.md](documentation-debt.md)
- [stale-documentation.md](stale-documentation.md)
- [architecture-checklist.md](architecture-checklist.md)
- [change-policy.md](change-policy.md)
