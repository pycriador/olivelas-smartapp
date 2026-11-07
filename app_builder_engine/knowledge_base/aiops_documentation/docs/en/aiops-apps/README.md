# AIOps Apps — application stacks

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/README.md)
>
> Status: ACCEPTED
>
> Authority: Verified
>
> Documentation Standard v1.0

**As-is** documentation of **frontend** and **backend** stacks for reference AIOps apps — monorepo layout, libraries, common routes, and security.

Publish path (Actions, k8s-apps, Kong, Route53, Vault): [../loft-infra/README.md](../loft-infra/README.md).

---

## Evidence — repositories

| App | Repository | API stack |
| --- | --- | --- |
| DataForge | [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge) | Flask + Gunicorn |
| Deep Insight | [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight) | Flask + Gunicorn |
| Qualidade | [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft) | FastAPI + uvicorn |
| Loft Carteiras | [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) | Flask + Gunicorn |
| **AVA** | [loft-br/ava-prod](https://github.com/loft-br/ava-prod) | slack-bolt + uv (Slack UI, no web front) |

Dedicated page: [ava-prod.md](ava-prod.md).

---

## Evidence — frontend matrix

| Capability | DataForge | Deep Insight | Qualidade | Loft Carteiras |
| --- | --- | --- | --- | --- |
| UI | React + TS | React + TS | React + TS | React + TS |
| Bundler | Vite | Vite | Vite | Vite |
| Routing | TanStack Router + Start SSR | react-router-dom + Express SSR | react-router-dom SPA | TanStack Router + Start |
| Data | TanStack Query | app-level | TanStack Query (+ persist) | TanStack Query |
| UI kit | Radix / shadcn-style | Tailwind + lucide | Radix / shadcn-style | Radix / shadcn-style |
| Forms | RHF + zod | — | RHF + zod | RHF + zod |
| CSS | Tailwind (`@tailwindcss/vite`) | Tailwind | Tailwind | Tailwind |
| package.json name | `aiops-dataforge` | `gemini-pdf-studio` | `vite_react_shadcn_ts` | `tanstack_start_ts` |

**Common libs:** `react`, `vite`, `tailwindcss`, `lucide-react`, `@radix-ui/*`, `cva`/`clsx`/`tailwind-merge`, `sonner`, `xlsx`.  
**TanStack family:** `@tanstack/react-start`, `react-router`, `react-query`, `@lovable.dev/vite-tanstack-config`.  
**RR family:** `react-router-dom`; Qualidade also `@supabase/supabase-js`; Deep Insight `express`, `react-markdown`, `motion`.

---

## Evidence — backend matrix

| Capability | DataForge | Deep Insight | Qualidade | Loft Carteiras |
| --- | --- | --- | --- | --- |
| Framework | Flask 3.x | Flask 3.x | **FastAPI** | Flask 3.x |
| Server | Gunicorn | Gunicorn | uvicorn | Gunicorn |
| ORM | Flask-SQLAlchemy | Flask-SQLAlchemy | SQLAlchemy asyncio + asyncpg | Flask-SQLAlchemy |
| Auth | JWT cookies + API tokens | PyJWT + security hooks | python-jose + JumpCloud | Flask-JWT-Extended |
| Deps | requirements.txt | requirements.txt | **uv** + pyproject.toml | requirements.txt |

**Flask lineage libs:** Flask, SQLAlchemy, CORS, JWT, gunicorn, psycopg*, cryptography.  
**FastAPI lineage:** fastapi, uvicorn, asyncpg, pydantic-settings, python-jose, httpx, ruff.

---

## Documents in this pack

| Doc | Content |
| --- | --- |
| [overview.md](overview.md) | Monorepo organization |
| [frontend-stack.md](frontend-stack.md) | UI stacks and libraries |
| [backend-stack.md](backend-stack.md) | API / bot stacks and libraries |
| [routes.md](routes.md) | Common API/UI/Slack routes |
| [security.md](security.md) | AuthN/Z, CORS, headers |
| [ava-prod.md](ava-prod.md) | AVA Slack bot |
| [dataforge.md](dataforge.md) | DataForge — projects and data |
| [deep-insight.md](deep-insight.md) | Deep Insight — knowledge and AI |
| [qualidade-loft.md](qualidade-loft.md) | Qualidade — KB and surveys |
| [loft-carteiras.md](loft-carteiras.md) | Loft Carteiras — IAM and integrations |

Team hub (level 1): [../aiops-team/README.md](../aiops-team/README.md).

**Not** used in the web apps: Copan/`@loft/react-loft`, Next.js, Kotlin backends. AVA has no React UI.