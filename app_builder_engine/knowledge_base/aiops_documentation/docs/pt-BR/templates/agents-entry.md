---
title: "Entrada AGENTS.md"
status: "DRAFT"
owner: "documentation-standard"
created: "2026-08-13"
updated: "2026-08-13"
version: "1.0"
id: "TPL-AGENTS-001"
type: "Template"
---

# Entrada AGENTS.md

> Language: pt-BR | [English (EN)](../../en/templates/agents-entry.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Copie para a **raiz do repositório** como `AGENTS.md`. Mantenha curto. A metodologia durável vive em `docs/**/ai-context.md`, não aqui.

Política: [ai-agent-entry.md](../ai-agent-entry.md), [ai-context.md](../ai-context.md), [source-of-truth.md](../source-of-truth.md).

Substitua placeholders. Não cole secrets.

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
