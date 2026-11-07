# AI Documentation Workflow

> Language: EN | [Português (pt-BR)](../pt-BR/ai-documentation-workflow.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0


Standard workflows for AI-assisted documentation work.

## A. Code Change Workflow

Use when code, config, schema, or infra changes.

```text
1. Start at ai-context.md
2. Identify changed artifacts
3. Map change impact (docs, contracts, registries)
4. Gather evidence from the change itself
5. Update or draft affected docs (status DRAFT/REVIEW as required)
6. Classify claims (Confirmed/Inferred/Unknown/Proposed)
7. Sync dependent docs or open documentation debt
8. Run ai-documentation-validation checks
9. Request human review for material/security/contract/ops changes
10. Record sources for auditability
```

Never mark ACCEPTED without human process.

## B. Question / Analysis Workflow

Use when answering questions or producing analysis (no durable doc write required).

```text
1. Start at ai-context.md → ai-navigation.md
2. Scope the question
3. Progressive load (Levels 0–6 as needed)
4. Collect claims + evidence
5. Resolve SoT conflicts or log contradictions
6. Answer with classifications + confidence
7. List gaps / Unknowns / assumptions
8. Suggest doc updates as Proposed when docs are wrong — do not silently “fix” production SoT in the answer alone without the change workflow
```

## C. New Documentation Workflow

```text
1. Confirm type + id + owner
2. Prefer templates already in the repo when applicable
3. Fill required metadata
4. Write only evidenced content; mark Unknown
5. Link graph relationships
6. Validate + human review
```

## D. After delivery (scaffold vs durable)

Use when the change is ready to merge.

```text
1. Update durable docs (as-is, ADR, contract, runbook, ai-context) or open documentation debt
2. Do not merge execution scaffold (spec, RFC, task plan, sketch) as current-system SoT
3. Keep an explicit backlog folder only if it is labeled as not-as-is discovery
4. Remove docstring / comment pointers to scaffold files that will be deleted
```

A spec may exist on the branch while the work happens. After merge, [source-of-truth.md](source-of-truth.md) (Execution scaffold vs durable knowledge) applies. Agent file layout: [ai-agent-entry.md](ai-agent-entry.md).

## Related Documents

- [ai-change-rules.md](ai-change-rules.md)
- [ai-documentation.md](ai-documentation.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
- [source-of-truth.md](source-of-truth.md)
- [ai-agent-entry.md](ai-agent-entry.md)
