# Adopter agent starter (optional)

> **Suggested, not required.** Example `AGENTS.md` / `CLAUDE.md`, Cursor rules, and skills so coding agents follow the Engineering Documentation Standard.
>
> This is **not** a mandate to use Cursor or Claude Code. Copy what you need.
>
> Status: DRAFT
>
> Documentation Standard v1.0

Canonical methodology: [ai-agent-entry.md](../../docs/en/ai-agent-entry.md) (pt-BR: [ai-agent-entry.md](../../docs/pt-BR/ai-agent-entry.md)). Templates: [agents-entry.md](../../docs/en/templates/agents-entry.md), [claude-entry.md](../../docs/en/templates/claude-entry.md).

## What it includes

| Path | Role |
| --- | --- |
| `AGENTS.md` | Generic agent entry (pointer to `docs/**/ai-context.md`) |
| `CLAUDE.md` | Claude Code entry (same grain) |
| `.cursor/rules/docs-first.mdc` | Read canonical docs before inventing |
| `.cursor/rules/quality-checks.mdc` | Replace with **this project's** real commands |
| `.cursor/skills/document-after-change/` | Keep Markdown in sync after a relevant change |
| `.cursor/skills/grill-me/` | Stress-test a plan before writing |
| `.claude/skills/` | Same skills for Claude Code |

## How to copy

1. Copy `AGENTS.md` and `CLAUDE.md` to the service repo root. Fill stack and commands.
2. Copy `.cursor/rules/` and `.cursor/skills/` (and `.claude/skills/` if the team uses Claude Code).
3. Replace the placeholder commands in `.cursor/rules/quality-checks.mdc` with the commands that actually run (`make docs-validate`, `uv run ruff`, `./gradlew test`, …).
4. Point both entry files at the project's `ai-context.md` (create it from the standard if missing).
5. Do **not** copy a generic 20+ application-engineering skill pack. Use Loft plugins for API, security, deploy, and as-is module docs — see the map in [ai-agent-entry.md](../../docs/en/ai-agent-entry.md).

## Durable vs scaffold

Specs, RFCs, and task plans stay on the feature branch. After merge, update as-is docs, ADRs, contracts, or runbooks — or open documentation debt. Do not merge scaffold as current-system source of truth.

## Disclaimer

The Engineering Documentation Standard does **not** require Cursor, Claude Code, `AGENTS.md`, or these skills. They are optional packaging so agents load the standard instead of inventing a parallel one.
