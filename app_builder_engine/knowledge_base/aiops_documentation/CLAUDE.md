# CLAUDE.md

aiops-documentation — Claude Code entry. Canonical AI context: [docs/en/ai-context.md](docs/en/ai-context.md) (pt-BR: [docs/pt-BR/ai-context.md](docs/pt-BR/ai-context.md)). Packaging: [docs/en/ai-agent-entry.md](docs/en/ai-agent-entry.md).

## Quality checks (required before finishing a task)

```bash
make docs-validate
```

Optional: `make docs-check-links`. Criteria: linter reports no ERROR on governed docs.

## Conventions

- Code identifiers, paths, and status tokens stay in English.
- Human docs are bilingual: edit `docs/en/` and `docs/pt-BR/` together.
- Prefer editing an existing canonical doc over creating a parallel page.
- New methodology pages: `DRAFT` until human review. Editing an `ACCEPTED` substantive doc: set `REVIEW`.
- Never commit secrets.

## Durable knowledge

Execution scaffold (spec, RFC, task plan, sketch) lives on the branch and does not enter `main` as current-system SoT.

What survives the merge:

- Canonical pages under `docs/en/` and `docs/pt-BR/`
- ADRs and templates
- Examples under `examples/`
- Explicit documentation debt

Do not point comments at scaffold files that will be deleted. See [docs/en/source-of-truth.md](docs/en/source-of-truth.md).

## Skills

- `.claude/skills/document-after-change` — keep Markdown in sync after a relevant change
- `.claude/skills/grill-me` — interview the plan until decisions are closed
