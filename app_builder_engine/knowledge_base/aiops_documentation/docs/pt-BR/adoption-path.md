---
title: "Caminho de adoção"
status: "REVIEW"
owner: "documentation-standard"
created: "2026-08-10"
updated: "2026-08-13"
review_date: "2026-11-10"
version: "1.0"
---

# Caminho de adoção

> Language: pt-BR | [English](../en/adoption-path.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

Guia de **maturidade documental** para projetos que adotam este padrão. Não exige implementar todas as categorias de uma vez.

Este documento é **metodologia do framework**. Exemplos concretos (incluindo monólito fullstack) são ilustrativos e **não** definem stack obrigatória.

## Princípios

- Preferir evidência a inventário completo prematuro.
- Marcar `Unknown` / `Not Applicable` em vez de omitir.
- Stack tecnológica é do projeto; o padrão é agnóstico.
- Status `ACCEPTED` exige revisão humana.

## Day 0 — Mínimo viável documental

Objetivo: um visitante entende o que o sistema é e onde começa.

| Artefato | Template / exemplo |
| --- | --- |
| `project-overview.md` | [templates/project-overview.md](templates/project-overview.md) |
| `architecture/overview.md` ou `system-context.md` | [templates/architecture-overview.md](templates/architecture-overview.md), [templates/system-context.md](templates/system-context.md) |
| Um contrato da borda pública principal | [templates/contract.md](templates/contract.md) |
| Índice / README de docs com trilha de leitura | Ver [examples/adoption-scaffold/](../../examples/adoption-scaffold/), [examples/simple-service/](../../examples/simple-service/) ou [examples/suggested-document-platform/](../../examples/suggested-document-platform/) |
| `AGENTS.md` / `CLAUDE.md` opcionais apontando para `ai-context.md` | [templates/agents-entry.md](templates/agents-entry.md), [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) |

Saída esperada: escopo, não-objetivos, 1 diagrama de contexto, 1 interface verificável.

## Day 30 — Operar e proteger o básico

| Artefato | Notas |
| --- | --- |
| Componentes principais (`application/` ou `components/`) | Nível de módulo, não lista de classes |
| `security/overview` mínimo | Authn/Authz observáveis; threat model pode permanecer Unknown |
| `operations/service-profile.md` | **Owner e on-call preenchidos ou `Unknown`** — ver template |
| 1–2 runbooks de falha real | Health/DB, auth bootstrap, dependência crítica |
| `operations/observability.md` | Honestidade de sinais; plataforma org (ex. Datadog na Loft) é opcional ao padrão |

## Day 90 — Confiabilidade, segurança e AI-ready

| Artefato | Notas |
| --- | --- |
| SLIs/SLOs ou `Not Defined` com owner | Não inventar números |
| Threat model mínimo | Assets → threats → controls |
| ADRs para decisões materiais | [templates/adr.md](templates/adr.md) |
| `ai-context.md` + `manifest.yaml` | [ai-ready-checklist.md](ai-ready-checklist.md) |
| Deploy view leve | [templates/deployment.md](templates/deployment.md) |
| Validação CI starter (opcional) | [examples/adopter-ci-starter/](../../examples/adopter-ci-starter/) |
| Empacotamento de agente (opcional) | [ai-agent-entry.md](ai-agent-entry.md), [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) |

## Forma Monolith + Frontend

Se UI e API convivem no mesmo repositório, use [architecture-by-project-type.md](architecture-by-project-type.md) e os exemplos ilustrativos — **stack do exemplo ≠ padrão**:

- [fullstack-monolith](../../examples/fullstack-monolith/) — ficção FE+API+DB no formato planilha
- [suggested-document-platform](../../examples/suggested-document-platform/) — ficção document intelligence / BFF / workers

Árvore vazia do Dia 0: [adoption-scaffold](../../examples/adoption-scaffold/).

## Migração a partir de docs flat

Se o repositório já tem muitos Markdown soltos: [flat-docs-migration.md](flat-docs-migration.md).

## O que este guia não é

- Não é um mandato de stack (Flask, React, Kotlin, etc.).
- Não é documentação de um produto Loft específico.
- Não substitui `documentation-checklist.md` nem quality gates do próprio padrão.
- Não é o “único jeito” definitivo de adotar o framework — a maturidade é progressiva.

## Documentos relacionados

- [documentation-checklist.md](documentation-checklist.md)
- [quality-model.md](quality-model.md)
- [architecture-by-project-type.md](architecture-by-project-type.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [language.md](language.md) — incluindo política bilíngue parcial opcional para adotantes
- [examples/adopter-ci-starter/](../../examples/adopter-ci-starter/) — CI opcional
- [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) — arquivos de entrada de agente opcionais
- [ai-agent-entry.md](ai-agent-entry.md) — como ligar Cursor / Claude Code
