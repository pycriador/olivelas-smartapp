# Examples — Loft infra publish (copy into app / platform PRs)

> Language: EN | [Português (pt-BR)](../../../pt-BR/loft-infra/examples/README.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Templates with the **minimum** needed to publish an AIOps app on Loft EKS (`cross` / `ai-ops` / `linux/arm64`).  
Not every repo has both front and API — copy only what applies.

**Full walkthrough:** [../publish-guide.md](../publish-guide.md)  
**Checklist:** [../checklist-novo-servico.md](../checklist-novo-servico.md)

| Example | Copy to (typical) | When |
| --- | --- | --- |
| [prod-k8s-deployment-front.yml.example](prod-k8s-deployment-front.yml.example) | `.github/workflows/prod-k8s-deployment-front.yml` | Node/Vite (or similar) front |
| [prod-k8s-deployment-api.yml.example](prod-k8s-deployment-api.yml.example) | `.github/workflows/prod-k8s-deployment-api.yml` | Python/FastAPI (or similar) API |
| [Dockerfile.front.example](Dockerfile.front.example) | `Dockerfile` (repo root) | Front image |
| [docker-entrypoint.sh.example](docker-entrypoint.sh.example) | `docker/entrypoint.sh` | Front entrypoint |
| [Dockerfile.api.example](Dockerfile.api.example) | `backend/Dockerfile` or root `Dockerfile` | API image |
| [published-hosts.env.example](published-hosts.env.example) | `deploy/published-hosts.env` | Single source for corp/Cross URLs |
| [push_secrets.py.example](push_secrets.py.example) | `scripts/vault/push_secrets.py` (stub) | Push local `.env` → Vault Cross |
| [k8s-apps-api.values.yaml.example](k8s-apps-api.values.yaml.example) | `k8s-apps` `…/values.yaml` | API Helm values |
| [k8s-apps-front.values.yaml.example](k8s-apps-front.values.yaml.example) | same tree, front component | Front Helm values |
| [k8s-apps-application.yaml.example](k8s-apps-application.yaml.example) | `k8s-apps` `…/applications/<ns>.yaml` | Argo CD Application |
| [kong-front-route.yaml.example](kong-front-route.yaml.example) / [kong-front-service.yaml.example](kong-front-service.yaml.example) | `kong-configs` corp | Front exposure |
| [kong-api-route.yaml.example](kong-api-route.yaml.example) / [kong-api-service.yaml.example](kong-api-service.yaml.example) | `kong-configs` external | API + Netskope `ip-restriction` |
| [dns-corp.terragrunt.hcl.example](dns-corp.terragrunt.hcl.example) / [dns-api.terragrunt.hcl.example](dns-api.terragrunt.hcl.example) | `infra-live` Route53 | Corp / external CNAMEs |
| [cors-origins.env.example](cors-origins.env.example) | Vault `CORS_ORIGINS` / `backend/.env` | Published front origins |

## Placeholders

| Placeholder | Example |
| --- | --- |
| `<namespace>` | `aiops-dataforge`, `aiops-central` |
| `<front-name>` | `aiops-dataforge-front` |
| `<api-name>` | `aiops-dataforge-api` |
| `<app>` | public corp label without `-front` (e.g. `aiops-dataforge`) |
| `<squad>` | Kong tag, e.g. `squad-ai` |

## Reference adopters

- [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge)
- [loft-br/aiops-central](https://github.com/loft-br/aiops-central) (publish runbook that seeded this pack)
