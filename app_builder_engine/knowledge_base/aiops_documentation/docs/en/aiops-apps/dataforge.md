---
id: REF-OLIVELAS-APPS-008
title: "DataForge — projects and data platform"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# DataForge

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/dataforge.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

> Prefer a plain-language explanation? See the [Guide](dataforge-guide.md).

**As-is** documentation for [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge) — Olivelas catalog **level 2**.

## Goal

Web platform for **projects**, **files**, data comparison/reconciliation, dictionaries, and **service accounts** — internal corp use.

## Context

Standard Olivelas **web app** monorepo: TanStack Start front at repo root + Flask API in `backend/`. Evidence: [overview.md](overview.md#dataforge-aiops-dataforge).

## Users / areas

| User / area | Need |
| --- | --- |
| Internal Olivelas squads | Data projects, upload, reconciliation |
| Admins | Service accounts, administration — **Inferred** |

## Impact

Outage blocks corp data/project flows. Formal SLOs: **Unknown**.

## Architecture overview

Repo: [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge).

```text
Browser → aiops-dataforge.loft-corp.com.br (Kong)
       → TanStack Start front (Vite/React)
       → Flask API (Gunicorn) — auth, projects, admin blueprints
       → PostgreSQL (RDS)
```

| Layer | Detail |
| --- | --- |
| Front | `@tanstack/react-start`, file routes `src/routes/*.tsx` |
| API | Flask blueprints in `backend/app/routes/` |
| Auth | Flask-JWT-Extended + API tokens |

## Main integrations

| Integration | Role |
| --- | --- |
| PostgreSQL | Persistence (Flask-SQLAlchemy, `psycopg`) |
| Kong corp | HTTPS ingress |
| Vault | Secrets (`product: ai-ops`) |
| Datadog | Logs, metrics, APM |
| Google APIs | openpyxl / backend integrations — see repo |

## Stack (summary)

| Layer | Technology |
| --- | --- |
| Frontend | React, TanStack Router/Start, TanStack Query, Radix/shadcn, Tailwind v4 |
| Backend | Python 3.12, Flask 3, Gunicorn |
| Front package | `aiops-dataforge` |

Matrices: [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [routes.md](routes.md) · [security.md](security.md).

## Level 3 — technical documentation

Repo: [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge).

| Topic | Link | Status |
| --- | --- | --- |
| README (how to run) | [README](https://github.com/loft-br/aiops-dataforge/blob/main/README.md) | **Confirmed** — covers run, stack, API, deploy, security |
| Internal docs index | [docs/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/docs/README.md) | **Confirmed** |
| Backend / API ref | [backend/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/backend/README.md) | **Confirmed** |
| Backend scripts | [backend/scripts/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/backend/scripts/README.md) | **Confirmed** |
| Deploy k8s values | [deploy/k8s/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/deploy/k8s/README.md) | **Confirmed** |
| CI/CD workflows | [`.github/workflows/`](https://github.com/loft-br/aiops-dataforge/tree/main/.github/workflows) | **Confirmed** |
| Vault scripts | [`scripts/vault/`](https://github.com/loft-br/aiops-dataforge/tree/main/scripts/vault) | **Confirmed** |
| OpenAPI / contracts | [docs/pt-BR/contracts/rest-api.md](https://github.com/loft-br/aiops-dataforge/blob/main/docs/pt-BR/contracts/rest-api.md) | **Confirmed** |

Level 3 pilot audit: [examples/level3-readme-pilots/dataforge.md](../../../examples/level3-readme-pilots/dataforge.md).

Level 3 section contract: [../aiops-team/documentation-model.md](../aiops-team/documentation-model.md).

## Deploy

| Field | Value |
| --- | --- |
| k8s namespace | `aiops-dataforge` |
| Corp URL | `aiops-dataforge.loft-corp.com.br` |
| Pipelines | `prod-k8s-deployment-front.yml`, `prod-k8s-deployment-api.yml` |
| `product` | `ai-ops` |

Infra: [../loft-infra/publish-guide.md](../loft-infra/publish-guide.md).

## Security (summary)

JWT access/refresh; cookies (DataForge); service accounts at `/api/tokens`. Detail: [security.md](security.md).

## Related

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [overview.md](overview.md) · [ava-prod.md](ava-prod.md)
