---
id: REF-AIOPS-TEAM-008
title: "AIOps — Technical standards"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Technical standards

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/technical-standards.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Pointers to standards the AIOps team follows when developing and publishing services.

## Application

| Topic | Reference |
| --- | --- |
| Monorepo organization | [../aiops-apps/overview.md](../aiops-apps/overview.md) |
| Routes and health | [../aiops-apps/routes.md](../aiops-apps/routes.md) |
| App security | [../aiops-apps/security.md](../aiops-apps/security.md) |
| REST APIs | Loft API plugin (English paths, JSON, English errors) |

## Infra and publish

| Topic | Reference |
| --- | --- |
| EKS deploy | [../loft-infra/github-actions-deploy.md](../loft-infra/github-actions-deploy.md) |
| Kubernetes manifests | [../loft-infra/k8s-apps.md](../loft-infra/k8s-apps.md) |
| Kong gateway | [../loft-infra/kong-gateway.md](../loft-infra/kong-gateway.md) |
| DNS | [../loft-infra/infra-live-route53.md](../loft-infra/infra-live-route53.md) |
| Vault secrets | [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md) |
| New service | [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md) |

## AIOps deploy conventions

| Field | Typical value |
| --- | --- |
| `aws-account` | `cross` |
| `product` | `ai-ops` |
| Runner | `ubuntu-arm` |
| `platforms` | `linux/arm64` |
| Deploy action | `loft-br/actions/deploy@deploy/v1.8.0` |
| CI secret | `GIT_HUB_TOKEN` (org secret) |

## Documentation

| Topic | Reference |
| --- | --- |
| Documentation standard | [../standards.md](../standards.md) |
| Dual surfaces (GitHub + Confluence) | [../publishing-surfaces.md](../publishing-surfaces.md) |
| AIOps 3-level model | [documentation-model.md](documentation-model.md) |

## Related

- [stacks.md](stacks.md)
- [security.md](security.md)
- [observability.md](observability.md)
