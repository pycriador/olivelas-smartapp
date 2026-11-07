# Organização dos projetos Olivelas

> Language: pt-BR | [English (EN)](../../en/aiops-apps/overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Modelo mental

Os produtos Olivelas de referência caem em dois formatos:

1. **Apps web** — monorepo com frontend Vite/React na raiz + API Python em `backend/`, dois pipelines de deploy.
2. **Bot Slack (AVA)** — processo Python único (`app.py`), Socket Mode, um pipeline; UI = Slack.

```text
┌───────────── Browser / Slack ─────────────┐
│  Front (React)  OU  Slack (slash cmds)     │
└──────────────────┬────────────────────────┘
                   │ HTTPS corp / Socket Mode
┌──────────────────▼────────────────────────┐
│  Backend (Flask / FastAPI / slack-bolt)    │
│  · JWT / SSO / tokens Slack                │
│  · PostgreSQL (RDS)                        │
└────────────────────────────────────────────┘
```

## Layout canônico (apps web)

| Path | Responsabilidade |
| --- | --- |
| `src/` | UI: páginas/rotas, componentes, clients HTTP |
| `src/routes/` ou `src/pages/` | Rotas de tela (file-based TanStack vs pages + App.tsx) |
| `src/components/ui/` | Primitivos estilo shadcn (Radix) |
| `backend/app/` | Application factory / FastAPI app |
| `backend/app/routes/` ou `routers/` ou `api/` | Endpoints HTTP |
| `docker/` | entrypoints do container front |
| `scripts/vault/` | Popular KV no Vault a partir de `.env` local |
| `.github/workflows/` | `prod-k8s-deployment-{front,api}.yml` |

## Por app — o que muda

### DataForge (`aiops-dataforge`)

- Front: TanStack Start (`@tanstack/react-start`), file routes em `src/routes/*.tsx`.
- API: Flask blueprints em `backend/app/routes/` (`auth`, `projects`, `admin`, …).
- Domínio: projetos, arquivos, comparação/reconciliação de dados, dicionários, service accounts.

### Deep Insight (`aiops-deep-insight`)

- Front: Vite CSR + **Node SSR** em `server/` (Express), `react-router-dom`.
- API: Flask `create_app()` registra blueprints sob `/api`, `/external`; knowledge, prompts, AI, Slack bridge.
- Extra: `knowledge/` no repo; LibreOffice/OCR na imagem API.

### Qualidade (`qualidade-loft` → namespace `aiops-qualidade`)

- Front: SPA Vite + `react-router-dom`, páginas em `src/pages/`, guards `ProtectedRoute` / `PermissionRoute`.
- API: **FastAPI** com routers em `backend/app/routers/`; deps via **uv** (`pyproject.toml` + `uv.lock`).
- Domínio: base de conhecimento, Confluence, chat AI, surveys, analytics admin.
- Auth: JumpCloud OAuth em `/api/auth`.

### Olivelas Carteiras (`aiops-loft-carteira` → `aiops-loft-carteiras`)

- Front: TanStack Start; rotas autenticadas em `src/routes/_authenticated/`; webhooks Slack/WhatsApp sob `src/routes/api/public/`.
- API: Flask blueprints `auth` (`/auth/v1`), `iam`, `integrations`, `public` (`/public/v1`), `rest` (`/rest/v1`).
- Extra: `front_slack/` para superfície Slack.

### AVA (`ava-prod`)

- **Sem front web.** Bot Slack Bolt em Socket Mode (`app.py`).
- Deps: `slack-bolt`, `apscheduler`, `psycopg`, **uv**; package name `brilhou-bot`.
- Comandos: `/brilhou`, `/evoluir`, `/histórico`, `/avaliar` (SCIM).
- HTTP só `GET /health` :8080; namespace `ava-prod`; Vault `ai-ops/ava-prod/secrets`; **1 réplica**.
- Doc dedicada: [ava-prod.md](ava-prod.md). Produção separada de `Bot-AVA` (ADR-002 no repo).

## Convenções de naming

| Conceito | Exemplos |
| --- | --- |
| Repo GitHub | `aiops-dataforge`, `qualidade-loft`, `aiops-loft-carteira`, `ava-prod` |
| Namespace k8s | `aiops-dataforge`, `aiops-qualidade`, `aiops-loft-carteiras`, `ava-prod` |
| Product (deploy/Vault) | `ai-ops` |
| Squad (`values.team`) | `squad-ai-ops` ou `squad-infosec` |

## Relacionados

- [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [routes.md](routes.md) · [security.md](security.md) · [ava-prod.md](ava-prod.md)
- Infra: [../loft-infra/overview.md](../loft-infra/overview.md)
