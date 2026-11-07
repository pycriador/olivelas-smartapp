---
id: REF-OLIVELAS-APPS-011
title: "Olivelas Carteiras — IAM and integrations"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Olivelas Carteiras

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/loft-carteiras.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

**As-is** documentation for [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) (namespace `aiops-loft-carteiras`) — **level 2**.

## Goal

Web app for **IAM**, **integrations** (Slack/WhatsApp webhooks), public and authenticated REST APIs — Olivelas carteiras domain.

## Context

TanStack Start + Flask monorepo. Authenticated routes in `src/routes/_authenticated/`; webhooks in `src/routes/api/public/`. Extra: `front_slack/`. Evidence: [overview.md](overview.md#loft-carteiras-aiops-loft-carteira--aiops-loft-carteiras).

## Users / areas

| User / area | Need |
| --- | --- |
| Carteiras / operations | IAM, messaging integrations |
| External systems | `/public/v1`, `/rest/v1` APIs — **Inferred** |

## Impact

Outage affects IAM and carteiras integrations. SLOs: **Unknown**.

## Architecture overview

Repo: [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira).

```text
Browser / Webhooks → aiops-loft-carteiras.loft-corp.com.br
                  → TanStack Start (front + public API routes)
                  → Flask — auth/v1, iam, integrations, public/v1, rest/v1
                  → PostgreSQL
                  → front_slack/ (Slack surface)
```

| Layer | Detail |
| --- | --- |
| Front | TanStack Start, `_authenticated` layout |
| API | Flask blueprints IAM, integrations, public REST |
| Extra | `front_slack/`, `Dockerfile.front` |

## Main integrations

| Integration | Role |
| --- | --- |
| PostgreSQL | Flask-SQLAlchemy |
| Slack / WhatsApp | Public webhooks |
| Kong / Vault / Datadog | Olivelas standard |

## Stack (summary)

| Layer | Technology |
| --- | --- |
| Frontend | TanStack Start, TanStack Query |
| Backend | Flask 3, Gunicorn, bcrypt |
| Front package | `tanstack_start_ts` |

Matrices: [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [routes.md](routes.md).

## Level 3 — technical documentation

Repo: [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira).

| Topic | Link |
| --- | --- |
| README | [README](https://github.com/loft-br/aiops-loft-carteira/blob/main/README.md) |
| Backend | [backend/](https://github.com/loft-br/aiops-loft-carteira/tree/main/backend) |
| front_slack | [front_slack/](https://github.com/loft-br/aiops-loft-carteira/tree/main/front_slack) |

## Deploy

| Field | Value |
| --- | --- |
| k8s namespace | `aiops-loft-carteiras` |
| Corp URL | `aiops-loft-carteiras.loft-corp.com.br` |
| `product` | `ai-ops` |

## Security (summary)

Flask-JWT-Extended; IAM permissions on front. Detail: [security.md](security.md).

## Related

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [overview.md](overview.md)
