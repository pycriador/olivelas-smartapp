# AIOps project organization

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

Reference AIOps products are **monorepos**: Vite/React at the root, Python API under `backend/`, separate front/API deploy workflows.

```text
repo/
├── package.json + src/     # frontend
├── backend/app/            # Flask or FastAPI
├── Dockerfile(s)
├── scripts/vault/
└── .github/workflows/
```

| App | Front shape | Backend shape |
| --- | --- | --- |
| DataForge | TanStack Start file routes | Flask `routes/` blueprints |
| Deep Insight | RR + Express `server/` | Flask `create_app` + knowledge/AI |
| Qualidade | SPA pages + RR guards | FastAPI `routers/` + uv |
| Loft Carteiras | TanStack `_authenticated` + public API routes | Flask `/auth/v1`, `/rest/v1`, `/public/v1` |
| AVA (`ava-prod`) | Slack slash commands (no React) | slack-bolt Socket Mode + `/health` only |

See [frontend-stack.md](frontend-stack.md), [backend-stack.md](backend-stack.md), [ava-prod.md](ava-prod.md), [../loft-infra/overview.md](../loft-infra/overview.md).
