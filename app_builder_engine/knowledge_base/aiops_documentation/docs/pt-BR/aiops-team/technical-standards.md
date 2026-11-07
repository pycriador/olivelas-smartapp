---
id: REF-OLIVELAS-TEAM-008
title: "Olivelas — Padrões técnicos"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Padrões técnicos

> Language: pt-BR | [English (EN)](../../en/aiops-team/technical-standards.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Pointers para padrões que o time Olivelas segue ao desenvolver e publicar serviços.

## Aplicação

| Tema | Referência |
| --- | --- |
| Organização monorepo | [../aiops-apps/overview.md](../aiops-apps/overview.md) |
| Rotas e health | [../aiops-apps/routes.md](../aiops-apps/routes.md) |
| Segurança de apps | [../aiops-apps/security.md](../aiops-apps/security.md) |
| APIs REST | Olivelas API plugin (paths em inglês, JSON, erros em inglês) |

## Infra e publicação

| Tema | Referência |
| --- | --- |
| Deploy EKS | [../loft-infra/github-actions-deploy.md](../loft-infra/github-actions-deploy.md) |
| Kubernetes manifests | [../loft-infra/k8s-apps.md](../loft-infra/k8s-apps.md) |
| Kong gateway | [../loft-infra/kong-gateway.md](../loft-infra/kong-gateway.md) |
| DNS | [../loft-infra/infra-live-route53.md](../loft-infra/infra-live-route53.md) |
| Vault secrets | [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md) |
| Novo serviço | [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md) |

## Convenções Olivelas (deploy)

| Campo | Valor típico |
| --- | --- |
| `aws-account` | `cross` |
| `product` | `ai-ops` |
| Runner | `ubuntu-arm` |
| `platforms` | `linux/arm64` |
| Deploy action | `loft-br/actions/deploy@deploy/v1.8.0` |
| Secret CI | `GIT_HUB_TOKEN` (org secret) |

## Documentação

| Tema | Referência |
| --- | --- |
| Padrão de docs | [../standards.md](../standards.md) |
| Duas superfícies (GitHub + Confluence) | [../publishing-surfaces.md](../publishing-surfaces.md) |
| Modelo 3 níveis Olivelas | [documentation-model.md](documentation-model.md) |

## Relacionados

- [stacks.md](stacks.md)
- [security.md](security.md)
- [observability.md](observability.md)
