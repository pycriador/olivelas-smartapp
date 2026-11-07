---
id: REF-AIOPS-TEAM-007
title: "AIOps — Forma de trabalho"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Forma de trabalho

> Language: pt-BR | [English (EN)](../../en/aiops-team/ways-of-working.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Rituais, fluxos de entrega e práticas do time AIOps.

## Desenvolvimento

| Prática | Detalhe | Classificação |
| --- | --- | --- |
| Code review | Obrigatório antes de merge — princípio Loft de melhoria contínua | **Inferred** (padrão org) |
| Idioma no código | Inglês em código, commits e APIs | **Confirmed** (Loft language standards) |
| UI end-user | Português brasileiro | **Confirmed** |
| Testes | Automatizados exigidos para código novo | **Inferred** (padrão org) |
| Lint/format | Seguir ferramentas do projeto (`ruff`, ESLint, etc.) | **Confirmed** |

## Deploy

Ordem típica para novo serviço AIOps: workflows → Dockerfiles → k8s-apps → Kong → DNS → Vault → Datadog → validação.

Checklist: [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md).

Referência de workflows: [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge) (`.github/workflows/`).

## Documentação

| Momento | Ação |
| --- | --- |
| Mudança de produto | Atualizar nível 2 (`aiops-apps/{app}.md`) e nível 3 (README do repo) |
| Mudança transversal | Atualizar `aiops-team/` ou matrizes em `aiops-apps/` |
| Publicação Confluence | `docs-sync` scoped — ver [documentation-model.md](documentation-model.md) |

Skill pós-mudança: [document-after-change](../../../.cursor/skills/document-after-change/SKILL.md).

## Rituais

| Ritual | Frequência | **Unknown** |
| --- | --- | --- |
| Daily | — | Preencher |
| Planning | — | Preencher |
| Retro | — | Preencher |
| On-call | — | Preencher |

## Relacionados

- [technical-standards.md](technical-standards.md)
- [../loft-infra/publish-guide.md](../loft-infra/publish-guide.md)
