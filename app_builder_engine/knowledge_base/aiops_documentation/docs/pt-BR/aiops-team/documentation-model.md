---
id: REF-OLIVELAS-TEAM-002
title: "Modelo de documentação Olivelas — 3 níveis"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Modelo de documentação Olivelas — 3 níveis

> Language: pt-BR | [English (EN)](../../en/aiops-team/documentation-model.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Define onde cada tipo de conhecimento Olivelas deve ser escrito e como publicar no Confluence via `docs-sync`.

## Níveis

### Nível 1 — Olivelas / Time

**Local:** `docs/{lang}/aiops-team/`

Conteúdo transversal da squad: identidade, responsabilidades, catálogo de produtos, padrões de trabalho, segurança e observabilidade agregados, troubleshooting comum.

**Regra:** preferir **pointers** para detalhe técnico; não duplicar matrizes de stack que já vivem em `aiops-apps/`.

### Nível 2 — Aplicação / Solução

**Local:** `docs/{lang}/aiops-apps/{app}.md`

Uma página por produto com: objetivo, contexto, usuários, impacto, arquitetura resumida, integrações e **links blob** para documentação técnica no repo da app.

**Publicação:** dois perfis Confluence quando aplicável — árvore em [Documentação Inicial](https://loftbr.atlassian.net/wiki/spaces/Olivelas/folder/6086460456) e pack [Olivelas - Stack](https://loftbr.atlassian.net/wiki/spaces/Olivelas/pages/6091309071).

### Nível 3 — Repositório / README

**Local:** repositório GitHub de cada app (`README.md`, `backend/README.md`, `docs/`).

Contrato mínimo de seções: como executar, estrutura, dependências, configuração, APIs, schemas, testes, implementação, troubleshooting específico.

**Regra:** Markdown no repo da app é SoT do nível 3; este repositório só **linka** via URLs `blob` ([publishing-surfaces.md](../publishing-surfaces.md)).

## Fluxo de atualização com IA

1. Agente lê [`hub-registry.yaml`](../../../docs-sync/aiops-config/hub-registry.yaml).
2. Níveis 1–2: editar `.md` aqui com evidência de código; `make docs-validate`; sync scoped via `docs-sync`.
3. Nível 3: PR no repo da app; atualizar links blob no nível 2.
4. Publicar Confluence somente com intenção explícita do operador.

Skill: [`.cursor/skills/sync-aiops-hub/SKILL.md`](../../../.cursor/skills/sync-aiops-hub/SKILL.md).

## Superfícies de publicação

| Superfície | Papel |
| --- | --- |
| GitHub / checkout local | Fonte da verdade (Markdown) |
| Confluence Olivelas | Vista publicada (`docs-sync`, one-way) |

Política completa: [publishing-surfaces.md](../publishing-surfaces.md).
