# AI Task Boundaries

> Language: EN | [Português (pt-BR)](../pt-BR/ai-task-boundaries.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


What AI may do with documentation, what needs validation, and what is forbidden.

## Allowed

- Read and navigate docs starting from [ai-context.md](ai-context.md)
- Answer with classified claims and citations
- Draft documentation as `DRAFT`
- Suggest Proposed improvements
- Flag Unknowns, contradictions, drift signals, and debt
- Fix non-material issues (broken links, formatting) per project policy
- Update registries when evidenced by the change under review

## Requires Validation

- Material updates to Architecture, Contract, Operation, Security, Runbook, Incident
- Status transitions (`REVIEW` ↔ `ACCEPTED`, deprecation, archive)
- Ownership changes
- Breaking-change or severity classifications
- Security control/requirement wording
- Anything affecting production procedures or identity/access documentation
- Publishing bilingual counterparts when language policy requires paired updates

Validation means human review and/or project-required checks — AI must not self-ACCEPT.

## Not Allowed

- Inventing facts, components, SLOs, threats, or owners
- Exposing or requesting secret **values**
- Implementing or specifying RAG, embeddings, vector DB, MCP servers, search engines, or chatbots **as part of this documentation standard**
- Presenting Inferred/Proposed as Confirmed current
- Silent deletion of inconvenient evidence or contradictions
- Irreversible production actions from doc context alone
- Rewriting git history to hide leaked secrets (human-led security process only)

## Related Documents

- [ai-change-rules.md](ai-change-rules.md)
- [ai-context-safety.md](ai-context-safety.md)
- [ai-documentation.md](ai-documentation.md)
