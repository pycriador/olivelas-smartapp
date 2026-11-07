# Deployment Operations

> Language: EN | [Português (pt-BR)](../pt-BR/deployment-operations.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document deploy, validate, and rollback from an **operational** perspective.

This standard does **not** prescribe a universal deploy tool or command set. Document the project’s real pipeline and verification steps.

## Core Loop

```text
Deploy → Validate → (Rollback if needed)
```

| Stage | Question |
| --- | --- |
| **Deploy** | How is a change released to the target environment? |
| **Validate** | How do operators know the release is healthy? |
| **Rollback** | How is a bad release undone — when rollback is possible? |

## What to Document

| Topic | Guidance |
| --- | --- |
| Environments | Which environments exist and what each is for |
| Change entry | How a release is initiated (pipeline, manual gate, etc.) — as used |
| Artifacts | What is deployed (image digest, package, config bundle — project terms) |
| Preconditions | Required state before deploy |
| Steps | High-level sequence; link to canonical CI/CD docs — **no invented commands** |
| Validation checks | Health, smoke, metrics, synthetic checks actually used |
| Success criteria | When the deploy is considered complete |
| Failure criteria | When to stop / roll back / escalate |
| Rollback | Link [rollback.md](rollback.md); note irreversible changes |
| Owners | Who may approve/execute — [operational-ownership.md](operational-ownership.md) |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Commands and Paths

- Document **project-specific** commands, job names, or console steps only when evidenced.
- Prefer placeholders (`<environment>`, `<release-id>`) over invented cluster names.
- Never embed secrets. Never invent destructive commands “for completeness.”

## Planned vs Emergency Deploys

Distinguish normal releases from emergency changes ([change-management.md](change-management.md)). Emergency paths still need validation and clear ownership.

## Related Documents

- [change-management.md](change-management.md)
- [rollback.md](rollback.md)
- [operational-state.md](operational-state.md)
- [maintenance.md](maintenance.md)
- [runbooks/README.md](runbooks/README.md)
- [change-policy.md](change-policy.md) — documentation change completeness
