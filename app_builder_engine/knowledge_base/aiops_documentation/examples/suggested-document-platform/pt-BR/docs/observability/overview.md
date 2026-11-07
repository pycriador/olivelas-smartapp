---
title: "Visão de observabilidade — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "OBS-NS-001"
type: "observability"
---

# Visão de observabilidade (ilustrativa)

> Idioma: pt-BR | [English](../../../en/docs/observability/overview.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — tooling é específico da org; Datadog é opcional onde o padrão da org indicar, não exigido por este exemplo.

## Sinais

| Signal | Example approach | Classification |
| --- | --- | --- |
| Logs | Structured JSON; request id; no secrets/PII dumps | Confirmed (within example) |
| Metrics | Request latency, job queue depth, search latency | Proposed (example only) |
| Traces | Optional APM / OpenTelemetry | Proposed (example only) |
| Health | `/api/health` | Confirmed (within example) |

## Perguntas de ouro (sem resposta = Unknown)

| Question | Status |
| --- | --- |
| What is the p99 API SLO? | Unknown |
| Who owns the dashboard? | example-team (placeholder) |
| Are Slack worker disconnects alerted? | Unknown |

## Regra de honestidade

Não invente dashboards, monitors ou números de SLO. Marque lacunas como **Unknown** até evidência em uma adoção real.

## Relacionados

- [../operations/rb-hybrid-search.md](../operations/rb-hybrid-search.md)
- [../operations/deploy-k8s.md](../operations/deploy-k8s.md)
