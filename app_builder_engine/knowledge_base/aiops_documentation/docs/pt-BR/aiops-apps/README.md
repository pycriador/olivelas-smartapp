# Olivelas Apps — stacks de aplicação

> Language: pt-BR | [English (EN)](../../en/aiops-apps/README.md)
>
> Status: ACCEPTED
>
> Authority: Verified
>
> Documentation Standard v1.0

Documentação **as-is** da stack de **frontend** e **backend** dos apps Olivelas de referência — organização do monorepo, bibliotecas, rotas comuns e segurança. Inclui também apps **sem front web** (ex.: bot Slack AVA).

Infra de publicação (Actions, k8s-apps, Kong, Route53, Vault): ver [../loft-infra/README.md](../loft-infra/README.md).

---

## Evidência — repositórios

| App | Repositório | Superfície de usuário | Runtime |
| --- | --- | --- | --- |
| DataForge | [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge) | Front corp `aiops-dataforge.loft-corp.com.br` | Flask + Gunicorn |
| Deep Insight | [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight) | Front corp `aiops-deep-insight.loft-corp.com.br` | Flask + Gunicorn |
| Qualidade | [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft) | Front corp `aiops-qualidade.loft-corp.com.br` | FastAPI + uvicorn |
| Olivelas Carteiras | [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) | Front corp `aiops-loft-carteiras.loft-corp.com.br` | Flask + Gunicorn |
| **AVA** | [loft-br/ava-prod](https://github.com/loft-br/ava-prod) | **Slack** (Socket Mode) — sem front web | Python + slack-bolt + uv |

Doc dedicada: [ava-prod.md](ava-prod.md).

---

## Evidência — stack frontend (matriz)

| Capacidade | DataForge | Deep Insight | Qualidade | Olivelas Carteiras | AVA |
| --- | --- | --- | --- | --- | --- |
| Runtime UI | React + TypeScript | React + TypeScript | React + TypeScript | React + TypeScript | **N/A** (Slack) |
| Bundler | Vite | Vite | Vite | Vite | — |
| Roteamento | **TanStack Router** (+ Start SSR) | **react-router-dom** + Express SSR | **react-router-dom** (SPA) | **TanStack Router** (+ Start) | Slash commands Slack |
| Data fetching | TanStack Query | (fetch / app-level) | TanStack Query (+ persist) | TanStack Query | — |
| UI kit | Radix + shadcn-style (`components.json`) | Tailwind + lucide | Radix + shadcn-style | Radix + shadcn-style | Blocks/mensagens Slack |
| Forms | react-hook-form + zod | — | react-hook-form + zod | react-hook-form + zod | Conversas guiadas + modais |
| Estilo | Tailwind v4 (`@tailwindcss/vite`) | Tailwind | Tailwind + postcss | Tailwind (`@tailwindcss/vite`) | — |
| Ícones / charts | lucide-react, recharts | lucide-react, motion | lucide-react, recharts | lucide-react, recharts | — |
| Origem scaffold | Lovable / TanStack Start | Vite React custom + `server/` | Lovable SPA | Lovable / TanStack Start | App Slack Bolt |
| Package name | `aiops-dataforge` | `gemini-pdf-studio` | `vite_react_shadcn_ts` | `tanstack_start_ts` | `brilhou-bot` (pyproject) |

### Bibliotecas frontend em evidência (amostra agregada)

**Quase ubíquas (apps web):** `react`, `react-dom`, `typescript`, `vite`, `tailwindcss` / `@tailwindcss/vite`, `lucide-react`, `@radix-ui/react-*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `sonner`, `cmdk`, `vaul`, `date-fns`, `xlsx`.

**Família TanStack Start (DataForge, Carteiras):** `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin`, `@tanstack/react-query`, `@lovable.dev/vite-tanstack-config`, `vite-tsconfig-paths`, `zod`, `react-hook-form`, `@hookform/resolvers`.

**Família SPA / SSR Express (Qualidade, Deep Insight):** `react-router-dom`; Qualidade ainda `@supabase/supabase-js`, `@lovable.dev/cloud-auth-js`; Deep Insight `express`, `compression`, `react-markdown`, `motion`.

**Família Slack bot (AVA):** sem `package.json` front — UI é o workspace Slack.

---

## Evidência — stack backend (matriz)

| Capacidade | DataForge | Deep Insight | Qualidade | Olivelas Carteiras | AVA |
| --- | --- | --- | --- | --- | --- |
| Linguagem | Python 3.12 | Python 3.12 | Python ≥3.12 | Python 3.12 | Python 3.12 |
| Framework | **Flask** 3.x | **Flask** 3.x | **FastAPI** | **Flask** 3.x | **slack-bolt** (Socket Mode) |
| Servidor prod | Gunicorn | Gunicorn | uvicorn | Gunicorn | `uv run app.py` (+ HTTP só health) |
| ORM / DB | Flask-SQLAlchemy | Flask-SQLAlchemy | SQLAlchemy asyncio + asyncpg | Flask-SQLAlchemy / SQLAlchemy 2 | `psycopg` SQL direto |
| Auth | Flask-JWT-Extended + API tokens | PyJWT + hooks | python-jose + JumpCloud | Flask-JWT-Extended | Tokens Slack + SCIM (liderança) |
| DB driver | `psycopg[binary]` | `psycopg2-binary` | `asyncpg` | `psycopg[binary]` | `psycopg[binary]` |
| CORS | Flask-CORS | Flask-CORS | CORSMiddleware | Flask-CORS | N/A (sem API web) |
| Deps file | `backend/requirements.txt` | `backend/requirements.txt` | `backend/pyproject.toml` + **uv** | `backend/requirements.txt` | `pyproject.toml` + **uv** |
| Extras notáveis | openpyxl, Google APIs | google-genai, PyMuPDF, Tesseract, Slack SDK | httpx, pydantic-settings | bcrypt, requests | apscheduler, google-auth, requests |

### Bibliotecas backend em evidência

**Flask lineage:** `Flask`, `Flask-SQLAlchemy`, `Flask-CORS`, `Flask-JWT-Extended` / `PyJWT`, `python-dotenv`, `gunicorn`, `cryptography`, PostgreSQL driver.

**FastAPI lineage (Qualidade):** `fastapi`, `uvicorn[standard]`, `sqlalchemy[asyncio]`, `asyncpg`, `pydantic-settings`, `python-jose[cryptography]`, `httpx`, `ruff` / `pytest` (dev).

**Slack bot lineage (AVA):** `slack-bolt`, `apscheduler`, `psycopg[binary]`, `python-dotenv`, `requests`, `google-auth`, empacotado com **uv**.

---

## Evidência — organização do monorepo

Padrão dominante (**apps web**):

```text
repo/
├── package.json          # frontend
├── src/                  # UI (routes/pages/components)
├── Dockerfile            # imagem front (quando na raiz)
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt | pyproject.toml
│   └── app/              # API Python
├── .github/workflows/    # deploy front + API
├── scripts/vault/        # push/pull secrets (vários apps)
└── deploy/k8s/           # paths que disparam redeploy
```

Variações: Deep Insight tem `server/` (Node SSR) e `knowledge/`; Carteiras tem `front_slack/` e `Dockerfile.front`; Qualidade tem `supabase/` legado no tree e API FastAPI em `backend/app/routers/`.

**AVA (bot):** processo único na raiz (`app.py` + `Dockerfile` + `pyproject.toml`), `db/` SQL, um workflow de deploy, sem `src/` React — ver [ava-prod.md](ava-prod.md).

---

## Evidência — rotas / health comuns

| Superfície | Padrão observado |
| --- | --- |
| Health API | `/api/health` e/ou `/health` (probes k8s alinhados); AVA: **só** `GET /health` |
| Auth API | `/api/auth/*` (DataForge, Qualidade) · `/auth/v1/*` (Carteiras) · AVA: tokens Slack |
| Admin / IAM | `/api/admin/*`, `/api/users`, IAM permissions no front |
| Conteúdo de domínio | `/api/projects`, `/api/content`, `/api/conversations`, `/rest/v1`, … |
| Front login | `/login` (+ `/auth/callback` no Qualidade SSO) |
| Front autenticado | layout `_authenticated` (TanStack) ou `ProtectedRoute` (RR) |
| Slack (AVA) | `/brilhou`, `/evoluir`, `/histórico`, `/avaliar` |

Detalhes e exemplos: [routes.md](routes.md) · [ava-prod.md](ava-prod.md).

---

## Evidência — segurança (resumo)

| Tema | O que aparece nos repos |
| --- | --- |
| JWT | Access/refresh; cookies (DataForge); Bearer (Qualidade/Carteiras) |
| SSO | JumpCloud OAuth (Qualidade) |
| API tokens / service accounts | DataForge (`/api/tokens`, `/api/auth/service-account`) |
| Slack tokens / SCIM | AVA (`SLACK_*`, fail closed em `/avaliar` sem SCIM) |
| CORS | Origins explícitas; Deep Insight **proíbe** `*` em produção |
| Headers | `X-Content-Type-Options`, `X-Frame-Options`, HSTS (`FORCE_HSTS`), etc. (Deep Insight `security.py`) |
| Proxy | `ProxyFix` / `TRUST_PROXY` atrás do Kong (apps web) |
| Secrets | Vault + `.env.example` only — ver [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md) |
| Front guards | `ProtectedRoute` / `PermissionRoute` / `requireIamPermission` |

Detalhes: [security.md](security.md).

---

## Mapa desta pasta

| Documento | Conteúdo |
| --- | --- |
| [overview.md](overview.md) | Organização dos projetos e papéis front/back |
| [frontend-stack.md](frontend-stack.md) | Stack UI, libs e exemplos por app |
| [backend-stack.md](backend-stack.md) | Stack API / bots, libs e exemplos por app |
| [routes.md](routes.md) | Rotas comuns (API + front + Slack) |
| [security.md](security.md) | AuthN/Z, CORS, headers, tokens |
| [ava-prod.md](ava-prod.md) | AVA — bot Slack (`ava-prod`) |
| [dataforge.md](dataforge.md) | DataForge — projetos e dados |
| [deep-insight.md](deep-insight.md) | Deep Insight — knowledge e AI |
| [qualidade-loft.md](qualidade-loft.md) | Qualidade — KB e surveys |
| [loft-carteiras.md](loft-carteiras.md) | Olivelas Carteiras — IAM e integrações |

Hub do time (nível 1): [../aiops-team/README.md](../aiops-team/README.md).

## Limites

- Fatos grounded nos repos listados; nomes de package (`vite_react_shadcn_ts`, `gemini-pdf-studio`, `brilhou-bot`) refletem scaffold/pyproject e **não** foram inventados.
- Copan (`@loft/react-loft`) **não** aparece nos `package.json` web — UI é Radix/shadcn/Tailwind.
- Kotlin **não** é a stack destes apps Olivelas (Python + React, ou Python + Slack).
- Documentação detalhada de produto da AVA também vive em `loft-br/ava-prod/docs/` — este pack resume o encaixe no catálogo Olivelas.