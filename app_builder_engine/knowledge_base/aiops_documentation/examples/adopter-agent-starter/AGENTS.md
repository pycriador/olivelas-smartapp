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
