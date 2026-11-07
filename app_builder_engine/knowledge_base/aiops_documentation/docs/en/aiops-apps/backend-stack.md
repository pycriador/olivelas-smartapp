# Olivelas backend stack

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/backend-stack.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Families

**A — Flask + Gunicorn:** DataForge, Deep Insight, Olivelas Carteiras — SQLAlchemy, CORS, JWT, PostgreSQL drivers; Deep Insight adds Gemini/PDF/OCR/Slack; Carteiras uses `/auth/v1` + `/rest/v1` + `/public/v1`.

**B — FastAPI + uvicorn + uv:** Qualidade — async SQLAlchemy/asyncpg, pydantic-settings, python-jose, JumpCloud OAuth routers under `/api/*`.

**C — slack-bolt + uv:** AVA (`ava-prod`) — Socket Mode bot, `GET /health` only, SCIM-gated `/avaliar`. See [ava-prod.md](ava-prod.md).

Health paths: `/health` and/or `/api/health` (Qualidade also `/api/health/db`). Align with k8s probes.

Fuller examples: [pt-BR backend-stack](../../pt-BR/aiops-apps/backend-stack.md).
