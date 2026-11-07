# docs-sync

Publish the Engineering Documentation Standard Markdown tree from this repository to Confluence.

**GitHub / local checkout is the source of truth.** Confluence is the published view (one-way sync).

```text
Markdown (docs/)  →  validate  →  plan  →  sync  →  Confluence pages (HTML storage)
```

## Prerequisites

- Python 3.12+
- [uv](https://astral.sh/uv)
- Confluence Cloud credentials in a gitignored `.env` (repo root or `docs-sync/`)

```bash
cd docs-sync
uv sync --extra dev
cp .env.example ../.env   # fill CONFLUENCE_* values — never commit .env
```

| Variable | Meaning |
| --- | --- |
| `CONFLUENCE_URL` | Base URL (e.g. `https://loftbr.atlassian.net`) |
| `CONFLUENCE_SPACE` | Space key (e.g. `AIOps`) |
| `CONFLUENCE_USERNAME` | Atlassian account email |
| `CONFLUENCE_API_TOKEN` | API token |
| `CONFLUENCE_ROOT_PAGE_ID` | Optional default parent **page or folder** id |

Load credentials once per shell:

```bash
cd docs-sync
set -a && source ../.env && set +a
```

---

## Command cheat sheet

| Command | Needs Confluence? | Destructive? | Purpose |
| --- | --- | --- | --- |
| `validate` | No | No | Validate local Markdown tree |
| `status` | No | No | Local changes vs last sync state |
| `plan` | Yes* | No | Authoritative CREATE/UPDATE plan |
| `sync` | Yes* | Writes | Create/update managed pages |
| `report` | Yes* | No | Alias of `sync --dry-run` |
| `audit` | Yes | No | Blank bodies / broken `confluence://` links |
| `flush` | Yes | Yes | Delete managed pages under `root_page_id` |
| `cleanup` | Yes | Yes | Trash pages/folders by title match |

\* Use `--fake` (or dry-run without credentials) for offline demos.

Common flags (most commands):

| Flag | Effect |
| --- | --- |
| `--config PATH` | YAML profile |
| `--docs PATH` | Docs folder(s) (repeatable) |
| `--include GLOB` | Only paths matching glob (repeatable) |
| `--only ID_OR_PATH` | Sync only matching docs by `stable_id`, path, or glob — includes ancestor index pages (repeatable) |
| `--root-page-id ID` | Parent page **or folder** id |
| `--space KEY` | Override space |
| `--json` | Machine-readable output |
| `--verbose` | Debug logs (secrets never logged) |
| `--fake` | In-memory Confluence client |

---

## 1. `validate` — check the Markdown tree

```bash
# Full tree from config
uv run docs-sync validate --config config.pt-BR.yaml

# Subset
uv run docs-sync validate --config config.pt-BR.yaml \
  --docs ../docs/pt-BR/loft-infra

# AIOps apps pack
uv run docs-sync validate --config aiops-config/aiops-apps.pt-BR.yaml
```

Fails on duplicate IDs, missing titles, and hierarchy problems. Always run before a real `sync`.

---

## 2. `status` — what changed locally (offline)

Uses the gitignored state file (e.g. `.docs-sync-state.pt-BR.json`). No Confluence call.

```bash
# NEW / CHANGED / REMOVED since last successful sync
uv run docs-sync status --config config.pt-BR.yaml

# Also list Markdown touched in git since a ref
uv run docs-sync status --config config.pt-BR.yaml --since origin/main
uv run docs-sync status --config config.pt-BR.yaml --since HEAD~5

# Include UNCHANGED rows
uv run docs-sync status --config config.pt-BR.yaml --all

# JSON
uv run docs-sync status --config config.pt-BR.yaml --json
```

---

## 3. `plan` — compare against live Confluence

```bash
# Full plan
uv run docs-sync plan --config config.pt-BR.yaml

# Only pending actions
uv run docs-sync plan --config config.pt-BR.yaml --changes-only

# Treat every managed page as UPDATE (ignore content_hash)
uv run docs-sync plan --config config.pt-BR.yaml --force --changes-only

# Offline / CI without credentials
uv run docs-sync plan --config config.pt-BR.yaml --fake

# JSON
uv run docs-sync plan --config config.pt-BR.yaml --changes-only --json
```

---

## 4. `sync` — publish to Confluence

```bash
# Full publish (create + update + default --relink)
uv run docs-sync sync --config config.pt-BR.yaml

# Preview only (no writes)
uv run docs-sync sync --config config.pt-BR.yaml --dry-run

# Only pending CREATE/UPDATE in the printed plan
uv run docs-sync sync --config config.pt-BR.yaml --changes-only

# Force rewrite all managed pages + resolve internal links
uv run docs-sync sync --config config.pt-BR.yaml --force --relink

# Skip post-sync link resolution
uv run docs-sync sync --config config.pt-BR.yaml --no-relink

# Publish only selected folders
uv run docs-sync sync --config config.pt-BR.yaml \
  --docs ../docs/pt-BR/architecture \
  --docs ../docs/pt-BR/runbooks \
  --root-page-id 6086460456

# Glob filter (relative to each --docs root)
uv run docs-sync sync --config config.pt-BR.yaml \
  --docs ../docs/pt-BR \
  --include 'security/**' \
  --include 'loft-infra/**'

# Reusable profiles (see aiops-config/)
uv run docs-sync sync --config aiops-config/loft-infra.pt-BR.yaml --force --relink
uv run docs-sync sync --config aiops-config/aiops-apps.pt-BR.yaml --force --relink
uv run docs-sync sync --config aiops-config/documentacao-inicial.pt-BR.yaml --changes-only
```

After `git pull` or local Markdown edits, run the same `sync` again:

- unchanged docs → `UNCHANGED`
- edited docs → `UPDATE`
- new docs → `CREATE`

---

## 5. `report` — dry-run sync report

```bash
uv run docs-sync report --config config.pt-BR.yaml
uv run docs-sync report --config config.pt-BR.yaml --changes-only --json
```

Equivalent to `sync --dry-run` (plan + report, no Confluence writes when credentials allow a real plan).

---

## 6. `audit` — find blank pages and broken links

Blank bodies and leftover `confluence://…` placeholders usually mean the first
publish created pages before page ids were known for internal links.

```bash
# Default threshold: bodies with fewer than 40 visible characters
uv run docs-sync audit --config config.pt-BR.yaml

# Stricter blank detection
uv run docs-sync audit --config config.pt-BR.yaml --min-chars 80

# Against a pack profile
uv run docs-sync audit --config aiops-config/loft-infra.pt-BR.yaml

# JSON
uv run docs-sync audit --config config.pt-BR.yaml --json
```

Repair options after audit:

```bash
# In place: rewrite all managed pages + resolve links
uv run docs-sync sync --config config.pt-BR.yaml --force --relink

# Or flush managed pages under the folder, then republish
uv run docs-sync flush --config config.pt-BR.yaml --dry-run
uv run docs-sync flush --config config.pt-BR.yaml --yes --resync
```

---

## 7. `flush` — delete managed pages under the parent folder

Removes **docs-sync managed** pages under `root_page_id` (and clears the local
state file). The parent folder itself is kept. Requires `--yes` (or `--dry-run`).

```bash
# Preview
uv run docs-sync flush --config config.pt-BR.yaml --dry-run

# Delete managed pages + clear state
uv run docs-sync flush --config config.pt-BR.yaml --yes

# Delete, then full force sync + relink
uv run docs-sync flush --config config.pt-BR.yaml --yes --resync

# Soft-archive (label) instead of trash
uv run docs-sync flush --config config.pt-BR.yaml --yes --archive-only

# Pack-specific flush
uv run docs-sync flush --config aiops-config/aiops-apps.pt-BR.yaml --dry-run
uv run docs-sync flush --config aiops-config/aiops-apps.pt-BR.yaml --yes --resync

# JSON
uv run docs-sync flush --config config.pt-BR.yaml --dry-run --json
```

---

## 8. `cleanup` — trash junk by title (accidental dumps)

Use when Confluence has leftover pages/folders from bad syncs (e.g. titles like
`AIOps Docs · docs › pt-BR › …`). Matches by title, deletes deepest-first, and
never walks non-matching branches (so Documentação Inicial stays untouched).

Requires `--yes` (or `--dry-run`). `root_page_id` from config is always protected;
add more ids with `--protect`.

```bash
# Preview everything whose title starts with "AIOps Docs"
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match prefix --dry-run

# Exact folder/page title
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match exact --dry-run

# Substring match
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "docs › en ›" --match contains --dry-run

# Execute (protect legitimate folders)
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match prefix --yes \
  --protect 6086460456 \
  --protect 6090391603 \
  --protect 6090358809 \
  --protect 6091309071

# Only walk under a specific parent
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match prefix \
  --from-parent 6085771665 --dry-run

# Pages only (skip folders)
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match prefix --pages-only --dry-run

# Slower deletes to reduce HTTP 429
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match prefix --yes --pause 0.5

# JSON
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match prefix --dry-run --json
```

| Flag | Effect |
| --- | --- |
| `--title` | Needle to match (required) |
| `--match` | `prefix` (default) / `exact` / `contains` |
| `--from-parent` | Walk only this parent (default: space homepage) |
| `--protect` | Never delete this id (repeatable) |
| `--pages-only` | Skip folders |
| `--pause` | Seconds between deletes (default `0.2`) |
| `--dry-run` / `--yes` | Preview or confirm |

---

## Recommended workflows

### Day-to-day publish

```bash
cd docs-sync && set -a && source ../.env && set +a

uv run docs-sync status --config config.pt-BR.yaml
uv run docs-sync plan --config config.pt-BR.yaml --changes-only
uv run docs-sync sync --config config.pt-BR.yaml --changes-only
uv run docs-sync audit --config config.pt-BR.yaml
```

### Publish a pack (Infra / Apps)

```bash
uv run docs-sync sync --config aiops-config/loft-infra.pt-BR.yaml --force --relink
uv run docs-sync sync --config aiops-config/aiops-apps.pt-BR.yaml --force --relink
uv run docs-sync audit --config aiops-config/loft-infra.pt-BR.yaml
```

### Repair blank pages / broken links

```bash
uv run docs-sync audit --config config.pt-BR.yaml
uv run docs-sync sync --config config.pt-BR.yaml --force --relink
# or: flush --yes --resync
```

### Remove accidental junk titles

```bash
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match prefix --dry-run
uv run docs-sync cleanup --config config.pt-BR.yaml \
  --title "AIOps Docs" --match prefix --yes \
  --protect 6086460456 --protect 6090391603
```

---

## Configuration profiles

| File | Purpose |
| --- | --- |
| [`aiops-config/`](aiops-config/) | **Reusable publish profiles** (Infra Loft, AIOps Stack, Documentação Inicial) |
| [`config.pt-BR.yaml`](config.pt-BR.yaml) | Alias for Documentação Inicial (`6086460456`) |
| [`config.example.yaml`](config.example.yaml) | Generic template (copy to `docs-sync.yaml`) |
| [`.env.example`](.env.example) | Env var names only |

| Profile | Pack | Parent id |
| --- | --- | --- |
| `aiops-config/loft-infra.pt-BR.yaml` | `docs/pt-BR/loft-infra` | `6090358809` Infra Loft |
| `aiops-config/aiops-apps.pt-BR.yaml` | `docs/pt-BR/aiops-apps` | `6091309071` AIOps - Stack |
| `aiops-config/documentacao-inicial.pt-BR.yaml` | `docs/pt-BR` | `6086460456` Documentação Inicial |

See [`aiops-config/README.md`](aiops-config/README.md) for URLs and notes.

---

## Makefile shortcuts (repo root)

```bash
make docs-sync-validate          # validate
make docs-sync-plan              # plan --fake
make docs-sync-pt-br-status      # offline status
make docs-sync-pt-br-plan        # plan --changes-only
make docs-sync-pt-br-dry         # sync --dry-run
make docs-sync-pt-br             # real sync
make docs-sync-pt-br-audit       # audit
make docs-sync-pt-br-repair      # sync --force --relink
make docs-sync-pt-br-cleanup-dry # cleanup preview (AIOps Docs prefix)
```

Override config: `make docs-sync-validate DOCS_SYNC_CONFIG=aiops-config/loft-infra.pt-BR.yaml`

---

## How sync works

```text
Load config → Load Markdown → Validate → Build plan → Execute → Report
```

- Critical validation errors **abort** before any write.
- Managed pages store a Confluence content property `docs-sync` with `stable_id`, `content_hash`, `source_path`, `managed_by`.
- Matching is by **stable_id** (frontmatter `id`, or `path:<relative>`), not by title alone.
- Duplicate titles in the tree are disambiguated automatically (Confluence requires unique titles in a space).
- A local state file (gitignored), e.g. `.docs-sync-state.pt-BR.json`, caches `stable_id → page_id` for faster re-syncs.

### Dual-surface links (required)

Authoring and sync must keep **both** Confluence and GitHub navigable. Policy: [docs/en/publishing-surfaces.md](../docs/en/publishing-surfaces.md) (pt-BR: [docs/pt-BR/publishing-surfaces.md](../docs/pt-BR/publishing-surfaces.md)).

| Requirement | How |
| --- | --- |
| Confluence ↔ Confluence | Relative `.md` links **in-tree only**; `sync --relink` resolves `confluence://` to page URLs |
| Confluence → GitHub source | `project.repository_url` + `include_footer: true` (footer uses `blob/main/…`) |
| Other repos / monorepo packages | Absolute GitHub `blob` URLs — **never** `../../backend/README.md` |
| Broken / escaping relatives | `docs-sync validate` **errors** and aborts before write; no invented `docs/{lang}/…` URLs |
| Bare `../../pkg/README.md` prose | Forbidden — `DOC-LINK-003` / validate error |

Cross-pack targets outside the sync tree must use a real GitHub `blob` URL (or be included in the pack). Sync does **not** invent blob paths for missing files.

## Safety

- Secrets only from environment / `${VAR}` expansion — never committed, never logged
- No automatic page deletion on sync (`archive_removed: false` by default)
- `flush` / `cleanup` require `--yes` (or `--dry-run`)
- Only managed pages are updated by `sync` / `flush`
- One-way only (no Confluence → GitHub)

## Architecture

| Component | Responsibility |
| --- | --- |
| `repository` | Load docs from local checkout |
| `parser` | Frontmatter, titles, Markdown → HTML storage |
| `validation` | IDs, titles, hierarchy |
| `mapper` | Document → Confluence page mapping |
| `confluence` | Cloud API client (+ `FakeConfluenceClient`) |
| `sync` | Plan + execute create/update/unchanged |
| `audit` | Blank bodies / unresolved links |
| `cleanup` | Title-based trash of junk pages/folders |
| `state` | Local identity cache for incremental sync |
| `cli` | `validate` / `status` / `plan` / `sync` / `report` / `audit` / `flush` / `cleanup` |

## Tests

```bash
cd docs-sync
uv sync --extra dev
uv run pytest -q
```

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `Sync aborted` | Fix validation errors (duplicate IDs, missing titles) |
| Conflicting unmanaged page | Rename/move the Confluence page or review manually |
| Blank pages / `confluence://` | `audit` then `sync --force --relink` (or `flush --yes --resync`) |
| Junk titles from old syncs | `cleanup --title … --dry-run` then `--yes` |
| HTTP 429 on cleanup | Increase `--pause` (e.g. `0.5`) |
| SSL / certificate errors | Corporate proxy: dependency `truststore` uses the OS trust store |
| Auth failures | Verify `CONFLUENCE_*` in `.env`; do not print tokens |
| Wrong tree | `--docs` / `documentation.path` → `docs/pt-BR` or `docs/en` |
| Sync hangs on warm index | Prefer pack profiles + local state; avoid full-space label crawl when possible |

## Limitations (v0.1)

- One-way sync only
- Clone/checkout locally (no GitHub Contents API provider yet)
- Image attachment upload is best-effort
- Orphan archive on sync is not fully automated (`cleanup` / `flush` cover manual recovery)
