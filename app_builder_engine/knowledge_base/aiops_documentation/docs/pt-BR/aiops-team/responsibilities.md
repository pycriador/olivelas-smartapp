---
id: REF-OLIVELAS-TEAM-004
title: "Olivelas — Responsabilidades"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Responsabilidades

> Language: pt-BR | [English (EN)](../../en/aiops-team/responsibilities.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Responsabilidades do **time Olivelas** sobre produtos, plataforma e documentação. Detalhe por componente segue o template [component.md](../templates/component.md).

## Responsabilidades (Confirmed / Inferred)

| Área | Responsabilidade | Classificação |
| --- | --- | --- |
| Produtos Olivelas | Desenvolver, operar e evoluir apps listados em [applications.md](applications.md) | **Inferred** (evidência: repos `loft-br/aiops-*`) |
| Publicação Olivelas | Workflows GitHub Actions, manifests k8s-apps, Kong, DNS, Vault para namespace `ai-ops` | **Confirmed** — [../loft-infra/overview.md](../loft-infra/overview.md) |
| Observabilidade | Instrumentação Datadog, logs estruturados, dashboards e alertas dos serviços Olivelas | **Confirmed** — [../loft-observability/README.md](../loft-observability/README.md) |
| Documentação as-is | Manter packs `aiops-team`, `aiops-apps`, `loft-infra`, `loft-observability` neste repo | **Confirmed** |
| Segurança de apps | AuthN/Z, secrets via Vault, headers e CORS conforme [../aiops-apps/security.md](../aiops-apps/security.md) | **Confirmed** |

## Fora de escopo (non-responsibilities)

| Área | Motivo |
| --- | --- |
| Plataforma PHP legada Olivelas | Stack diferente — não é escopo dos repos Olivelas catalogados |
| Infra AWS/EKS compartilhada | Mantida por plataforma (`loft-infra-cloud`); Olivelas consome via k8s-apps |
| Metodologia de documentação org-wide | Este repo **define** o padrão; adoção é responsabilidade de cada squad |

## Matriz por app

Ownership fino por produto: **Unknown** até preenchimento humano. Links de produto: [applications.md](applications.md).

## Relacionados

- [who-we-are.md](who-we-are.md)
- [technical-standards.md](technical-standards.md)
- [../ownership.md](../ownership.md)
