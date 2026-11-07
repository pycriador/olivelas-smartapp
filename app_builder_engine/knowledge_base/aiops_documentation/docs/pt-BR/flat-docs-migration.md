---
title: "Migração de documentação flat"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Migração de documentação flat → árvore do padrão

> Language: pt-BR | [English](../en/flat-docs-migration.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Playbook para reorganizar Markdown soltos (`docs/FOO.md`) na árvore progressiva do padrão (`architecture/`, `contracts/`, `operations/`, …), com EN + pt-BR quando o projeto for bilíngue.

## Quando usar

- Há dezenas de docs flat sem índice por audiência/depth.
- Existe um “monólito de engenharia reversa” que mistura produto, arquitetura e ops.
- Links do README raiz apontam para arquivos que mudam de nome com frequência.

## Princípios

1. **Não inventar** fatos ao migrar — preserve Classification / marque Unknown.
2. **Fundir** em vez de duplicar (ex.: padrões de API → `contracts/rest-api.md`).
3. **Arquivar** roadmap/estratégia sob `product/` (não misturar com as-is).
4. **Absorver** engenharia reversa longa em nós de architecture/application — não republicar o monólito.
5. Atualizar loaders de máquina (OpenAPI path, scripts) na mesma mudança.

## Mapa típico (ilustrativo)

| Legado flat (exemplos de nomes) | Destino sugerido |
| --- | --- |
| `PRD.md` | `product/prd.md` |
| `ENTERPRISE_EVOLUTION.md` / roadmap | `product/` com Classification Proposed |
| `TECHNICAL_REVERSE_ENGINEERING.md` | Absorver em `architecture/*` + `application/*` |
| `RBAC.md` | `security/rbac.md` |
| `APAM.md` / tokens | `contracts/` (API auth) |
| `SERVICE_ACCOUNTS.md` | `contracts/` |
| `STORAGE.md` | `application/storage-*.md` + `contracts/` integration |
| `DATAOPS.md` | `application/data-ops.md` |
| `OUTPUT_EXPORT.md` | Seção em pipeline + contrato REST |
| `CANONICAL_*.md` | `contracts/canonical-*.md` (fundir) |
| `DEPENDENCY_SECURITY.md` | `security/dependency-security.md` |
| `CHANGELOG.md` | `changelog.md` por idioma |
| `openapi.yaml` | `contracts/openapi.yaml` |
| `ENTERPRISE_API_STANDARDS.md` | Fundir em `contracts/rest-api.md` + `security/overview.md` |

Nomes exatos variam por projeto. O mapa é **orientação**, não schema rígido.

## Sequência recomendada

1. Inventariar flat files e classificar: as-is / product / histórico.
2. Criar esqueleto `docs/pt-BR` (+ `docs/en` se bilíngue) e `docs/README.md` language chooser.
3. Migrar architecture → application → contracts/security → operations.
4. Escrever `knowledge-gaps.md` com o que o código tem e o legado não cobria.
5. Atualizar README do repo + qualquer path hardcoded (OpenAPI loader, CI).
6. Remover flat legado na mesma PR (ou deixar stub de redirect por um ciclo).
7. Validar paridade de paths EN/pt-BR e links internos.


## Mapa ilustrativo — forma document intelligence (NÃO normativo)

Inspirado em padrão de um **projeto isolado de referência** (SSR BFF + API + workers + schema knowledge). Nomes abaixo são **apenas exemplos**.

| Flat legado (exemplo) | Destino sugerido |
| --- | --- |
| `ARCHITECTURE.md` | `architecture/overview.md` + `system-context.md` |
| `DATABASE.md` | `architecture/data-model.md` |
| `ROUTES.md` / `api-reference.md` | `contracts/http-api.md` (+ contrato external) |
| `SSR.md` | `application/ssr-bff.md` (ou `templates/bff.md`) |
| `SLACK-*-ARCHITECTURE.md` | `application/slack-bridge.md` + `templates/worker.md` |
| `INTERNAL-SCHEDULER.md` | `application/scheduler.md` |
| `HYBRID-SEARCH.md` / runbooks pgvector | `operations/` runbooks + `feature-flags.md` |
| Stubs de fase / reports de reverse-engineering | `archive/` com `DEPRECATED` + `superseded_by` |

Árvore ilustrativa preenchida: [suggested-document-platform](../../examples/suggested-document-platform/) — **stack sugerida ≠ padrão**.

## Exemplo ilustrativo

O exemplo [fullstack-monolith](../../examples/fullstack-monolith/) mostra uma árvore já no formato alvo. A stack ali é **sugerida/ilustrativa**, não normativa.

## Armadilhas

| Armadilha | Mitigação |
| --- | --- |
| Copiar o framework inteiro para o repo do produto | Adotar só templates necessários |
| Promover `ACCEPTED` por IA | Manter `DRAFT` até review humano |
| Tradução EN incompleta sem marca | Usar `Translation status: pending` |
| Perder OpenAPI ao mover arquivo | Atualizar path no código na mesma mudança |

## Relacionados

- [adoption-path.md](adoption-path.md)
- [language.md](language.md)
- [change-policy.md](change-policy.md)
- [documentation-checklist.md](documentation-checklist.md)
