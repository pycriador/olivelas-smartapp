---
title: "Changelog da documentação"
status: "DRAFT"
owner: "documentation-standard"
created: "2026-08-13"
updated: "2026-08-24"
version: "1.0"
id: "REF-CHANGELOG-001"
type: "Reference"
---

# Changelog da documentação

> Language: pt-BR | [English (EN)](../en/changelog.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Changelog canônico deste Documentation Standard. Política: [changelog-policy.md](changelog-policy.md).

## 2026-09-01

- Summary: Publicado o piloto de guias humanizados (hub do time + DataForge) e preenchida a lacuna do pack **AIOps - Stack**, que faltava DataForge/Deep Insight/Loft Carteiras/Qualidade. Descoberto e corrigido no processo: o Confluence exige **título único por espaço** (não por página-pai), então uma página não pode existir simultaneamente sob "Documentação Inicial" e sob "AIOps - Stack" com o mesmo título. As 5 páginas afetadas foram movidas para o pai correto; `documentacao-inicial.pt-BR.yaml` agora exclui `aiops-apps/` (`exclude_globs`); `hub-registry.yaml`, `Makefile` (`docs-sync-aiops-app*`) e `docs-sync/aiops-config/README.md` atualizados para não tentarem mais publicar apps nos dois pacotes.
- Resources:
  - `docs-sync/aiops-config/documentacao-inicial.pt-BR.yaml` (`exclude_globs`)
  - `docs-sync/aiops-config/hub-registry.yaml` (`application.sync_profiles`, `agent_workflow.sync_app`)
  - `docs-sync/aiops-config/README.md`
  - `Makefile` (`docs-sync-aiops-app-plan`, `docs-sync-aiops-app`)
- Impact: pack AIOps - Stack completo (12 páginas); futuras publicações de apps não tentam mais duplicar título e falhar com erro 400 do Confluence
- See: `docs-sync/aiops-config/hub-registry.yaml`

## 2026-08-31

- Summary: Piloto de **guias em linguagem simples** para o hub AIOps — páginas irmãs, no mesmo diretório da página técnica, para leitores não técnicos no Confluence (hub do time e app DataForge). Hatnotes de 1 linha nas páginas técnicas apontam para o guia; guias apontam de volta para a especificação. Guias não entram na cadeia de leitura obrigatória de `ai-context.md`, preservando o consumo de token de agentes de IA. Registrado em `hub-registry.yaml` (`human_guide`).
- Resources:
  - [aiops-team/README-guia.md](aiops-team/README-guia.md)
  - [aiops-apps/dataforge-guia.md](aiops-apps/dataforge-guia.md)
  - `docs-sync/aiops-config/hub-registry.yaml` (`human_guides`)
- Impact: leitores não técnicos do Confluence AIOps (negócio, novos membros, suporte); nenhuma mudança na fonte de verdade técnica
- See: [aiops-team/README-guia.md](aiops-team/README-guia.md)

## 2026-08-24

- Summary: Hub **AIOps em 3 níveis** — pasta `aiops-team/` (nível 1), páginas por app em `aiops-apps/` (nível 2), registro `hub-registry.yaml`, skill `sync-aiops-hub`, flag CLI `--only`, targets Make scoped, piloto nível 3 DataForge.
- Resources:
  - [aiops-team/README.md](aiops-team/README.md)
  - [aiops-team/documentation-model.md](aiops-team/documentation-model.md)
  - [aiops-apps/dataforge.md](aiops-apps/dataforge.md)
  - `docs-sync/aiops-config/hub-registry.yaml`
  - `.cursor/skills/sync-aiops-hub/SKILL.md`
- Impact: publicação sob demanda no Confluence (6086460456) via agente; coexistência com metodologia do framework

- Summary: Pack **loft-infra** enriquecido com guia completo de publicação (`publish-guide.md`) e pasta `examples/` (workflows, Docker, k8s-apps, Kong, DNS, Vault/CORS), derivado do runbook do `aiops-central`. Arquivos as-is existentes mantidos e atualizados com links/avisos (corp vs external, DNS auto, JumpCloud, CORS). Manifest EN/pt-BR e índices atualizados.
- Resources:
  - [loft-infra/publish-guide.md](loft-infra/publish-guide.md)
  - [loft-infra/examples/README.md](loft-infra/examples/README.md)
  - [loft-infra/README.md](loft-infra/README.md)
  - [loft-infra/checklist-novo-servico.md](loft-infra/checklist-novo-servico.md)
- Impact: times AIOps que publicam novos apps no modelo Cross Prod
- See: [loft-infra/publish-guide.md](loft-infra/publish-guide.md)

## 2026-08-19

- Summary: Novo pack **as-is Loft** `loft-observability/` (EN + pt-BR): Datadog no EKS (chart `web-server`), logs JSON estruturados, receitas APM por stack, guia operacional, verificação pós-deploy e **logs no Datadog** como pré-requisito documental Loft. Integrado ao checklist `loft-infra`, `observability-platform-notes` (apenas pointer), índice de docs, manifest, area map e perfil `docs-sync` loft-infra (segundo root path).
- Resources:
  - [loft-observability/README.md](loft-observability/README.md)
  - [loft-observability/documentation-prerequisites.md](loft-observability/documentation-prerequisites.md)
  - [loft-infra/checklist-novo-servico.md](loft-infra/checklist-novo-servico.md)
  - [observability-platform-notes.md](observability-platform-notes.md)
  - [docs-sync/aiops-config/loft-infra.pt-BR.yaml](../../docs-sync/aiops-config/loft-infra.pt-BR.yaml)
- Impact: autores de serviços EKS Loft, operadores e consumidores da documentação AIOps
- See: [loft-observability/README.md](loft-observability/README.md)

## 2026-08-17

- Summary: Política de links em duas superfícies e **correção obrigatória de links** na publicação Confluence/GitHub: proibir caminhos de monorepo `../../pkg/README.md` nus ou que escapam; `docs-sync validate` e `DOC-LINK-003` interrompem em relativos quebrados; o sync não inventa mais URLs `blob` falsas para arquivos inexistentes.
- Resources:
  - [publishing-surfaces.md](publishing-surfaces.md)
  - [standards.md](standards.md) (Referências e links)
  - [evidence-references.md](evidence-references.md)
  - [source-of-truth.md](source-of-truth.md)
  - [validation-rules.md](validation-rules.md) (`DOC-LINK-003`)
  - [docs-sync/README.md](../../docs-sync/README.md) (URLs blob no rodapé + validação de links)
- Impact: autores e agentes que escrevem ou sincronizam Markdown com o Confluence
- See: [publishing-surfaces.md](publishing-surfaces.md)

## 2026-08-13

- Summary: Arquivos de entrada de agente opcionais (`AGENTS.md`, `CLAUDE.md`) e um starter para adotantes, para Cursor / Claude Code carregarem este padrão em vez de um pack genérico de skills. Registrado que andaime de execução (spec/RFC/plano de tasks) não é fonte de verdade do sistema atual depois do merge.
- Resources:
  - [ai-agent-entry.md](ai-agent-entry.md)
  - [templates/agents-entry.md](templates/agents-entry.md), [templates/claude-entry.md](templates/claude-entry.md)
  - [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/)
  - `AGENTS.md` e `CLAUDE.md` na raiz
  - `.cursor/rules/docs-quality-checks.mdc`, skills `document-after-change` e `grill-me` (Cursor + espelho `.claude/`)
- Impact: autores e squads adotantes que usam agentes de código
- See: [source-of-truth.md](source-of-truth.md), [ai-documentation-workflow.md](ai-documentation-workflow.md), [adoption-path.md](adoption-path.md), [documentation-debt.md](documentation-debt.md) `DOC-015`
