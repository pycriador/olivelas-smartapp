---
title: "AI agent entry files"
status: "DRAFT"
owner: "documentation-standard"
created: "2026-08-13"
updated: "2026-08-13"
review_date: "2026-11-13"
version: "1.0"
id: "REF-AI-ENTRY-001"
type: "Reference"
---

# AI agent entry files

> Language: EN | [Português (pt-BR)](../pt-BR/ai-agent-entry.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

How to wire Cursor, Claude Code, and similar coding agents to this Documentation Standard.

This page is **packaging**: which files the agent loads, what belongs in each, and what not to vendor. Methodology stays in [ai-context.md](ai-context.md), [ai-prompt-context.md](ai-prompt-context.md), and [source-of-truth.md](source-of-truth.md). This standard still does **not** specify RAG, embeddings, MCP servers, or agent runtimes.

## When to use

- A project adopted (or is adopting) this standard and uses an AI coding agent.
- Agent output ignores conventions, invents APIs, or treats a spec as current-system truth.
- You need a copy-paste starter: [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/).

## Context hierarchy (persistent → transient)

Load from the top. Do not dump the whole `docs/` tree into one prompt.

| Layer | Artifact | Load when |
| --- | --- | --- |
| 1 | `AGENTS.md` and/or `CLAUDE.md` | Always (tool-specific entry) |
| 2 | `.cursor/rules/*.mdc` (and Claude equivalents) | Always or by glob |
| 3 | Canonical docs for the task | Per session — start at `ai-context.md` |
| 4 | Relevant source files and tests | Per task |
| 5 | Error / test / validator output | Per iteration |
| 6 | Conversation history | Accumulates; start a new session when it goes stale |

Assembly rules: [ai-prompt-context.md](ai-prompt-context.md). Progressive depth: [progressive-context.md](progressive-context.md).

## File roles

| File | Role | What to put | What not to put |
| --- | --- | --- | --- |
| `AGENTS.md` | Generic agent entry (Cursor, Codex, others) | Stack, commands, boundaries, pointer to `docs/**/ai-context.md` | Full runbooks, duplicated standard text |
| `CLAUDE.md` | Claude Code entry | Same grain as `AGENTS.md`; may add Claude-only commands | A second copy of the documentation standard |
| `.cursor/rules/*.mdc` | Short guardrails | Always-apply quality checks; docs-first pointers | Long methodology (that belongs in `.md`) |
| `.cursor/skills/` and `.claude/skills/` | Workflows | Step-by-step skills (`document-after-change`, `grill-me`) | Durable facts that should live in `docs/` |
| `docs/**/ai-context.md` | Methodological AI entry | Navigation, levels 0–6, safety | Tool-specific file names only |

Templates: [templates/agents-entry.md](templates/agents-entry.md), [templates/claude-entry.md](templates/claude-entry.md).

`.md` is durable knowledge. `.mdc` is a short guardrail. A skill is a workflow. See the project rule `docs-knowledge-in-markdown`.

## Recommended skills and rules (this standard)

| Need | Use |
| --- | --- |
| Docs after a code / contract / ops / security change | Skill `document-after-change` |
| Stress-test a plan or design before writing | Skill `grill-me` |
| Quality gate before declaring a task done | Local rule with the project's real commands (`make docs-validate`, `ruff`, `pytest`, …) |
| Where to read first in this corpus | Rule `docs-area-map` (this repo) or the adopter's `ai-context.md` |

## Adopter map (Olivelas plugins vs this standard)

Do **not** copy a generic 20+ skill pack into every service repo. Prefer the plugin or framework artifact that already owns the topic.

| Need | Use |
| --- | --- |
| Docs after change | This framework: `document-after-change` |
| As-is documentation of an existing module | Olivelas plugin `loft-docs` / skill `as-is-module-documentation` |
| API and interface contracts | Olivelas plugin `loft-api` + [contract-model.md](contract-model.md) |
| Secrets and credentials | Olivelas plugin `loft-security` |
| CI/CD, Kubernetes, Datadog | Olivelas plugin `loft-deploy` |
| Project quality checks | A **local** rule with the commands that actually run in that repo |
| Generic idea-refine / TDD / frontend skill packs | Optional in an application repo; **not** part of this Documentation Standard |

## Anti-patterns

- Vendoring a company-wide “engineering standards” rule that duplicates (and goes stale vs) org plugins.
- Committing execution scaffold (spec, RFC, task plan) to `main` as if it described current behavior — [source-of-truth.md](source-of-truth.md).
- Duplicating [templates/adr.md](templates/adr.md) inside a generic “documentation and ADRs” skill.
- Treating `AGENTS.md` / `CLAUDE.md` as the documentation standard (they are pointers).
- Adding Cursor agents, hooks, or slash commands because other tools have them — only add them when the project has a concrete workflow. Tracked as [documentation debt](documentation-debt.md) `DOC-015` in this repository.

## This repository

| Artifact | Path |
| --- | --- |
| Agent entry | [AGENTS.md](../../AGENTS.md), [CLAUDE.md](../../CLAUDE.md) |
| Quality checks | [`.cursor/rules/docs-quality-checks.mdc`](../../.cursor/rules/docs-quality-checks.mdc) |
| Skills | [`.cursor/skills/`](../../.cursor/skills/), [`.claude/skills/`](../../.claude/skills/) |
| Adopter copy pack | [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) |

## Related Documents

- [ai-context.md](ai-context.md)
- [ai-prompt-context.md](ai-prompt-context.md)
- [ai-documentation-workflow.md](ai-documentation-workflow.md)
- [source-of-truth.md](source-of-truth.md)
- [adoption-path.md](adoption-path.md)
- [templates/agents-entry.md](templates/agents-entry.md)
- [templates/claude-entry.md](templates/claude-entry.md)
