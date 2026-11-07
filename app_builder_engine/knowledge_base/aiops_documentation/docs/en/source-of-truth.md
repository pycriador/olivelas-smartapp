# Source of Truth

> Language: EN | [Português (pt-BR)](../pt-BR/source-of-truth.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0


Which artifact is authoritative for each kind of information, and how to resolve conflicts.

## Authority by Information Type

| Information | Authoritative source | Documentation role |
| --- | --- | --- |
| Runtime behavior | Code + deployed config + observable runtime | Describe and cite; do not invent |
| Public API / event shape | Canonical schema + contract doc | Contract doc must track schema |
| Architecture intent / constraints | Accepted ADRs + architecture docs | Docs explain; ADR decides |
| Operational procedure | Accepted runbook | Runbook must match real tooling |
| Service levels | Accepted SLO/SLI definitions | Metrics impl should match definitions |
| Security controls in force | Implemented controls + accepted security docs | Never claim unverified controls |
| Ownership | Ownership metadata / team registry | Prefer durable team ids |
| Incident facts | Incident record + timeline tags | Hypotheses stay labeled |
| Secrets | Secret manager / Vault references | Docs store **names**, never values |
| Documentation standard itself | This repository’s ACCEPTED standard docs | Project docs must not fork silently |
| Current system behavior after a delivery | Durable docs on the default branch (as-is, ADR, contract, runbook) | Execution scaffold (spec, RFC, task plan) is not SoT |
| Published Confluence pages | Same Markdown after `docs-sync` (one-way) | Navigable Confluence links + GitHub source/code links — [publishing-surfaces.md](publishing-surfaces.md) |

See also domain-specific SoT: [contract-source-of-truth.md](contract-source-of-truth.md).

## Execution scaffold vs durable knowledge

A spec, RFC, or task plan is **execution scaffold**. It is not the source of truth for how the system behaves after merge.

| Layer | What it is | Where it lives | Authority |
| --- | --- | --- | --- |
| **Execution scaffold** | Spec, RFC, task plan, sketch, rollout report | Feature branch / pull request | Informational while the work is in flight. Do not merge it as the description of current behavior. |
| **Durable knowledge** | As-is docs, ADRs, contracts, runbooks, `ai-context.md` | Default branch (`main`) | Authoritative only after the usual lifecycle (`DRAFT` → `REVIEW` → `ACCEPTED`) |
| **Explicit backlog exception** | Discovery not yet started (optional path such as `docs/specs/backlog/`) | Default branch only if labeled as backlog, not as-is | Does **not** describe current code. Later spec cleanup must skip or relabel it. |

When a delivery finishes:

1. Update the canonical durable document, or open [documentation debt](documentation-debt.md).
2. Do not leave the spec as the record of what the system does.
3. Do not point code comments or docstrings at scaffold files that will be deleted.

How a team writes specs before coding is out of scope here. A spec may exist on the branch; it is not runtime SoT after merge. See [ai-documentation-workflow.md](ai-documentation-workflow.md) and [ai-agent-entry.md](ai-agent-entry.md).

## Conflict Resolution Order

When sources disagree:

1. **Runtime evidence** (code, config, tests, production signals) for *current behavior* claims.
2. **Accepted contract / schema** for *interface* claims between participants.
3. **Accepted ADR** for *decision / constraint* claims.
4. **Accepted domain doc** (architecture, ops, security) for synthesized explanation.
5. **DRAFT / REVIEW docs** — informational until accepted.
6. **Historical / deprecated docs** — not current SoT ([history-model.md](history-model.md)).

If still unresolved: mark **Unknown** or open a [contradiction](contradiction-model.md); do not pick the most convenient narrative.

## Documentation vs Implementation

```text
If docs ≠ implementation:
  → treat as drift (see documentation-drift.md and domain drift docs)
  → do not “fix” by inventing a desired state as Confirmed current
```

## AI Rules

- Prefer Authoritative and Verified sources ([authority-levels.md](authority-levels.md)).
- Cite the SoT used for Confirmed claims ([evidence-references.md](evidence-references.md)).
- Never elevate blog posts, chat, or unverified AI text above code/contracts/ADRs.

## Related Documents

- [authority-levels.md](authority-levels.md)
- [evidence-model.md](evidence-model.md)
- [documentation-drift.md](documentation-drift.md)
- [contract-source-of-truth.md](contract-source-of-truth.md)
- [ai-documentation-workflow.md](ai-documentation-workflow.md)
- [ai-agent-entry.md](ai-agent-entry.md)
- [publishing-surfaces.md](publishing-surfaces.md)
