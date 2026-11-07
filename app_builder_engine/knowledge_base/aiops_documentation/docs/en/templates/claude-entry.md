---
title: "CLAUDE.md entry"
status: "DRAFT"
owner: "documentation-standard"
created: "2026-08-13"
updated: "2026-08-13"
version: "1.0"
id: "TPL-CLAUDE-001"
type: "Template"
---

# CLAUDE.md entry

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/claude-entry.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Copy to the **repository root** as `CLAUDE.md`. Same grain as `AGENTS.md`. Do not duplicate the documentation standard here.

Policy: [ai-agent-entry.md](../ai-agent-entry.md), [templates/agents-entry.md](agents-entry.md), [source-of-truth.md](../source-of-truth.md).

Replace placeholders. Do not paste secrets.

````markdown
# CLAUDE.md

<project-name> — Claude Code entry. Canonical AI context: `docs/en/ai-context.md` (pt-BR: `docs/pt-BR/ai-context.md`).

## Quality checks (required before finishing a task)

```bash
make docs-validate
# <add: lint, unit tests, typecheck>
```

## Conventions

- Code identifiers in English. Human docs follow repo language policy.
- Conventional commits. Never commit secrets.
- Prefer editing an existing canonical doc over creating a parallel page.

## Durable knowledge

Execution scaffold (spec, RFC, task plan, sketch) lives on the branch and does not enter `main` as current-system SoT.

What survives the merge:

- As-is docs grounded in `path:line` (or this standard's architecture/contract/ops/security pages)
- ADRs under `docs/**/decisions/`
- Module `README.md`
- Explicit discovery backlog only if labeled as not-as-is

Do not point docstrings at scaffold files that will be deleted.

## Skills

- `.claude/skills/document-after-change` — keep Markdown in sync after a relevant change
- `.claude/skills/grill-me` — interview the plan until decisions are closed
````
