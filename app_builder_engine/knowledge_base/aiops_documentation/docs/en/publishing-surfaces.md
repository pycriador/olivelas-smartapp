# Publishing Surfaces (GitHub and Confluence)

> Language: EN | [Português (pt-BR)](../pt-BR/publishing-surfaces.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

How documentation must link when it is read on **GitHub / local checkout** and when it is **published to Confluence** via `docs-sync`.

**GitHub / local Markdown is the source of truth.** Confluence is the published view ([source-of-truth.md](source-of-truth.md)). Both surfaces must remain navigable: Confluence readers need working Confluence page links; GitHub readers need working repo and file links.

## Surfaces

| Surface | Role | How readers navigate |
| --- | --- | --- |
| GitHub / local checkout | Authoritative Markdown | Relative `.md` links inside the tree; absolute GitHub URLs for other repos and for code citations |
| Confluence (via `docs-sync`) | Published view | In-tree links rewritten to Confluence page URLs (`--relink`); GitHub source link in the managed footer; absolute GitHub URLs for external repos and code |

## Mandatory rules (every sync pack)

1. **Declare the documentation repository** in the `docs-sync` profile: `project.repository_url` (e.g. `https://github.com/pycriador/olivelas-smartapp`). Sync with `include_footer: true` (default) so each Confluence page links back to the GitHub source file.
2. **Always run link resolution** on real publishes: `sync` with `--relink` (default). Do not leave `confluence://…` placeholders in published bodies — use `audit` then `sync --force --relink` if needed.
3. **Every link must resolve on both surfaces.** Relative links are allowed only when the target exists **inside the documentation tree / sync pack**. `docs-sync validate` and `make docs-validate` **abort** on broken relatives, tree-escaping paths, and bare `../../…/*.md` prose. Do not invent GitHub URLs for missing files.
4. **Inter-doc links in Markdown stay relative** only within the same published tree (e.g. `[Architecture](architecture/README.md)`). Authors must not hardcode Confluence page URLs for pages managed by `docs-sync`. Cross-pack targets in **this** repo that are outside the sync root must use a GitHub `blob` URL (or expand the sync pack). Files in **another** GitHub repo must use an absolute `blob` URL — never `../../backend/README.md`.
5. **Name every cited GitHub repository once, efficiently** — short `org/repo` link near the top of the section or pack overview, then reuse path + blob links for files. Apply the same naming in EN and pt-BR mirrors.
6. **Code citations require location + GitHub link** — see [Code citations](#code-citations) below.

## Repository identification (efficient form)

When a claim depends on another GitHub repository (or this one as code, not only docs):

| Do | Avoid |
| --- | --- |
| One line: `Repo: [loft-br/kong-configs](https://github.com/loft-br/kong-configs).` | Repeating the full URL in every sentence |
| File cite: path in backticks **and** a `blob` link | Path alone with no way to open the file |
| Same `org/repo` string in EN and pt-BR | Synonym nicknames (`kong repo`, `configs`) without the canonical link |

Example (as-is pack style):

```markdown
Repo: [loft-br/kong-configs](https://github.com/loft-br/kong-configs).

Files: [front route](https://github.com/loft-br/kong-configs/blob/main/gateways/.../aiops-dataforge-front-route.yaml).
```

Default branch for blob URLs is `main` unless the cited repository documents another default — then use that branch name consistently.

## Code citations

When quoting or summarizing a code or config excerpt:

1. State **where** it lives: repository-relative path (and symbol / line range when stable).
2. Provide a **GitHub blob URL** to that path (add `#Lstart-Lend` when the line range is stable and useful).
3. Keep excerpts short; prefer link + path over pasting large blocks.
4. Never paste secrets, tokens, or PII — [ai-context-safety.md](ai-context-safety.md).

| Form | Example |
| --- | --- |
| Path + link | `clusters/cross-prod/applications/aiops-dataforge.yaml` — [blob](https://github.com/loft-br/k8s-apps/blob/main/clusters/cross-prod/applications/aiops-dataforge.yaml) |
| Path + lines | `src/checkout/service.ts` L40–L55 — `…/blob/main/src/checkout/service.ts#L40-L55` |

Evidence tables follow the same rule — [evidence-references.md](evidence-references.md).

## Forbidden: monorepo-relative paths outside this docs tree

Paths that only make sense inside an **application** monorepo must not appear as relative docs links or bare prose when the page lives in this documentation repository (or is published to Confluence).

**Forbidden (broken on Confluence and misleading on GitHub):**

```text
Docs de pacotes relacionados (nível de implementação): ../../knowledge/README.md · ../../backend/README.md · ../../deploy/k8s/README.md · ../../scripts/README.md
```

**Required form** (name the app repo once, then blob links):

```markdown
Repo: [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight).

Related package docs (implementation):
[knowledge/README.md](https://github.com/loft-br/aiops-deep-insight/blob/main/knowledge/README.md) ·
[backend/README.md](https://github.com/loft-br/aiops-deep-insight/blob/main/backend/README.md) ·
[deploy/k8s/README.md](https://github.com/loft-br/aiops-deep-insight/blob/main/deploy/k8s/README.md) ·
[scripts/README.md](https://github.com/loft-br/aiops-deep-insight/blob/main/scripts/README.md).
```

Validation: `DOC-LINK-003` (bare relative paths) and `docs-sync validate` (escaping / missing relatives) block publish.

## Author checklist (local → Confluence)

Before publishing a pack from a local clone:

- [ ] `project.repository_url` set on the sync profile
- [ ] Inter-doc links are relative `.md` **only when the target exists in the sync tree**
- [ ] No bare `../../pkg/README.md` prose; no relatives that escape the docs pack
- [ ] Every external GitHub dependency named with `org/repo` + URL; package READMEs use blob URLs
- [ ] Code/config citations include path + GitHub blob link
- [ ] `make docs-validate` and `docs-sync validate` pass with zero link errors
- [ ] `validate` → `plan`/`status` → `sync` (with relink) → `audit`
- [ ] EN and pt-BR mirrors carry the same repository names and link targets (translated prose only)

Tooling: [docs-sync/README.md](../../docs-sync/README.md), pack profiles under [docs-sync/aiops-config/](../../docs-sync/aiops-config/).

## Olivelas three-level hub

The Olivelas squad uses a dedicated documentation model ([aiops-team/documentation-model.md](aiops-team/documentation-model.md)):

| Level | SoT location | Confluence publish |
| --- | --- | --- |
| 1 — Team | `docs/{lang}/aiops-team/` | `documentacao-inicial.pt-BR.yaml` (parent `6086460456`) |
| 2 — Application | `docs/{lang}/aiops-apps/{app}.md` | Same + optional `aiops-apps.pt-BR.yaml` (`6091309071`) |
| 3 — Repository | App GitHub `README.md` | Not synced — link via blob URLs from level 2 |

Registry and scoped commands: [docs-sync/aiops-config/hub-registry.yaml](../../docs-sync/aiops-config/hub-registry.yaml). Agent skill: [`.cursor/skills/sync-aiops-hub/SKILL.md`](../../.cursor/skills/sync-aiops-hub/SKILL.md).

## Anti-patterns

- Publishing without `repository_url` (Confluence pages with no GitHub source)
- Hardcoding managed Confluence URLs in Markdown SoT (breaks on rename/reparent; bypasses `--relink`)
- Citing another Olivelas repo by informal name only
- Pasting code without path and blob link
- Leaving unresolved `confluence://` hrefs after sync
- Bare or relative `../../knowledge/README.md`-style paths from an app monorepo (dead on Confluence; wrong on this GitHub repo)
- Letting sync invent `blob/main/docs/…` URLs for files that do not exist

## Related Documents

- [source-of-truth.md](source-of-truth.md)
- [standards.md](standards.md) (References and Links)
- [evidence-references.md](evidence-references.md)
- [style-guide.md](style-guide.md)
- [ai-change-rules.md](ai-change-rules.md)
