# Stack backend AIOps

> Language: pt-BR | [English (EN)](../../en/aiops-apps/backend-stack.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Duas famílias (HTTP APIs) + bot Slack

```text
A) Flask + Gunicorn (+ Flask-SQLAlchemy)
   aiops-dataforge · aiops-deep-insight · aiops-loft-carteira

B) FastAPI + uvicorn (+ SQLAlchemy async / uv)
   qualidade-loft

C) slack-bolt Socket Mode (+ uv, health-only HTTP)
   ava-prod
```

Apps A/B são **Python 3.12** com API HTTP e PostgreSQL, empacotadas em `backend/Dockerfile` (ou raiz no caso C).

## Família C — AVA (Slack bot)

Ver [ava-prod.md](ava-prod.md). Resumo:

| Item | Valor |
| --- | --- |
| Entry | `app.py` |
| Deps | `slack-bolt`, `apscheduler`, `psycopg[binary]`, `requests`, `google-auth`, `python-dotenv` |
| Lock | `uv.lock` / `uv sync --frozen` |
| HTTP | só `GET /health` em `:8080` |
| Prod CMD | `uv run app.py` |

## Família A — Flask

### Bibliotecas típicas

| Pacote | Uso |
| --- | --- |
| `Flask` (≥3 / pin 3.1.x) | HTTP app |
| `Flask-SQLAlchemy` / `SQLAlchemy` 2 | ORM |
| `Flask-CORS` | CORS |
| `Flask-JWT-Extended` ou `PyJWT` | JWT |
| `gunicorn` | Servidor WSGI em prod |
| `python-dotenv` | `.env` local |
| `psycopg[binary]` ou `psycopg2-binary` | PostgreSQL |
| `cryptography` / `bcrypt` | Crypto / passwords |
| `PyYAML` | Config/YAML |

### DataForge — extras

`openpyxl`, `google-api-python-client`, `google-auth` — planilhas e integrações Google.

Estrutura:

```text
backend/app/
├── __init__.py          # create_app, register blueprints, /health
├── routes/              # auth, admin, projects, catalog, …
├── models/
├── services/
└── utils/auth.py        # JWT + API token resolution
```

Blueprints registrados incluem `auth`, `admin`, `projects`, `catalog`, `people`, `data_ops`, `project_files`, `storage`, `api_tokens`, `service_accounts`, `imports`, `canonical_policies`, `root`.

### Deep Insight — extras

`google-genai`, `PyMuPDF`, `Pillow`, `pytesseract`, `slack-sdk`, `croniter` — PDF/OCR/Gemini/Slack/schedules.

Factory `create_app()`:

- Valida `JWT_SECRET_KEY` (≥32 chars) e `CORS_ORIGINS` (sem `*` em prod).
- `ProxyFix` se `TRUST_PROXY`.
- Blueprints: `/api`, `/external`, `/api/knowledge`, `/api/prompts`, `/api/conversations`, `/api/ai`, …
- Módulo `app/security.py` aplica headers de segurança em `after_request`.

### Loft Carteiras — extras

Pins explícitos com comentários de CVE em `requirements.txt` (`flask==3.1.3`, `PyJWT==2.12.0`, …).

Blueprints:

| Blueprint | Prefix |
| --- | --- |
| `auth` | `/auth/v1` |
| `iam` | (IAM routes) |
| `integrations` | integrações |
| `public` | `/public/v1` (webhooks) |
| `rest` | `/rest/v1` (ex.: RPC `has_role`) |

Health: `@app.get("/health")`. Runtime local: `env_loader.py` (Vault HTTP só fora do cluster).

## Família B — FastAPI (Qualidade)

### Bibliotecas (`backend/pyproject.toml`)

| Pacote | Uso |
| --- | --- |
| `fastapi` | API |
| `uvicorn[standard]` | ASGI server |
| `sqlalchemy[asyncio]` + `asyncpg` + `greenlet` | DB async |
| `pydantic-settings` | Settings |
| `python-jose[cryptography]` | JWT |
| `httpx` | HTTP client (ex.: JumpCloud token) |
| `python-multipart` | Uploads |
| `ruff`, `pytest`, `pytest-asyncio` | Dev |

Gestão de deps: **uv** (`uv sync --frozen` no Dockerfile).

### App entry

`backend/app/main.py`:

```python
app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, …)
app.include_router(health.router)
app.include_router(auth.router)
# users, access_groups, content, chat, confluence, …
```

Routers em `backend/app/routers/` com prefixes `/api/auth`, `/api/users`, `/api/content`, `/api/chat`, `/api/confluence`, …

## Health endpoints (alinhamento com k8s)

| App | Paths observados no código |
| --- | --- |
| DataForge | `/health`, `/api/health` |
| Deep Insight | `/api/health` (+ status de DB / knowledge schema) |
| Qualidade | `/health`, `/api/health`, `/health/db`, `/api/health/db` |
| Carteiras | `/health` |
| AVA | `/health` (única rota HTTP) |

Probes em `k8s-apps` devem apontar para o mesmo path/porta do container — ver [../loft-infra/k8s-apps.md](../loft-infra/k8s-apps.md).

## Relacionados

- [routes.md](routes.md) · [security.md](security.md) · [ava-prod.md](ava-prod.md) · [../loft-infra/dockerfiles.md](../loft-infra/dockerfiles.md)
