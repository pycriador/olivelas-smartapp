---
title: "ADR-001 SSR BFF — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "ADR-NS-001"
type: "adr"
---

# ADR-001: SSR BFF na frente da API

> Idioma: pt-BR | [English](../../../en/docs/decisions/adr-001-ssr-bff.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> Registro de decisão **SUGERIDO / ILUSTRATIVO** — **NÃO** é mandato de plataforma.

## Contexto

A Northstar precisa de UI web e deve manter credenciais de LLM, Drive e banco fora do browser. Um SPA puro falando com API pública é possível, mas empurra complexidade de CORS, cookie e fronteira de segredos para a borda.

## Decisão

Usar um **Node SSR BFF** que renderiza React e proxia `/api` (e `/external` quando necessário) para Flask.

## Consequências

| Positivo | Negativo |
| --- | --- |
| Origem pública única (`https://docs.example.com`) | Runtime extra para operar |
| Segredos ficam nos processos de servidor | Casos de borda de SSR/auth |
| Fronteira de confiança clara | Não é exigido pelo padrão de documentação |

## Alternativas consideradas

| Alternativa | Por que não (neste exemplo) |
| --- | --- |
| SPA + API pública apenas | História mais fraca de segredo/origem |
| Só server-rendered (sem React) | Metas de riqueza de UI na ficção |

**Classification:** Proposed (example only).

## Relacionados

- [../application/ssr-bff.md](../application/ssr-bff.md)
- [../architecture/overview.md](../architecture/overview.md)
