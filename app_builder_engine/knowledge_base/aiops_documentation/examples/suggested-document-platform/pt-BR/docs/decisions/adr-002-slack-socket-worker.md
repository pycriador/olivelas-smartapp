---
title: "ADR-002 Slack Socket worker — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "ADR-NS-002"
type: "adr"
---

# ADR-002: Slack Socket Mode como worker dedicado

> Idioma: pt-BR | [English](../../../en/docs/decisions/adr-002-slack-socket-worker.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> Registro de decisão **SUGERIDO / ILUSTRATIVO** — Slack Socket Mode é **apenas exemplo**.

## Contexto

A Northstar quer que DMs no Slack reutilizem o mesmo pipeline de chat da UI web. Webhooks HTTP Events API exigem ingress público e modos de falha operacionais diferentes de um socket de longa duração.

## Decisão

Rodar **Slack Socket Mode** em um **processo worker dedicado** que compartilha a imagem do container da API e chama o pipeline de chat in-process.

## Consequências

| Positivo | Negativo |
| --- | --- |
| Sem ingress público de webhook Slack | Conexão longa sticky por réplica |
| Mesmo código de domínio do chat HTTP | Deploy + segredos extras no worker |
| Escala independente das réplicas da API | Socket Mode é escolha específica de vendor |

## Alternativas consideradas

| Alternativa | Por que não (neste exemplo) |
| --- | --- |
| Só HTTP Events API | Precisa de URL pública + ops de verificação |
| Embutir o loop de socket em todo pod da API | Acopla escala de request à escala de websocket |

**Classification:** Proposed (example only).

## Relacionados

- [../application/slack-bridge.md](../application/slack-bridge.md)
- [../architecture/overview.md](../architecture/overview.md)
