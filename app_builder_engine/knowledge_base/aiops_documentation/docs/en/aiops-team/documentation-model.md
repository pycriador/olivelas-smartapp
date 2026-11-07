---
id: REF-AIOPS-TEAM-002
title: "AIOps documentation model — 3 levels"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# AIOps documentation model — 3 levels

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/documentation-model.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Defines where each type of AIOps knowledge is written and how to publish to Confluence via `docs-sync`.

## Levels

### Level 1 — AIOps / Team

**Location:** `docs/{lang}/aiops-team/`

Cross-squad content: identity, responsibilities, product catalog, working standards, aggregated security and observability, common troubleshooting.

**Rule:** prefer **pointers** to technical detail; do not duplicate stack matrices that already live in `aiops-apps/`.

### Level 2 — Application / Solution

**Location:** `docs/{lang}/aiops-apps/{app}.md`

One page per product with: goal, context, users, impact, summarized architecture, integrations, and **blob links** to technical docs in the app repo.

**Publish:** two Confluence profiles when applicable — tree under [Documentação Inicial](https://loftbr.atlassian.net/wiki/spaces/AIOps/folder/6086460456) and [AIOps - Stack](https://loftbr.atlassian.net/wiki/spaces/AIOps/pages/6091309071) pack.

### Level 3 — Repository / README

**Location:** each app GitHub repository (`README.md`, `backend/README.md`, `docs/`).

Minimum section contract: how to run, structure, dependencies, configuration, APIs, schemas, tests, implementation, app-specific troubleshooting.

**Rule:** Markdown in the app repo is SoT for level 3; this repository only **links** via `blob` URLs ([publishing-surfaces.md](../publishing-surfaces.md)).

## AI update flow

1. Agent reads [`hub-registry.yaml`](../../../docs-sync/aiops-config/hub-registry.yaml).
2. Levels 1–2: edit `.md` here with code evidence; `make docs-validate`; scoped `docs-sync`.
3. Level 3: PR in the app repo; update blob links at level 2.
4. Publish to Confluence only with explicit operator intent.

Skill: [`.cursor/skills/sync-aiops-hub/SKILL.md`](../../../.cursor/skills/sync-aiops-hub/SKILL.md).

## Publishing surfaces

| Surface | Role |
| --- | --- |
| GitHub / local checkout | Source of truth (Markdown) |
| Confluence AIOps | Published view (`docs-sync`, one-way) |

Full policy: [publishing-surfaces.md](../publishing-surfaces.md).
