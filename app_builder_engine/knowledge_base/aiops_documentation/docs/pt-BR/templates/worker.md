---
title: "Worker / processo sidecar"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "TPL-WORKER-001"
type: "application"
---

# Worker / processo sidecar

> Language: pt-BR | [English (EN)](../../en/templates/worker.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Processo de longa duração distinto da API request/response. Pode compartilhar imagem com entrypoint diferente. Não invente orquestradores. -->

## Purpose

<!-- What this worker does that the API does not. -->

## Runtime identity

| Field | Value | Classification |
| --- | --- | --- |
| Entrypoint / command | | Confirmed / Inferred / Unknown |
| Artifact / image | | |
| Health endpoint | | |
| Intended replica posture | e.g. single replica / competing consumers | |
| Enable flag | | |

## Triggers

| Trigger | Source | Notes |
| --- | --- | --- |
| Poll / schedule / queue / socket | | |

## Dependencies

| Dependency | Direction | Failure impact | Classification |
| --- | --- | --- | --- |
| | inbound / outbound | | |

## Failure modes

| Failure | Observable signal | Degraded behavior |
| --- | --- | --- |
| | | |

## Related

- Deployment view
- Feature flags
- Runbooks
- ADR if process isolation was a material decision
