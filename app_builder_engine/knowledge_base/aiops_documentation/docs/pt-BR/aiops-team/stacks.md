---
id: REF-OLIVELAS-TEAM-006
title: "Olivelas — Stacks utilizadas"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Stacks utilizadas

> Language: pt-BR | [English (EN)](../../en/aiops-team/stacks.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Resumo das stacks do catálogo Olivelas. **Detalhe completo:** [../aiops-apps/README.md](../aiops-apps/README.md).

## Frontend (apps web)

| Capacidade | Padrão observado |
| --- | --- |
| Runtime | React 19 + TypeScript |
| Bundler | Vite |
| Roteamento | TanStack Router (DataForge, Carteiras) ou react-router-dom (Qualidade, Deep Insight) |
| Data fetching | TanStack Query (maioria) |
| UI | Radix + shadcn-style, Tailwind v4 |
| Forms | react-hook-form + zod |

**Exceção:** AVA não tem front web — UI é Slack.

## Backend

| Capacidade | Apps |
| --- | --- |
| Flask + Gunicorn | DataForge, Deep Insight, Olivelas Carteiras |
| FastAPI + uvicorn | Qualidade |
| slack-bolt (Socket Mode) | AVA |
| PostgreSQL | Todos (RDS) |

## Infra e deploy

| Camada | Padrão Olivelas |
| --- | --- |
| CI/CD | GitHub Actions + `loft-br/actions/deploy@deploy/v1.8.0` |
| Runtime | EKS (`cross`), `linux/arm64` |
| Ingress | Kong corp |
| Secrets | Vault (`product: ai-ops`) |
| Observabilidade | Datadog (agent no node + APM/logs) |

Detalhe: [../loft-infra/overview.md](../loft-infra/overview.md) · [../loft-observability/README.md](../loft-observability/README.md).

## Relacionados

- [../aiops-apps/frontend-stack.md](../aiops-apps/frontend-stack.md)
- [../aiops-apps/backend-stack.md](../aiops-apps/backend-stack.md)
- [technical-standards.md](technical-standards.md)
