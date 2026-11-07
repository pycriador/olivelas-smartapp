---
id: REF-OLIVELAS-TEAM-006
title: "Olivelas — Stacks in use"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Stacks in use

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/stacks.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Summary of stacks in the Olivelas catalog. **Full detail:** [../aiops-apps/README.md](../aiops-apps/README.md).

## Frontend (web apps)

| Capability | Observed pattern |
| --- | --- |
| Runtime | React 19 + TypeScript |
| Bundler | Vite |
| Routing | TanStack Router (DataForge, Carteiras) or react-router-dom (Qualidade, Deep Insight) |
| Data fetching | TanStack Query (most apps) |
| UI | Radix + shadcn-style, Tailwind v4 |
| Forms | react-hook-form + zod |

**Exception:** AVA has no web front — UI is Slack.

## Backend

| Capability | Apps |
| --- | --- |
| Flask + Gunicorn | DataForge, Deep Insight, Olivelas Carteiras |
| FastAPI + uvicorn | Qualidade |
| slack-bolt (Socket Mode) | AVA |
| PostgreSQL | All (RDS) |

## Infra and deploy

| Layer | Olivelas pattern |
| --- | --- |
| CI/CD | GitHub Actions + `loft-br/actions/deploy@deploy/v1.8.0` |
| Runtime | EKS (`cross`), `linux/arm64` |
| Ingress | Kong corp |
| Secrets | Vault (`product: ai-ops`) |
| Observability | Datadog (node agent + APM/logs) |

Detail: [../loft-infra/overview.md](../loft-infra/overview.md) · [../loft-observability/README.md](../loft-observability/README.md).

## Related

- [../aiops-apps/frontend-stack.md](../aiops-apps/frontend-stack.md)
- [../aiops-apps/backend-stack.md](../aiops-apps/backend-stack.md)
- [technical-standards.md](technical-standards.md)
