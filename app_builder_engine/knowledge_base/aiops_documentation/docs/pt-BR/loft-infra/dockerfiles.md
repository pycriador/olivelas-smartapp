# Dockerfiles — padrões e exemplos AIOps

> Language: pt-BR | [English (EN)](../../en/loft-infra/dockerfiles.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

Exemplos tirados dos repositórios de referência. Objetivo: mostrar **o que está em produção hoje**, não um único Dockerfile oficial.

## Padrões transversais

| Padrão | Observação |
| --- | --- |
| Multi-stage no front | Stage `build` (npm) + stage `runtime` (Node mínimo) |
| Non-root | `USER app` / `USER node` após `chown` |
| Healthcheck | `HEALTHCHECK` batendo em `/health` ou `/api/health` |
| ARM | Imagens alinhadas a `linux/arm64` / `cpuArchitecture: arm64` |
| Segredos | Não baked na imagem; Vault em runtime via `vaultSecrets` |
| API Python | `python:3.12-slim(-bookworm)`; Gunicorn (Flask) ou uvicorn (FastAPI+uv) |

## Matriz dos repositórios

| Repo | Front Dockerfile | API Dockerfile | Base front | Stack API |
| --- | --- | --- | --- | --- |
| [aiops-dataforge](https://github.com/loft-br/aiops-dataforge) | `Dockerfile` | `backend/Dockerfile` | `node:22-bookworm-slim` | Flask + Gunicorn |
| [aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight) | `Dockerfile` | `backend/Dockerfile` | `node:22-bookworm-slim` | Flask + Gunicorn (+ LibreOffice/Tesseract) |
| [qualidade-loft](https://github.com/loft-br/qualidade-loft) | `Dockerfile` | `backend/Dockerfile` | `node:22-alpine` | FastAPI + uv + uvicorn |
| [aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) | (não no tree `main` listado) | `backend/Dockerfile` | — | Flask + Gunicorn |
| [ava-prod](https://github.com/loft-br/ava-prod) | — (sem front) | `Dockerfile` (raiz) | — | slack-bolt + **uv** (`python:3.12-slim-bookworm`) |

## Frontend — DataForge (TanStack / Node SSR)

Fonte: [Dockerfile](https://github.com/loft-br/aiops-dataforge/blob/main/Dockerfile).

Pontos de design no próprio arquivo:

- Preferir **Debian slim (glibc)** a Alpine: `sharp` / workerd / esbuild quebram com frequência em musl+arm64 no CI.
- `ARG`/`ENV` `VITE_API_URL` no build (valor default corp; sobrescrito pelo `build-args` do workflow).
- Runtime: `PORT=8080`, `USER app`, entrypoint em `docker/entrypoint.sh`, HEALTHCHECK via `fetch` em `/health`.

```dockerfile
# AIOPS DataForge — Frontend (TanStack Start SSR + Node)
# Use Debian slim (glibc), not Alpine: sharp/workerd/esbuild ship linux-* binaries for glibc;
# Alpine musl + arm64 builds frequently break `npm ci` in CI.
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json.npmrc./
RUN npm ci --no-audit --no-fund
# … copy sources …
ARG VITE_API_URL=https://aiops-dataforge-api.loft-corp.com.br
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=8080 HOST=0.0.0.0
WORKDIR /app
RUN groupadd --system app \
    && useradd --system --gid app --home-dir /app --shell /usr/sbin/nologin app
COPY --from=build /app/dist./dist
# … package.json, node_modules, docker/ …
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/app/docker/entrypoint.sh"]
```

## Frontend — Deep Insight (Vite SSR + proxy)

Fonte: [Dockerfile](https://github.com/loft-br/aiops-deep-insight/blob/main/Dockerfile).

- Mesma base `node:22-bookworm-slim`.
- `VITE_API_BASE_URL` opcional; comentário recomenda same-origin proxy quando a API fica na rede privada.
- Runtime usa usuário `node` e `CMD ["node", "dist/server-node/index.mjs"]`.
- Workflow passa `VITE_API_BASE_URL=https://aiops-deep-insight-api.loft-corp.com.br` (CORS na API necessário).

## Frontend — Qualidade (Vite SPA + Alpine)

Fonte: [Dockerfile](https://github.com/loft-br/qualidade-loft/blob/main/Dockerfile).

- Base **`node:22-alpine`** (SPA mais simples; diferente de DataForge/Deep Insight).
- Build bakeia `VITE_API_URL` apontando para host **interno** `aiops-qualidade-api.cross.loft-prod.io`.
- Runtime define `BACKEND_URL` / `API_URL` para o mesmo host interno.
- Entrypoint custom em `docker/entrypoint.sh`.

## API — DataForge (Flask + Gunicorn)

Fonte: [backend/Dockerfile](https://github.com/loft-br/aiops-dataforge/blob/main/backend/Dockerfile).

```dockerfile
FROM python:3.12-slim-bookworm AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 FLASK_ENV=production
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 wget \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system app \
    && useradd --system --gid app --home-dir /app app
COPY requirements.txt.
RUN pip install --no-cache-dir -r requirements.txt gunicorn==23.0.0
COPY app./app
COPY run.py gunicorn.conf.py entrypoint.sh./
USER app
EXPOSE 5000
HEALTHCHECK CMD wget -qO- http://127.0.0.1:5000/health || exit 1
ENTRYPOINT ["/app/entrypoint.sh"]
```

Nota: probes no `k8s-apps` usam `/api/health` na porta `5000`; o HEALTHCHECK do Dockerfile usa `/health`. Ambos precisam existir (ou alinhar paths).

## API — Deep Insight (Flask + LibreOffice)

Fonte: [backend/Dockerfile](https://github.com/loft-br/aiops-deep-insight/blob/main/backend/Dockerfile).

- Mesmo esqueleto Flask/Gunicorn, com pacotes pesados: LibreOffice, Tesseract (por/eng), fontes.
- Timeouts longos (`GUNICORN_TIMEOUT=600`, timeouts LibreOffice).
- HEALTHCHECK em `/api/health` via `urllib`.
- Copia `knowledge/` para a imagem.

## API — Qualidade (FastAPI + uv)

Fonte: [backend/Dockerfile](https://github.com/loft-br/qualidade-loft/blob/main/backend/Dockerfile).

- Multi-stage: `uv sync --frozen` no build; runtime só com `.venv`.
- Porta **`8000`** (uvicorn), alinhada ao `values.yaml` correspondente.
- Comentário no arquivo: “ARM-friendly”.

```dockerfile
ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim-bookworm AS build
RUN pip install --no-cache-dir uv
COPY pyproject.toml uv.lock./
RUN uv sync --frozen --no-install-project --no-dev
COPY app./app

FROM python:${PYTHON_VERSION}-slim-bookworm AS runtime
ENV PATH="/app/.venv/bin:${PATH}" PORT=8000
# … non-root user …
COPY --from=build --chown=app:app /app /app
USER app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## API — Loft Carteira (Flask + Gunicorn)

Fonte: [backend/Dockerfile](https://github.com/loft-br/aiops-loft-carteira/blob/main/backend/Dockerfile).

- Porta **`5001`**.
- Documenta no header: secrets via `application.vaultSecrets` no EKS; local via `.env` / Vault opcional.
- `VAULT_ENABLED=1` no env da imagem; em K8s o loader usa env já injetado.
- `CMD` Gunicorn inline (`workers 2`, `timeout 120`).

## Como o workflow encaixa o Dockerfile

| Caso | `context` | `dockerfile` |
| --- | --- | --- |
| Front na raiz | `.` (default) | `Dockerfile` |
| API em `backend/` | `backend` | `backend/Dockerfile` |

Build-args de URL pública da API entram só no front (Vite), nunca como secret.

## Recomendações práticas (derivadas dos exemplos)

1. Se o front usa native Node addons (`sharp`, etc.) em **arm64**, preferir **bookworm-slim** (DataForge/Deep Insight).
2. Alpine é aceitável para SPA estático simples (Qualidade), mas não misture stacks sem validar `npm ci` no runner `ubuntu-arm`.
3. Sempre exponha health alinhado ao que está em `k8s-apps` probes.
4. Não copie `.env` com secrets para a imagem; use Vault path em `values.yaml`.

## Templates

- [Dockerfile.front.example](../../en/loft-infra/examples/Dockerfile.front.example)
- [Dockerfile.api.example](../../en/loft-infra/examples/Dockerfile.api.example)
- [docker-entrypoint.sh.example](../../en/loft-infra/examples/docker-entrypoint.sh.example)
- Guia: [publish-guide.md](publish-guide.md)
