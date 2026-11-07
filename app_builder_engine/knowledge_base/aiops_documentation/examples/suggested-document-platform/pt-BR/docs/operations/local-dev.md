---
title: "Desenvolvimento local — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "OPS-NS-DEV-001"
type: "operations"
---

# Desenvolvimento local (ilustrativo)

> Idioma: pt-BR | [English](../../../en/docs/operations/local-dev.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — comandos e portas são apenas exemplo.

## Pré-requisitos

| Tool | Notes | Classification |
| --- | --- | --- |
| Node + package manager | SSR BFF | Proposed (example only) |
| Python + venv/uv | Flask API | Proposed (example only) |
| Docker | PostgreSQL (+ optional vector image) | Proposed (example only) |
| `.env` from `.env.example` | Never commit secrets | Confirmed (within example) |

## Topologia típica (local)

| Process | Port | Classification |
| --- | --- | --- |
| SSR BFF | `8080` | Proposed (example only) |
| Flask API | `5000` | Proposed (example only) |
| PostgreSQL | `5432` | Proposed (example only) |
| Slack worker | optional | Proposed (example only) |

## Esboço de bootstrap

1. Copiar `.env.example` → `.env` (só nomes no git).
2. Subir Postgres; aplicar migrations `app` + `knowledge` (ilustrativo).
3. Rodar API e depois BFF com `API_PROXY_TARGET=http://localhost:5000`.
4. Abrir `http://localhost:8080` (placeholder).

## Segredos

Use variáveis de ambiente locais. Se demonstrar Vault, referencie apenas `secrets/path/example` — nunca paths reais.

## Relacionados

- [deploy-k8s.md](deploy-k8s.md)
- [../infrastructure/deployment.md](../infrastructure/deployment.md)
