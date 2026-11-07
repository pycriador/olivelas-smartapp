---
id: REF-OLIVELAS-APPS-010
title: "Qualidade — knowledge base and surveys"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Qualidade

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/qualidade-loft.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

**As-is** documentation for [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft) (k8s namespace `aiops-qualidade`) — **level 2**.

## Goal

Platform for **knowledge base**, **Confluence** integration, **AI chat**, **surveys**, and admin analytics — internal use.

## Context

Vite SPA monorepo + async **FastAPI** (`uv`). Auth via **JumpCloud OAuth**. Evidence: [overview.md](overview.md#qualidade-qualidade-loft--namespace-aiops-qualidade).

## Users / areas

| User / area | Need |
| --- | --- |
| Qualidade / internal squads | KB, surveys, AI chat |
| Admins | Analytics and permissions — **Inferred** |

## Impact

Outage affects internal quality tools and KB. SLOs: **Unknown**.

## Architecture overview

Repo: [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft).

```text
Browser → aiops-qualidade.loft-corp.com.br
       → Vite SPA (react-router-dom, ProtectedRoute)
       → FastAPI (uvicorn) — routers in backend/app/routers/
       → PostgreSQL (asyncpg)
       → Confluence / AI providers (httpx)
```

| Layer | Detail |
| --- | --- |
| Front | SPA, legacy `@supabase/supabase-js` in tree |
| API | FastAPI, SQLAlchemy asyncio, pydantic-settings |
| Auth | JumpCloud OAuth `/api/auth` |

## Main integrations

| Integration | Role |
| --- | --- |
| PostgreSQL | asyncpg + SQLAlchemy 2 |
| Confluence | Content sync — quality domain |
| JumpCloud | SSO OAuth |
| Kong / Vault / Datadog | Olivelas standard |

## Stack (summary)

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite SPA, TanStack Query |
| Backend | FastAPI, uv, ruff/pytest (dev) |
| Front package | `vite_react_shadcn_ts` |

Matrices: [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [routes.md](routes.md).

## Level 3 — technical documentation

Repo: [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft).

| Topic | Link |
| --- | --- |
| README | [README](https://github.com/loft-br/qualidade-loft/blob/main/README.md) |
| Backend | [backend/](https://github.com/loft-br/qualidade-loft/tree/main/backend) |
| API routers | [backend/app/routers/](https://github.com/loft-br/qualidade-loft/tree/main/backend/app/routers) |

## Deploy

| Field | Value |
| --- | --- |
| k8s namespace | `aiops-qualidade` |
| Corp URL | `aiops-qualidade.loft-corp.com.br` |
| GitHub repo | `qualidade-loft` |
| `product` | `ai-ops` |

## Security (summary)

python-jose + JumpCloud; Bearer tokens. Detail: [security.md](security.md).

## Related

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [overview.md](overview.md)
