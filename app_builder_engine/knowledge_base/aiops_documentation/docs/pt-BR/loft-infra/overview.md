# Visão geral — publicação de apps Olivelas

> Language: pt-BR | [English (EN)](../../en/loft-infra/overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Fluxo ponta a ponta

```text
Developer push (main) / workflow_dispatch
        │
        ▼
┌───────────────────────────────────────┐
│  App repo (.github/workflows)         │
│  loft-br/actions/deploy               │
│  • build Docker (linux/arm64)         │
│  • push ECR (conta cross)             │
│  • atualiza tag em k8s-apps           │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│  loft-br/k8s-apps                     │
│  Application (Argo CD)                │
│  chart web-server + values.yaml       │
│  vaultSecrets → VaultStaticSecret     │
│  Ingress className: kong              │
└───────────────────┬───────────────────┘
                    │ host interno
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
│  CNAME *.loft-corp.com.br             │
│  → kong-{corp|external}.              │
│    infrastructure.loft-prod.io        │
└───────────────────────────────────────┘

Secrets: Vault (mount cross) ← scripts/UI → lido via application.vaultSecrets
```

## Papel de cada camada

| Camada | O que controla | Fonte observada |
| --- | --- | --- |
| App repo | Código, Dockerfile, path filters do workflow, `build-args`, scripts Vault | `aiops-dataforge` workflows / `scripts/vault` |
| Action `deploy` | Build/push ECR + commit/atualização no `k8s-apps` | Inputs em workflows; implementação em `loft-br/actions` |
| `k8s-apps` | Réplicas, probes, resources, Vault path, ingress Kong, HPA | `clusters/cross-prod/deployments/…/values.yaml` |
| Argo CD Application | Liga chart `web-server` + base values + app values ao namespace | `clusters/cross-prod/applications/aiops-*.yaml` |
| Kong | Hostname público na config de gateway, methods, timeouts, plugins | `gateways/infra-prod/…` |
| `infra-live` | DNS Route53 CNAME do host corp/external para o LB Kong | `…/route53/records/loft-corp.com.br/` |
| Vault | KV secrets (mount `cross`) | UI + `live/vault/production/engines/cross` |

## Layout típico do repositório de app

Nos quatro apps de referência o padrão dominante é monorepo **front na raiz + API em `backend/`**:

| Path | Uso |
| --- | --- |
| `Dockerfile` | Imagem do frontend (quando existe na raiz) |
| `backend/Dockerfile` | Imagem da API |
| `.github/workflows/prod-k8s-deployment-front.yml` | Deploy do front |
| `.github/workflows/prod-k8s-deployment-api.yml` | Deploy da API |
| `deploy/k8s/<service>/` | Paths que disparam redeploy quando alterados (mirror/local; SoT de runtime é `k8s-apps`) |

Exceção observada: [aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) tem `backend/Dockerfile` no tree principal; o front correspondente existe como deployment `aiops-loft-carteiras-front` em `k8s-apps` (imagem ECR dedicada).

## Convenção de nomes

| Conceito | Exemplo (DataForge) |
| --- | --- |
| Namespace Kubernetes | `aiops-dataforge` |
| Service front | `aiops-dataforge-front` |
| Service API | `aiops-dataforge-api` |
| Host interno (Kong upstream) | `aiops-dataforge-front.cross.loft-prod.io` |
| Host corp (usuários) | `aiops-dataforge.loft-corp.com.br` |
| Host API corp | `aiops-dataforge-api.loft-corp.com.br` |
| Product (action / Vault) | `ai-ops` |
| AWS account (action) | `cross` |
| Team label (`values`) | `squad-ai-ops` ou `squad-infosec` (varia por app) |

## Relação com docs genéricos

- Metodologia de deploy deste padrão: [../templates/deployment.md](../templates/deployment.md) (template).
- Esta pasta descreve a **implementação Olivelas atual** para Olivelas em `cross-prod`, não o template genérico.
