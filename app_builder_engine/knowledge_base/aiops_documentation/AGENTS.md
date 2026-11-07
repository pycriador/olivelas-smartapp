# AGENTS.md

Engineering Documentation Standard — agent entry. Start at [docs/en/ai-context.md](docs/en/ai-context.md) (pt-BR: [docs/pt-BR/ai-context.md](docs/pt-BR/ai-context.md)). How to package these files: [docs/en/ai-agent-entry.md](docs/en/ai-agent-entry.md).

## Stack

- Documentation framework (Markdown). No application runtime.
- Python 3 stdlib linter: `scripts/docs_lint.py`
- Optional Confluence publisher: `docs-sync/`

## Commands

- Validate docs: `make docs-validate`
- Link check: `make docs-check-links`
- Manifest check: `make docs-check-manifest`

## Boundaries

- Always: classify claims; no secrets or PII in docs; run `make docs-validate` before declaring done; keep `docs/en/` and `docs/pt-BR/` in sync
- Ask first: status toward `ACCEPTED`; ownership changes; deprecating ACCEPTED docs
- Never: invent components, SLOs, owners, or controls; set `ACCEPTED` unilaterally; implement RAG/MCP as part of doc updates; merge execution scaffold (spec/RFC/task plan) as current-system SoT

## Durable vs scaffold

Specs, RFCs, and task plans stay on the branch. After merge, update canonical Markdown or open documentation debt. See [docs/en/source-of-truth.md](docs/en/source-of-truth.md).

## Skills

- After a relevant change: `.cursor/skills/document-after-change` (Claude Code: `.claude/skills/document-after-change`)
- Stress-test a plan: `.cursor/skills/grill-me`
- Topic map: `.cursor/rules/docs-area-map.mdc`
