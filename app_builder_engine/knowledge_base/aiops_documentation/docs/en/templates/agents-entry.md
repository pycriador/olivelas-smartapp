---
title: "AGENTS.md entry"
status: "DRAFT"
owner: "documentation-standard"
created: "2026-08-13"
updated: "2026-08-13"
version: "1.0"
id: "TPL-AGENTS-001"
type: "Template"
---

# AGENTS.md entry

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/agents-entry.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Copy to the **repository root** as `AGENTS.md`. Keep it short. Durable methodology lives in `docs/**/ai-context.md`, not here.

Policy: [ai-agent-entry.md](../ai-agent-entry.md), [ai-context.md](../ai-context.md), [source-of-truth.md](../source-of-truth.md).

Replace placeholders. Do not paste secrets.

```markdown
# AGENTS.md

Engineering Documentation Standard — agent entry. Start at `docs/en/ai-context.md` (pt-BR: `docs/pt-BR/ai-context.md`).

## Stack

- Language / runtime: <fill>
- Package manager: <fill>
- Docs: Markdown under `docs/en/` and `docs/pt-BR/` (keep both in sync when both exist)

## Commands

- Validate docs: `make docs-validate`
- <add project test / lint / typecheck commands>

## Boundaries

- Always: classify claims; no secrets or PII in docs; run quality checks before declaring done
- Ask first: status toward `ACCEPTED`; ownership changes; breaking contracts; runbook safety steps
- Never: invent components, SLOs, owners, or controls; merge execution scaffold (spec/RFC/task plan) as current-system SoT

## Durable vs scaffold

Specs, RFCs, and task plans stay on the branch. After merge, update as-is docs, ADRs, contracts, or runbooks — or open documentation debt.

## Skills

- After a relevant change: `.cursor/skills/document-after-change` (Claude Code: `.claude/skills/document-after-change`)
- Stress-test a plan: `.cursor/skills/grill-me`
```
