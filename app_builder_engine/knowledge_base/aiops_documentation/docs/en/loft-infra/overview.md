# Overview — publishing Olivelas apps

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## End-to-end flow

```text
Developer push (main) / workflow_dispatch
        │
        ▼
┌───────────────────────────────────────┐
│  App repo (.github/workflows)         │
│  loft-br/actions/deploy               │
│  • Docker build (linux/arm64)         │
│  • push ECR (cross account)           │
│  • update image tag in k8s-apps       │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│  loft-br/k8s-apps                     │
│  Argo CD Application                  │
│  web-server chart + values.yaml       │
│  vaultSecrets → VaultStaticSecret     │
│  Ingress className: kong              │
└───────────────────┬───────────────────┘
                    │ internal host
                    │ *.cross.loft-prod.io:443
                    ▼
┌───────────────────────────────────────┐
│  loft-br/kong-configs                 │
│  corp  → front  (*.loft-corp.com.br)  │
│  external → API (*.loft-corp.com.br)  │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│  loft-br/infra-live (Route53)         │
│  CNAME *.loft-corp.com.br → Kong LB   │
└───────────────────────────────────────┘
```

## Layer responsibilities

| Layer | Controls | Evidence |
| --- | --- | --- |
| App repo | Code, Dockerfile, workflow path filters, build-args, Vault scripts | `aiops-dataforge` |
| `deploy` action | ECR build/push + `k8s-apps` tag update | Workflow inputs; `loft-br/actions` |
| `k8s-apps` | Replicas, probes, resources, Vault, Kong ingress, HPA | `deployments/…/values.yaml` |
| Argo CD Application | Binds chart + base values + app values to a namespace | `applications/aiops-*.yaml` |
| Kong | Public hostname in gateway config, methods, timeouts, plugins | `gateways/infra-prod/…` |
| `infra-live` | Route53 CNAME to Kong LB | `…/records/loft-corp.com.br/` |
| Vault | KV secrets (mount `cross`) | UI + `live/vault/production/engines/cross` |

## Typical app layout

Dominant pattern across reference apps: **frontend at repo root + API under `backend/`**, with separate front/API deploy workflows.

Naming example (DataForge): namespace `aiops-dataforge`; services `*-front` / `*-api`; corp hosts `aiops-dataforge.loft-corp.com.br` and `aiops-dataforge-api.loft-corp.com.br`; upstream `*.cross.loft-prod.io`.
