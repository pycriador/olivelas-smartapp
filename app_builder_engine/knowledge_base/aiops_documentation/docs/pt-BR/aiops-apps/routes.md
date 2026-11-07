# Rotas comuns — API e frontend

> Language: pt-BR | [English (EN)](../../en/aiops-apps/routes.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

Rotas **observadas** nos repositórios de referência. Não é um OpenAPI unificado — cada app tem o seu contrato.

## Padrões transversais

| Padrão | Exemplos |
| --- | --- |
| Prefixo API REST | `/api/...` (DataForge, Deep Insight, Qualidade) |
| Prefixo estilo Supabase/legacy | `/auth/v1`, `/rest/v1`, `/public/v1` (Carteiras) |
| Health | `/health` e/ou `/api/health` (AVA: só `/health`) |
| Auth session | `/api/auth/login`, `/refresh`, `/logout`, `/me` |
| Front login | `/login` |
| Front SSO callback | `/auth/callback` (Qualidade) |
| Slack slash (AVA) | `/brilhou`, `/evoluir`, `/histórico`, `/avaliar` |

---

## DataForge — API (Flask blueprints)

| Prefix / área | Exemplos de endpoints |
| --- | --- |
| `/api/auth` | `POST /login`, `POST /refresh`, `POST /logout`, `GET/PATCH /me`, `POST /service-account` |
| `/api/admin` | `CRUD /users`, `/groups`, … |
| `/api/projects` | CRUD projetos; `/files`, uploads |
| `/api/storage` | configs de storage |
| `/api/...` catalog | `/external-outputs`, `/dictionaries`, `/comparisons`, … |
| `/api/tokens`, `/api/v1/tokens` | API tokens |
| `/api/service-accounts` | service accounts |
| `/api/v1/imports/*` | validate, suggest-policies |
| `/`, `/health`, `/api/health` | status / probes |

Front (TanStack file routes) espelha o domínio: `projects.*`, `data-comparison.*`, `data-reconciliation.*`, `dictionaries.*`, `admin.*`, `employees.*`, `login`.

---

## Deep Insight — API

| Prefix | Conteúdo |
| --- | --- |
| `/api/health` | Health + DB + knowledge schema |
| `/api/*` | API principal (`api_bp`, extensions, schedules) |
| `/api/knowledge` | Knowledge base |
| `/api/prompts` | Prompts |
| `/api/conversations` | Conversas |
| `/api/ai` | Skills + governance |
| `/external/*` | Superfície external |
| `/` | Status page HTML |

Front: `src/App.tsx` + proxy Node em `server/` para `/api` (e related) no SSR.

---

## Qualidade — API (FastAPI routers)

| Router prefix | Papel |
| --- | --- |
| `/api/auth` | JumpCloud OAuth, tokens, perfil |
| `/api/users` | Usuários |
| `/api/access_groups` (via router) | Grupos de acesso |
| `/api/content` | Conteúdo KB |
| `/api/chat` | Chat AI |
| `/api/confluence` | Confluence |
| `/api/...` | analytics, surveys, announcements, presence, permissions |
| `/health`, `/api/health` | Liveness |
| `/health/db`, `/api/health/db` | DB check |

Front (react-router):

| Path | Página |
| --- | --- |
| `/login`, `/auth/callback` | Auth |
| `/`, `/categoria/:idSlug`, `/artigo/:idSlug` | KB |
| `/busca`, `/chat-ai`, `/mais-acessados` | Discovery / AI |
| `/settings`, `/admin/analytics` | Settings / admin (com `PermissionRoute`) |

---

## Olivelas Carteiras — API

| Prefix | Exemplos |
| --- | --- |
| `/auth/v1` | `POST /signup`, `POST /token`, `GET/PATCH /user`, `POST /logout` |
| `/public/v1` | ` /hooks/<path_token>`, health do webhook |
| `/rest/v1` | `POST /rpc/has_role` |
| `/health` | Probe |
| IAM / integrations | blueprints dedicados |

Front autenticado (`_authenticated`): `/dashboard`, `/portfolio`, `/consultants`, `/import`, `/bot`, `/settings.*`.

Rotas “edge” no Start: `src/routes/api/public/slack.*`, `whatsapp.webhook.ts`.

---

## AVA — comandos Slack ([ava-prod](https://github.com/loft-br/ava-prod))

Não há rotas REST de domínio. Entrada = slash commands via Socket Mode:

| Comando | Comportamento |
| --- | --- |
| `/brilhou` | Reconhecimento; card no canal + DM; 2 registros Postgres |
| `/evoluir` | Feedback; DM opcional; 2 registros |
| `/histórico` | Ephemeral — só o próprio histórico |
| `/avaliar` | Só líderes (SCIM); resultado nunca ao liderado |
| `GET /health` | Única rota HTTP (probes k8s :8080) |

Desativados: `/avaliacao`, `/historico-time`. Detalhes: [ava-prod.md](ava-prod.md).

---

## Como o front chama a API

| App | Padrão observado |
| --- | --- |
| DataForge | `VITE_API_URL` bakeada no build → host corp da API |
| Deep Insight | `VITE_API_BASE_URL` ou proxy same-origin via `server/` |
| Qualidade | `VITE_API_URL` / runtime `BACKEND_URL` → muitas vezes host **interno** `.cross.loft-prod.io` |
| Carteiras | clients em `src/lib/api/*` (`client.ts`, `auth.ts`, `iam.ts`) |
| AVA | N/A — Slack invoca o bot; sem browser→API |

Clients tipicamente centralizam base URL, headers `Authorization` e tratamento 401 → login.

## Relacionados

- [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [security.md](security.md) · [ava-prod.md](ava-prod.md)
