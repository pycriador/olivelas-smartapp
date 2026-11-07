---
id: REF-AIOPS-APPS-011
title: "Loft Carteiras — IAM e integrações"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Loft Carteiras

> Language: pt-BR | [English (EN)](../../en/aiops-apps/loft-carteiras.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Documentação **as-is** de [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) (namespace `aiops-loft-carteiras`) — **nível 2**.

## Objetivo

App web para **IAM**, **integrações** (Slack/WhatsApp webhooks), APIs REST públicas e autenticadas — domínio carteiras Loft.

## Contexto

Monorepo TanStack Start + Flask. Rotas autenticadas em `src/routes/_authenticated/`; webhooks em `src/routes/api/public/`. Extra: `front_slack/`. Evidência: [overview.md](overview.md#loft-carteiras-aiops-loft-carteira--aiops-loft-carteiras).

## Usuários / áreas

| Usuário / área | Necessidade |
| --- | --- |
| Operações / carteiras | IAM, integrações messaging |
| Sistemas externos | APIs `/public/v1`, `/rest/v1` — **Inferred** |

## Impacto

Indisponibilidade afeta IAM e integrações de carteiras. SLOs: **Unknown**.

## Visão geral da arquitetura

Repo: [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira).

```text
Browser / Webhooks → aiops-loft-carteiras.loft-corp.com.br
                  → TanStack Start (front + API routes públicas)
                  → Flask — auth/v1, iam, integrations, public/v1, rest/v1
                  → PostgreSQL
                  → front_slack/ (superfície Slack)
```

| Camada | Detalhe |
| --- | --- |
| Front | TanStack Start, `_authenticated` layout |
| API | Flask blueprints IAM, integrations, public REST |
| Extra | `front_slack/`, `Dockerfile.front` |

## Principais integrações

| Integração | Papel |
| --- | --- |
| PostgreSQL | Flask-SQLAlchemy |
| Slack / WhatsApp | Webhooks públicos |
| Kong / Vault / Datadog | Padrão Loft |

## Stack (resumo)

| Camada | Tecnologia |
| --- | --- |
| Frontend | TanStack Start, TanStack Query |
| Backend | Flask 3, Gunicorn, bcrypt |
| Package front | `tanstack_start_ts` |

Matrizes: [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [routes.md](routes.md).

## Nível 3 — documentação técnica

Repo: [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira).

| Tópico | Link |
| --- | --- |
| README | [README](https://github.com/loft-br/aiops-loft-carteira/blob/main/README.md) |
| Backend | [backend/](https://github.com/loft-br/aiops-loft-carteira/tree/main/backend) |
| front_slack | [front_slack/](https://github.com/loft-br/aiops-loft-carteira/tree/main/front_slack) |

## Deploy

| Campo | Valor |
| --- | --- |
| Namespace k8s | `aiops-loft-carteiras` |
| URL corp | `aiops-loft-carteiras.loft-corp.com.br` |
| `product` | `ai-ops` |

## Segurança (resumo)

Flask-JWT-Extended; IAM permissions no front. Detalhe: [security.md](security.md).

## Relacionados

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [overview.md](overview.md)
