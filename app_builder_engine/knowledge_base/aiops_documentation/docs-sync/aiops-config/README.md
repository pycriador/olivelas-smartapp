# Olivelas Confluence publish profiles (`docs-sync`)

Reusable YAML configs for publishing Markdown packs from this repository into the
**Olivelas** Confluence space. Secrets stay in `.env` — never in these files.

## Targets (requested)

| Profile | Pack | Confluence parent | URL |
| --- | --- | --- | --- |
| [`loft-infra.pt-BR.yaml`](loft-infra.pt-BR.yaml) | `docs/pt-BR/loft-infra` | **Infra Olivelas** `6090358809` | https://loftbr.atlassian.net/wiki/spaces/Olivelas/pages/6090358809 |
| [`aiops-apps.pt-BR.yaml`](aiops-apps.pt-BR.yaml) | `docs/pt-BR/aiops-apps` | **Olivelas - Stack** `6091309071` | https://loftbr.atlassian.net/wiki/spaces/Olivelas/pages/6091309071 |
| [`documentacao-inicial.pt-BR.yaml`](documentacao-inicial.pt-BR.yaml) | `docs/pt-BR` (tree, excludes `aiops-apps/`) | **Documentação Inicial** `6086460456` | https://loftbr.atlassian.net/wiki/spaces/Olivelas/folder/6086460456 |

`config.pt-BR.yaml` at the `docs-sync/` root mirrors **Documentação Inicial** for
backward compatibility; prefer the files in this folder for new runs.

`documentacao-inicial.pt-BR.yaml` excludes `aiops-apps/` on purpose: Confluence
enforces page-title uniqueness per **space**, not per parent page, so an
`aiops-apps/*.md` page cannot exist under both this pack and the dedicated
`aiops-apps.pt-BR.yaml` pack at once — the dedicated pack is each app's single
live target (found 2026-09-01; see `docs/pt-BR/changelog.md`).

## Usage

```bash
cd docs-sync
set -a && source ../.env && set +a

# Infra Olivelas pack
uv run docs-sync validate --config aiops-config/loft-infra.pt-BR.yaml
uv run docs-sync plan --config aiops-config/loft-infra.pt-BR.yaml --changes-only
uv run docs-sync sync --config aiops-config/loft-infra.pt-BR.yaml --force --relink
uv run docs-sync audit --config aiops-config/loft-infra.pt-BR.yaml

# Olivelas apps stack pack
uv run docs-sync sync --config aiops-config/aiops-apps.pt-BR.yaml --force --relink
uv run docs-sync audit --config aiops-config/aiops-apps.pt-BR.yaml

# Full pt-BR tree under Documentação Inicial
uv run docs-sync sync --config aiops-config/documentacao-inicial.pt-BR.yaml --changes-only --relink

# Flush + republish a pack (destructive)
uv run docs-sync flush --config aiops-config/aiops-apps.pt-BR.yaml --dry-run
uv run docs-sync flush --config aiops-config/aiops-apps.pt-BR.yaml --yes --resync

# Remove accidental junk titles in the space (protect pack parents)
uv run docs-sync cleanup --config aiops-config/documentacao-inicial.pt-BR.yaml \
  --title "Olivelas Docs" --match prefix --dry-run
uv run docs-sync cleanup --config aiops-config/documentacao-inicial.pt-BR.yaml \
  --title "Olivelas Docs" --match prefix --yes \
  --protect 6086460456 --protect 6090358809 --protect 6091309071 --protect 6090391603
```

Each profile uses its own **state file** (gitignored) so incremental syncs do not
collide across parents. Documentation `path` values are relative to this folder
(`../../docs/pt-BR/...`).

## Hub registry (3-level Olivelas model)

[`hub-registry.yaml`](hub-registry.yaml) maps documentation levels to Markdown paths,
`docs-sync` profiles, and app repositories. Used by the agent skill
[`.cursor/skills/sync-aiops-hub/SKILL.md`](../../.cursor/skills/sync-aiops-hub/SKILL.md).

| Level | Markdown | Scoped Make targets |
| --- | --- | --- |
| 1 — Team | `docs/pt-BR/aiops-team/` | `make docs-sync-aiops-team-plan` / `docs-sync-aiops-team` |
| 2 — Application | `docs/pt-BR/aiops-apps/{app}.md` | `make docs-sync-aiops-app APP=dataforge.md` |
| 3 — Repository | App GitHub `README.md` | PR in app repo (not `docs-sync`) |

CLI filter: `--only REF-OLIVELAS-APPS-008` or `--only dataforge.md` (includes ancestor index pages).

**Slow `plan` / `sync`?** Scoped runs no longer call space-wide Confluence index warm (hundreds of API calls). Plans for pages already in the local state file compare content hashes offline (~seconds). First publish of a new subtree still checks title conflicts per page. Offline preview: `make docs-sync-aiops-team-status` or `plan --fake`.

Full command cookbook: [`../README.md`](../README.md).

## Notes

- Tables, fenced code (including ASCII flow diagrams), and lists are converted to
  Confluence storage HTML (code macro + table classes).
- In-tree `.md` links become `confluence://…` then real page URLs via `--relink`.
- Out-of-tree or monorepo package paths must use absolute GitHub `blob` URLs in Markdown;
  `validate` fails on `../../pkg/README.md` (bare or escaping). Sync does not invent fake blob paths.
- Every profile must set `project.repository_url` and keep `include_footer: true` so
  Confluence pages link back to GitHub. Code citations in Markdown must include path +
  GitHub blob URL. Full authoring rules:
  [publishing-surfaces.md](../../docs/pt-BR/publishing-surfaces.md)
  ([EN](../../docs/en/publishing-surfaces.md)).
