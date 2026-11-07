# AI Change Rules

> Language: EN | [Português (pt-BR)](../pt-BR/ai-change-rules.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Rules for AI agents when proposing or applying documentation (and doc-impacting) changes.

## Allowed Without Extra Gate (Typical)

- Fix broken relative links
- Add Unknown markers and gap lists
- Add evidence citations to existing claims
- Draft new content as `DRAFT`
- Propose Proposed improvements clearly labeled

## Requires Validation / Human Review

- Material architecture, contract, ops, or security changes
- Ownership reassignment
- Status transitions toward `ACCEPTED`
- Breaking change declarations
- Deprecation / archive of ACCEPTED docs
- Any change that alters incident/runbook safety steps

## Not Allowed

- Setting `ACCEPTED` unilaterally
- Inventing components, SLOs, controls, or owners
- Writing secret values
- Presenting Proposed as current
- Treating Inferred as Confirmed
- Silently deleting contradictory evidence
- Implementing RAG/agents/MCP as part of “doc updates”

## Process

1. Run change impact ([change-impact.md](change-impact.md)).
2. Update dependent docs or open debt items.
3. Preserve bilingual rules when the repo requires EN + pt-BR ([language.md](language.md)).
4. Leave status `DRAFT`/`REVIEW` per [ai-documentation.md](ai-documentation.md) and [change-policy.md](change-policy.md).
5. Provide an audit trail of sources ([ai-auditability.md](ai-auditability.md)).

## Related Documents

- [ai-documentation-workflow.md](ai-documentation-workflow.md)
- [ai-task-boundaries.md](ai-task-boundaries.md)
- [change-policy.md](change-policy.md)
