---
title: "Northstar Document Platform (Ficcional) — Visão do projeto"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "PROJ-NS-001"
type: "project-overview"
---

# Northstar Document Platform (Ficcional)

> Idioma: pt-BR | [English](../../en/docs/project-overview.md)
>
> Status: ACCEPTED · Owner: example-team · Updated: 2026-08-10
>
> Documentation Standard v1.0

## Enquadramento crítico

Este documento pertence a um exemplo **SUGERIDO / ILUSTRATIVO**, inspirado em padrões de um **projeto isolado de referência** (inteligência documental / RAG / SSR BFF / Flask / worker Slack / scheduler / PostgreSQL).

**NÃO** é o Padrão de Documentação AIOps, **NÃO** é o guia definitivo de uso do framework e **NÃO** é um mandato de plataforma Loft. As escolhas de tecnologia abaixo são **apenas exemplo**.

**Produto fictício:** Northstar Document Platform. Apenas placeholders (`https://docs.example.com`, `secrets/path/example`).

## Propósito

Plataforma corporativa fictícia para **ingestão de documentos, análise assistida por LLM, recuperação conversacional com citações (RAG)** e as mesmas capacidades expostas a navegadores, Slack e clientes de API externa com escopo — sem colocar segredos ou acesso a banco no frontend.

## Problema

Times precisam ingerir documentos (PDF/Office), analisá-los com LLM externo, responder perguntas com citações, sincronizar pastas sob agenda e fazer bridge de chat no Slack — com RBAC, segredos de grupo criptografados e auditabilidade.

## Escopo

| No escopo | Notas | Classification |
| --- | --- | --- |
| React SSR BFF + Flask API | Browser nunca detém segredos LLM/DB | Confirmed (within example) |
| PostgreSQL dual schema `app` + `knowledge` | Operacional vs RAG | Confirmed (within example) |
| RBAC multi-grupo, agents, chat | Isolamento tipo tenant | Confirmed (within example) |
| Knowledge platform (ingest, search, prompts) | Subsistema RAG | Confirmed (within example) |
| Worker Slack Socket Mode | Mesma imagem da API | Confirmed (within example) |
| Scheduler interno | Drive→analysis→knowledge (ilustrativo) | Confirmed (within example) |
| Tokens de API externa | Clientes máquina com escopo | Confirmed (within example) |

## Não-objetivos

| Não-objetivo | Razão |
| --- | --- |
| Mandatar esta stack para o padrão | O padrão é agnóstico de tecnologia |
| Browser → PostgreSQL / Drive / LLM direto | Segredos ficam no servidor |
| URLs, vault paths ou SLOs reais de produção | Ficção; Unknown |
| CronJobs de OS/K8s como único scheduler | O exemplo usa worker in-app |

## Stack sugerida (ILUSTRATIVA — **NÃO É O PADRÃO**)

| Camada | Escolha ilustrativa | Classification |
| --- | --- | --- |
| Frontend | React + Node SSR BFF | Proposed (example only) |
| API | Flask + SQLAlchemy | Proposed (example only) |
| DB | PostgreSQL dual schema app + knowledge | Proposed (example only) |
| Workers | Slack Socket Mode + scheduler interno (mesma imagem) | Proposed (example only) |
| AI | Provedor LLM externo (ilustrativo) | Proposed (example only) |
| Search | FTS + vetor opcional | Proposed (example only) |
| Secrets | Env/Vault; segredos de grupo criptografados em repouso | Proposed (example only) |
| Deploy | Container + values estilo Helm (específico da org) | Proposed (example only) |

> Se o seu projeto usa outra stack: **ignore esta tabela** e documente a stack real com Classification correta.

## URLs públicas (placeholders)

| Componente | URL |
| --- | --- |
| Frontend | `https://docs.example.com` |
| API | `https://api.docs.example.com` |
| API health | `https://api.docs.example.com/api/health` |

## Arquitetura

- Overview: [architecture/overview.md](architecture/overview.md)
- Contexto: [architecture/system-context.md](architecture/system-context.md)
- Dados: [architecture/data-model.md](architecture/data-model.md)

## Componentes

| Componente | Responsabilidade | Doc |
| --- | --- | --- |
| ssr-bff | Renderizar React, proxy `/api` e `/external` | [application/ssr-bff.md](application/ssr-bff.md) |
| flask-api | Auth, RBAC, analysis, chat, KOC, API externa | [application/flask-api.md](application/flask-api.md) |
| document-analysis | Pipeline multi-formato → LLM | [application/document-analysis.md](application/document-analysis.md) |
| slack-bridge | Gateway DM Socket Mode | [application/slack-bridge.md](application/slack-bridge.md) |
| scheduler | Jobs in-app Drive→analysis→knowledge | [application/scheduler.md](application/scheduler.md) |
| knowledge-platform | RAG ingest, search, prompts, skills | [application/knowledge-platform.md](application/knowledge-platform.md) |

## Segurança / Ops / AI

- [security/overview.md](security/overview.md)
- [operations/local-dev.md](operations/local-dev.md)
- [observability/overview.md](observability/overview.md)
- [ai-context.md](ai-context.md)
