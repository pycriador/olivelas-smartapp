---
title: "Local development — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "OPS-NS-DEV-001"
type: "operations"
---

# Local development (illustrative)

> Language: EN | [Português](../../../pt-BR/docs/operations/local-dev.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** — commands and ports are example-only.

## Prerequisites

| Tool | Notes | Classification |
| --- | --- | --- |
| Node + package manager | SSR BFF | Proposed (example only) |
| Python + venv/uv | Flask API | Proposed (example only) |
| Docker | PostgreSQL (+ optional vector image) | Proposed (example only) |
| `.env` from `.env.example` | Never commit secrets | Confirmed (within example) |

## Typical local topology

| Process | Port | Classification |
| --- | --- | --- |
| SSR BFF | `8080` | Proposed (example only) |
| Flask API | `5000` | Proposed (example only) |
| PostgreSQL | `5432` | Proposed (example only) |
| Slack worker | optional | Proposed (example only) |

## Bootstrap sketch

1. Copy `.env.example` → `.env` (names only in git).
2. Start Postgres; apply `app` + `knowledge` migrations (illustrative).
3. Run API, then BFF with `API_PROXY_TARGET=http://localhost:5000`.
4. Open `http://localhost:8080` (placeholder).

## Secrets

Use local environment variables. If demonstrating Vault, reference only `secrets/path/example` — never real paths.

## Related

- [deploy-k8s.md](deploy-k8s.md)
- [../infrastructure/deployment.md](../infrastructure/deployment.md)
