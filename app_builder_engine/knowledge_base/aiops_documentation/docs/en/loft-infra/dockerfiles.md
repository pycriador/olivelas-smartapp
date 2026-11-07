# Dockerfiles — Olivelas patterns and examples

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/dockerfiles.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Cross-cutting patterns

Multi-stage Node fronts; non-root users; `HEALTHCHECK`; `linux/arm64`; secrets via Vault at runtime; Python 3.12 slim APIs (Gunicorn or uvicorn/uv).

## Repository matrix

| Repo | Front | API | Front base | API stack |
| --- | --- | --- | --- | --- |
| aiops-dataforge | `Dockerfile` | `backend/Dockerfile` | `node:22-bookworm-slim` | Flask + Gunicorn |
| aiops-deep-insight | `Dockerfile` | `backend/Dockerfile` | `node:22-bookworm-slim` | Flask + Gunicorn (+ LibreOffice/OCR) |
| qualidade-loft | `Dockerfile` | `backend/Dockerfile` | `node:22-alpine` | FastAPI + uv + uvicorn |
| aiops-loft-carteira | — (not on listed main tree) | `backend/Dockerfile` | — | Flask + Gunicorn |
| ava-prod | — (no front) | root `Dockerfile` | — | slack-bolt + **uv** |

## Notable design choices

- **DataForge front** documents why **bookworm-slim (glibc)** beats Alpine for `sharp`/workerd/esbuild on arm64 CI.
- **Deep Insight front** optional `VITE_API_BASE_URL`; workflow sets corp API URL (CORS required).
- **Qualidade front** Alpine SPA; API URL baked to **internal** `*.cross.loft-prod.io`.
- **Qualidade API** multi-stage `uv sync --frozen`, port `8000`.
- **Olivelas Carteira API** port `5001`; header comments describe VaultStaticSecret vs local `.env`.
- **AVA** single-process Slack bot image (`python:3.12-slim-bookworm` + uv); only HTTP is `/health`.

Workflow wiring: front uses root `Dockerfile`; API uses `context: backend` + `dockerfile: backend/Dockerfile`. Align container HEALTHCHECK paths with `k8s-apps` probes.

Templates: [Dockerfile.front.example](examples/Dockerfile.front.example), [Dockerfile.api.example](examples/Dockerfile.api.example), [docker-entrypoint.sh.example](examples/docker-entrypoint.sh.example). Guide: [publish-guide.md](publish-guide.md).
