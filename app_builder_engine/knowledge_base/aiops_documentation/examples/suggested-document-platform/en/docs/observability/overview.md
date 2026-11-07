---
title: "Observability overview — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "OBS-NS-001"
type: "observability"
---

# Observability overview (illustrative)

> Language: EN | [Português](../../../pt-BR/docs/observability/overview.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** — tooling is org-specific; Datadog is optional where the org standard says so, not required by this example.

## Signals

| Signal | Example approach | Classification |
| --- | --- | --- |
| Logs | Structured JSON; request id; no secrets/PII dumps | Confirmed (within example) |
| Metrics | Request latency, job queue depth, search latency | Proposed (example only) |
| Traces | Optional APM / OpenTelemetry | Proposed (example only) |
| Health | `/api/health` | Confirmed (within example) |

## Golden questions (unanswered = Unknown)

| Question | Status |
| --- | --- |
| What is the p99 API SLO? | Unknown |
| Who owns the dashboard? | example-team (placeholder) |
| Are Slack worker disconnects alerted? | Unknown |

## Honesty rule

Do not invent dashboards, monitors, or SLO numbers. Mark gaps as **Unknown** until evidence exists in a real adoption.

## Related

- [../operations/rb-hybrid-search.md](../operations/rb-hybrid-search.md)
- [../operations/deploy-k8s.md](../operations/deploy-k8s.md)
