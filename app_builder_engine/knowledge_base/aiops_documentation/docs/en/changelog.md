---
title: "Documentation changelog"
status: "DRAFT"
owner: "documentation-standard"
created: "2026-08-13"
updated: "2026-08-24"
version: "1.0"
id: "REF-CHANGELOG-001"
type: "Reference"
---

# Documentation changelog

> Language: EN | [Português (pt-BR)](../pt-BR/changelog.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Canonical changelog for this Documentation Standard. Policy: [changelog-policy.md](changelog-policy.md).

## 2026-09-01

- Summary: Published the humanized-guides pilot (team hub + DataForge) and filled the **Olivelas - Stack** pack gap, which was missing DataForge/Deep Insight/Olivelas Carteiras/Qualidade. Discovered and fixed along the way: Confluence enforces **page-title uniqueness per space**, not per parent page, so a page cannot exist under both "Documentação Inicial" and "Olivelas - Stack" with the same title. The 5 affected pages were moved to their correct parent; `documentacao-inicial.pt-BR.yaml` now excludes `aiops-apps/` (`exclude_globs`); `hub-registry.yaml`, `Makefile` (`docs-sync-aiops-app*`), and `docs-sync/aiops-config/README.md` updated so app pages are no longer targeted at both packs.
- Resources:
  - `docs-sync/aiops-config/documentacao-inicial.pt-BR.yaml` (`exclude_globs`)
  - `docs-sync/aiops-config/hub-registry.yaml` (`application.sync_profiles`, `agent_workflow.sync_app`)
  - `docs-sync/aiops-config/README.md`
  - `Makefile` (`docs-sync-aiops-app-plan`, `docs-sync-aiops-app`)
- Impact: Olivelas - Stack pack complete (12 pages); future app publishes no longer attempt a duplicate title and fail with a Confluence 400
- See: `docs-sync/aiops-config/hub-registry.yaml`

## 2026-08-31

- Summary: Pilot of **plain-language guides** for the Olivelas hub — sibling pages, in the same folder as the technical page, for non-technical Confluence readers (team hub and DataForge app). One-line hatnotes on technical pages point to the guide; guides link back to the specification. Guides are not part of `ai-context.md`'s required reading chain, keeping AI agent token usage unaffected. Tracked in `hub-registry.yaml` (`human_guide`).
- Resources:
  - [aiops-team/README-guide.md](aiops-team/README-guide.md)
  - [aiops-apps/dataforge-guide.md](aiops-apps/dataforge-guide.md)
  - `docs-sync/aiops-config/hub-registry.yaml` (`human_guides`)
- Impact: non-technical readers of the Olivelas Confluence space (business, new joiners, support); no change to the technical source of truth
- See: [aiops-team/README-guide.md](aiops-team/README-guide.md)

## 2026-08-24

- Summary: **Olivelas 3-level hub** — `aiops-team/` folder (level 1), per-app pages in `aiops-apps/` (level 2), `hub-registry.yaml`, `sync-aiops-hub` skill, CLI `--only` flag, scoped Make targets, DataForge level-3 pilot.
- Resources:
  - [aiops-team/README.md](aiops-team/README.md)
  - [aiops-team/documentation-model.md](aiops-team/documentation-model.md)
  - [aiops-apps/dataforge.md](aiops-apps/dataforge.md)
  - `docs-sync/aiops-config/hub-registry.yaml`
  - `.cursor/skills/sync-aiops-hub/SKILL.md`
- Impact: on-demand Confluence publish (6086460456) via agent; coexists with framework methodology

- Summary: **loft-infra** pack enriched with a full publish guide (`publish-guide.md`) and `examples/` templates (workflows, Docker, k8s-apps, Kong, DNS, Vault/CORS), seeded from the `aiops-central` runbook. Existing as-is topic docs kept and updated with links/warnings (corp vs external, auto DNS, JumpCloud, CORS). Manifests and indexes updated.
- Resources:
  - [loft-infra/publish-guide.md](loft-infra/publish-guide.md)
  - [loft-infra/examples/README.md](loft-infra/examples/README.md)
  - [loft-infra/README.md](loft-infra/README.md)
  - [loft-infra/checklist-novo-servico.md](loft-infra/checklist-novo-servico.md)
- Impact: Olivelas teams publishing new apps on the Cross Prod model
- See: [loft-infra/publish-guide.md](loft-infra/publish-guide.md)

## 2026-08-19

- Summary: New **Olivelas as-is** pack `loft-observability/` (EN + pt-BR): Datadog on EKS (`web-server` chart), structured JSON logs, application APM recipes, operator usage guide, post-deploy verification, and **logs in Datadog** as a Olivelas documentation prerequisite. Integrated with `loft-infra` checklist, `observability-platform-notes` (pointer only), docs index, manifest, area map, and `docs-sync` loft-infra profile (second root path).
- Resources:
  - [loft-observability/README.md](loft-observability/README.md)
  - [loft-observability/documentation-prerequisites.md](loft-observability/documentation-prerequisites.md)
  - [loft-infra/checklist-novo-servico.md](loft-infra/checklist-novo-servico.md)
  - [observability-platform-notes.md](observability-platform-notes.md)
  - [docs-sync/aiops-config/loft-infra.pt-BR.yaml](../../docs-sync/aiops-config/loft-infra.pt-BR.yaml)
- Impact: Olivelas EKS service authors, operators, and Olivelas documentation consumers
- See: [loft-observability/README.md](loft-observability/README.md)

## 2026-08-17

- Summary: Dual-surface linking policy plus **hard link correctness** for Confluence/GitHub publish: ban bare/escaping `../../pkg/README.md` monorepo paths; `docs-sync validate` and `DOC-LINK-003` abort on broken relatives; sync no longer invents fake `blob` URLs for missing files.
- Resources:
  - [publishing-surfaces.md](publishing-surfaces.md)
  - [standards.md](standards.md) (References and Links)
  - [evidence-references.md](evidence-references.md)
  - [source-of-truth.md](source-of-truth.md)
  - [validation-rules.md](validation-rules.md) (`DOC-LINK-003`)
  - [docs-sync/README.md](../../docs-sync/README.md) (footer blob URLs + link validation)
- Impact: authors and agents writing or syncing Markdown to Confluence
- See: [publishing-surfaces.md](publishing-surfaces.md)

## 2026-08-13

- Summary: Recommended optional agent entry files (`AGENTS.md`, `CLAUDE.md`) and an adopter starter so Cursor / Claude Code load this standard instead of a generic skill pack. Recorded that execution scaffold (spec/RFC/task plan) is not current-system source of truth after merge.
- Resources:
  - [ai-agent-entry.md](ai-agent-entry.md)
  - [templates/agents-entry.md](templates/agents-entry.md), [templates/claude-entry.md](templates/claude-entry.md)
  - [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/)
  - Root `AGENTS.md`, `CLAUDE.md`
  - `.cursor/rules/docs-quality-checks.mdc`, skills `document-after-change` and `grill-me` (Cursor + `.claude/` mirror)
- Impact: authors and adopting squads who use coding agents
- See: [source-of-truth.md](source-of-truth.md), [ai-documentation-workflow.md](ai-documentation-workflow.md), [adoption-path.md](adoption-path.md), [documentation-debt.md](documentation-debt.md) `DOC-015`
