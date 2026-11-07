---
id: REF-AIOPS-APPS-010
title: "Qualidade — base de conhecimento e surveys"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Qualidade

> Language: pt-BR | [English (EN)](../../en/aiops-apps/qualidade-loft.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Documentação **as-is** de [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft) (namespace k8s `aiops-qualidade`) — **nível 2**.

## Objetivo

Plataforma de **base de conhecimento**, integração **Confluence**, **chat AI**, **surveys** e analytics admin — uso interno.

## Contexto

Monorepo SPA Vite + **FastAPI** async (`uv`). Auth via **JumpCloud OAuth**. Evidência: [overview.md](overview.md#qualidade-qualidade-loft--namespace-aiops-qualidade).

## Usuários / áreas

| Usuário / área | Necessidade |
| --- | --- |
| Squads Qualidade / internas | KB, surveys, chat AI |
| Admins | Analytics e permissões — **Inferred** |

## Impacto

Indisponibilidade afeta ferramentas de qualidade e KB interna. SLOs: **Unknown**.

## Visão geral da arquitetura

Repo: [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft).

```text
Browser → aiops-qualidade.loft-corp.com.br
       → SPA Vite (react-router-dom, ProtectedRoute)
       → FastAPI (uvicorn) — routers em backend/app/routers/
       → PostgreSQL (asyncpg)
       → Confluence / AI providers (httpx)
```

| Camada | Detalhe |
| --- | --- |
| Front | SPA, `@supabase/supabase-js` legado no tree |
| API | FastAPI, SQLAlchemy asyncio, pydantic-settings |
| Auth | JumpCloud OAuth `/api/auth` |

## Principais integrações

| Integração | Papel |
| --- | --- |
| PostgreSQL | asyncpg + SQLAlchemy 2 |
| Confluence | Sync/conteúdo — domínio qualidade |
| JumpCloud | SSO OAuth |
| Kong / Vault / Datadog | Padrão Loft |

## Stack (resumo)

| Camada | Tecnologia |
| --- | --- |
| Frontend | React, Vite SPA, TanStack Query |
| Backend | FastAPI, uv, ruff/pytest (dev) |
| Package front | `vite_react_shadcn_ts` |

Matrizes: [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [routes.md](routes.md).

## Nível 3 — documentação técnica

Repo: [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft).

| Tópico | Link |
| --- | --- |
| README | [README](https://github.com/loft-br/qualidade-loft/blob/main/README.md) |
| Backend | [backend/](https://github.com/loft-br/qualidade-loft/tree/main/backend) |
| Routers API | [backend/app/routers/](https://github.com/loft-br/qualidade-loft/tree/main/backend/app/routers) |

## Deploy

| Campo | Valor |
| --- | --- |
| Namespace k8s | `aiops-qualidade` |
| URL corp | `aiops-qualidade.loft-corp.com.br` |
| Repo GitHub | `qualidade-loft` |
| `product` | `ai-ops` |

## Segurança (resumo)

python-jose + JumpCloud; Bearer tokens. Detalhe: [security.md](security.md).

## Relacionados

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [overview.md](overview.md)
