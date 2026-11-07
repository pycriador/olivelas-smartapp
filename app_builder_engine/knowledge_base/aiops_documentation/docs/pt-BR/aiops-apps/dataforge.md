---
id: REF-OLIVELAS-APPS-008
title: "DataForge — plataforma de projetos e dados"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# DataForge

> Language: pt-BR | [English (EN)](../../en/aiops-apps/dataforge.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

> Prefere uma explicação em linguagem simples? Veja o [Guia](dataforge-guia.md).

Documentação **as-is** de [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge) — **nível 2** do catálogo Olivelas.

## Objetivo

Plataforma web para gestão de **projetos**, **arquivos**, comparação/reconciliação de dados, dicionários e **service accounts** — uso interno corp.

## Contexto

Monorepo **app web** padrão Olivelas: front TanStack Start na raiz + API Flask em `backend/`. Evidência: [overview.md](overview.md#dataforge-aiops-dataforge).

## Usuários / áreas

| Usuário / área | Necessidade |
| --- | --- |
| Squads internas Olivelas | Projetos de dados, upload e reconciliação |
| Admins | Service accounts, administração — **Inferred** |

## Impacto

Indisponibilidade bloqueia fluxos de projeto/dados no corp front. SLOs formais: **Unknown**.

## Visão geral da arquitetura

Repo: [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge).

```text
Browser → aiops-dataforge.loft-corp.com.br (Kong)
       → Front TanStack Start (Vite/React)
       → API Flask (Gunicorn) — blueprints auth, projects, admin, …
       → PostgreSQL (RDS)
```

| Camada | Detalhe |
| --- | --- |
| Front | `@tanstack/react-start`, file routes `src/routes/*.tsx` |
| API | Flask blueprints em `backend/app/routes/` |
| Auth | Flask-JWT-Extended + API tokens |

## Principais integrações

| Integração | Papel |
| --- | --- |
| PostgreSQL | Persistência (Flask-SQLAlchemy, `psycopg`) |
| Kong corp | Ingress HTTPS |
| Vault | Secrets (`product: ai-ops`) |
| Datadog | Logs, métricas, APM |
| Google APIs | openpyxl / integrações em evidência no backend — ver repo |

## Stack (resumo)

| Camada | Tecnologia |
| --- | --- |
| Frontend | React, TanStack Router/Start, TanStack Query, Radix/shadcn, Tailwind v4 |
| Backend | Python 3.12, Flask 3, Gunicorn |
| Package front | `aiops-dataforge` |

Matrizes: [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [routes.md](routes.md) · [security.md](security.md).

## Nível 3 — documentação técnica

Repo: [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge).

| Tópico | Link | Status |
| --- | --- | --- |
| README (como executar) | [README](https://github.com/loft-br/aiops-dataforge/blob/main/README.md) | **Confirmed** — cobre execução, stack, API, deploy, segurança |
| Docs internas (índice) | [docs/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/docs/README.md) | **Confirmed** |
| Backend / API ref | [backend/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/backend/README.md) | **Confirmed** |
| Backend scripts | [backend/scripts/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/backend/scripts/README.md) | **Confirmed** |
| Deploy k8s values | [deploy/k8s/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/deploy/k8s/README.md) | **Confirmed** |
| Workflows CI/CD | [`.github/workflows/`](https://github.com/loft-br/aiops-dataforge/tree/main/.github/workflows) | **Confirmed** |
| Vault scripts | [`scripts/vault/`](https://github.com/loft-br/aiops-dataforge/tree/main/scripts/vault) | **Confirmed** |
| OpenAPI / contratos | [docs/pt-BR/contracts/rest-api.md](https://github.com/loft-br/aiops-dataforge/blob/main/docs/pt-BR/contracts/rest-api.md) | **Confirmed** |

Auditoria piloto nível 3: [examples/level3-readme-pilots/dataforge.md](../../../examples/level3-readme-pilots/dataforge.md).

Contrato nível 3 (seções esperadas): [../aiops-team/documentation-model.md](../aiops-team/documentation-model.md).

## Deploy

| Campo | Valor |
| --- | --- |
| Namespace k8s | `aiops-dataforge` |
| URL corp | `aiops-dataforge.loft-corp.com.br` |
| Pipelines | `prod-k8s-deployment-front.yml`, `prod-k8s-deployment-api.yml` |
| `product` | `ai-ops` |

Infra: [../loft-infra/publish-guide.md](../loft-infra/publish-guide.md).

## Segurança (resumo)

JWT access/refresh; cookies (DataForge); service accounts em `/api/tokens`. Detalhe: [security.md](security.md).

## Relacionados

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [overview.md](overview.md) · [ava-prod.md](ava-prod.md)
