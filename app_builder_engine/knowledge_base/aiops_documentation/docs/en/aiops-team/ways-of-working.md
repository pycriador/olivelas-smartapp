---
id: REF-OLIVELAS-TEAM-007
title: "Olivelas — Ways of working"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Ways of working

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/ways-of-working.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Rituals, delivery flows, and practices of the Olivelas team.

## Development

| Practice | Detail | Classification |
| --- | --- | --- |
| Code review | Required before merge — Olivelas continuous improvement principle | **Inferred** (org default) |
| Code language | English in code, commits, and APIs | **Confirmed** (Olivelas language standards) |
| End-user UI | Brazilian Portuguese | **Confirmed** |
| Tests | Automated tests required for new code | **Inferred** (org default) |
| Lint/format | Follow project tools (`ruff`, ESLint, etc.) | **Confirmed** |

## Deploy

Typical order for a new Olivelas service: workflows → Dockerfiles → k8s-apps → Kong → DNS → Vault → Datadog → validation.

Checklist: [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md).

Workflow reference: [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge) (`.github/workflows/`).

## Documentation

| When | Action |
| --- | --- |
| Product change | Update level 2 (`aiops-apps/{app}.md`) and level 3 (repo README) |
| Cross-cutting change | Update `aiops-team/` or matrices in `aiops-apps/` |
| Confluence publish | Scoped `docs-sync` — see [documentation-model.md](documentation-model.md) |

Post-change skill: [document-after-change](../../../.cursor/skills/document-after-change/SKILL.md).

## Rituals

| Ritual | Frequency | **Unknown** |
| --- | --- | --- |
| Daily | — | To fill |
| Planning | — | To fill |
| Retro | — | To fill |
| On-call | — | To fill |

## Related

- [technical-standards.md](technical-standards.md)
- [../loft-infra/publish-guide.md](../loft-infra/publish-guide.md)
