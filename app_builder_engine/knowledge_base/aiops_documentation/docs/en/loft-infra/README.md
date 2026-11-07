# Current Olivelas infra (Olivelas)

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/README.md)
>
> Status: ACCEPTED
>
> Authority: Verified
>
> Documentation Standard v1.0

**As-is** documentation of how Olivelas apps are published today: GitHub Actions → ECR → `k8s-apps` (Argo CD + `web-server` chart) → Kong → DNS (`infra-live`) + Vault secrets.

Frontend/backend **application stacks** (libs, routes, security): sibling pack [../aiops-apps/README.md](../aiops-apps/README.md).

This folder is separate from the generic documentation standard. Facts are grounded in reference repositories; gaps are marked `[pending: …]`.

## Evidence repositories

| Role | Repository |
| --- | --- |
| App (front + API) | [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge) |
| App (front + API) | [loft-br/aiops-central](https://github.com/loft-br/aiops-central) |
| App | [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight) |
| App | [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft) (`aiops-qualidade` in cluster) |
| App | [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) (`aiops-loft-carteiras` in cluster) |
| Kubernetes / Argo CD | [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) |
| Kong | [loft-br/kong-configs](https://github.com/loft-br/kong-configs) |
| Route53 / IaC | [loft-br/infra-live](https://github.com/loft-br/infra-live) |
| Deploy action | [loft-br/actions](https://github.com/loft-br/actions) |

## Documents in this pack

| Document | Content |
| --- | --- |
| [publish-guide.md](publish-guide.md) | **Full step-by-step** publish runbook (workflows → CORS) |
| [examples/](examples/README.md) | Copy-paste `.example` templates for new apps / PRs |
| [overview.md](overview.md) | End-to-end flow |
| [github-actions-deploy.md](github-actions-deploy.md) | Prod workflows and `deploy` action inputs |
| [k8s-apps.md](k8s-apps.md) | `cross-prod` layout, Argo CD Application, values |
| [kong-gateway.md](kong-gateway.md) | Corp front and external API routes/services |
| [infra-live-route53.md](infra-live-route53.md) | Route53 `loft-corp.com.br` records (CNAME → Kong) |
| [vault-secrets.md](vault-secrets.md) | Vault KV + `application.vaultSecrets` |
| [dockerfiles.md](dockerfiles.md) | Dockerfile patterns and examples |
| [checklist-novo-servico.md](checklist-novo-servico.md) | New-service checklist |

**Start here:** [publish-guide.md](publish-guide.md) + [examples/](examples/README.md).

**Observability (Datadog):** sibling pack [../loft-observability/README.md](../loft-observability/README.md).

## Scope

- Cluster **`cross-prod`**, AWS account **`cross`**, product **`ai-ops`**, runners **`ubuntu-arm`**, platform **`linux/arm64`**.
- Does not deep-dive the `web-server` chart internals or the full `deploy` action source.
- Secrets come from Vault (`application.vaultSecrets`); never from committed `.env` files.
