---
title: "Ponte Slack — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "APP-NS-SLACK-001"
type: "application"
---

# Ponte Slack (ilustrativa)

> Idioma: pt-BR | [English](../../../en/docs/application/slack-bridge.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — worker Slack Socket Mode é **apenas exemplo**.

## Responsabilidade

Rodar um worker de longa duração em **Socket Mode** (mesma imagem da API) que recebe DMs, mapeia usuários Slack para identidades Northstar quando possível, invoca o pipeline compartilhado de chat e publica respostas — sem expor Flask HTTP ao modelo público de webhook do Slack como caminho principal.

## Por que um processo separado

| Concern | Choice | Classification |
| --- | --- | --- |
| Persistent websocket | Dedicated worker replica | Confirmed (within example) |
| Horizontal API scale | API pods stay request-scoped | Confirmed (within example) |
| Secret isolation | Slack app tokens only on worker | Proposed (example only) |

## Fluxo

```mermaid
sequenceDiagram
    participant U as Slack user
    participant S as Slack
    participant W as slack-worker
    participant C as chat pipeline
    U->>S: DM
    S->>W: Socket Mode event
    W->>C: run chat turn
    C-->>W: answer + citations
    W->>S: reply
    S-->>U: message
```

## Configuração (placeholders)

| Secret / env | Purpose | Classification |
| --- | --- | --- |
| `SLACK_APP_TOKEN` | Socket Mode | Proposed (example only) |
| `SLACK_BOT_TOKEN` | Post messages | Proposed (example only) |
| Vault path | `secrets/path/example` | Proposed (example only) |

## Relacionados

- [adr-002-slack-socket-worker.md](../decisions/adr-002-slack-socket-worker.md)
- [flask-api.md](flask-api.md)
