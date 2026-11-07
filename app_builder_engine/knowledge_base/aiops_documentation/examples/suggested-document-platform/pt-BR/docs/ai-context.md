---
title: "Contexto para IA — Northstar Document Platform"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "AI-NS-001"
type: "ai-context"
---

# Contexto para IA — Northstar Document Platform (Ficcional)

> Idioma: pt-BR | [English](../../en/docs/ai-context.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> Exemplo **SUGERIDO / ILUSTRATIVO** — **NÃO** é o padrão de documentação nem mandato de plataforma.

## Como agentes devem usar este pacote

1. Comece em [project-overview.md](project-overview.md) para propósito, escopo e o card de stack não normativo.
2. Trate toda escolha de tecnologia como **apenas exemplo**, salvo confirmação no repositório real do adotante.
3. Prefira labels de Classification: **Confirmed** (dentro da ficção do exemplo), **Inferred**, **Unknown**, **Proposed**.
4. Nunca invente hostnames reais, vault paths, credenciais ou URLs de produção. Use placeholders.

## One-liner do sistema

Northstar é uma plataforma fictícia de inteligência documental: SSR BFF + Flask API + PostgreSQL dual-schema + workers opcionais Slack/scheduler + subsistema knowledge/RAG.

## Pontos de entrada de alto valor

| Necessidade | Documento |
| --- | --- |
| Topologia | [architecture/overview.md](architecture/overview.md) |
| Atores e confiança | [architecture/system-context.md](architecture/system-context.md) |
| Schemas / entidades | [architecture/data-model.md](architecture/data-model.md) |
| Superfície HTTP | [contracts/http-api.md](contracts/http-api.md) |
| Tokens externos | [contracts/external-api.md](contracts/external-api.md) |
| Por que SSR BFF | [decisions/adr-001-ssr-bff.md](decisions/adr-001-ssr-bff.md) |
| Por que worker Slack | [decisions/adr-002-slack-socket-worker.md](decisions/adr-002-slack-socket-worker.md) |
| Ops de hybrid search | [operations/rb-hybrid-search.md](operations/rb-hybrid-search.md) |

## Premissas seguras para agentes

| Premissa | Classification |
| --- | --- |
| Browser nunca fala com DB / LLM / Drive diretamente | Confirmed (within example) |
| Workers compartilham a imagem da API | Confirmed (within example) |
| Segredos via env ou path Vault placeholder | Proposed (example only) |
| Busca vetorial opcional atrás de feature flag | Proposed (example only) |
| Números reais de SLO / histórico de incidentes | Unknown |

## Fora de escopo para agentes

- Tratar esta árvore como normativa do Padrão de Documentação AIOps
- Copiar a stack ilustrativa para produção sem revisão da org
- Usar nomes fictícios como se fossem serviços reais
