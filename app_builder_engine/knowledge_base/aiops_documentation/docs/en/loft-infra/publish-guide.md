# Publish guide — Olivelas apps on Olivelas infra

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/publish-guide.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Operational runbook to publish (or re-publish) an Olivelas app on the current model: GitHub Actions → ECR → `k8s-apps` → Kong → DNS → Vault → CORS.

Topic deep-dives: [overview.md](overview.md), [github-actions-deploy.md](github-actions-deploy.md), [dockerfiles.md](dockerfiles.md), [vault-secrets.md](vault-secrets.md), [k8s-apps.md](k8s-apps.md), [kong-gateway.md](kong-gateway.md), [infra-live-route53.md](infra-live-route53.md).

**Copy-paste examples:** [examples/](examples/README.md)  
**Short checklist:** [checklist-novo-servico.md](checklist-novo-servico.md)

**Reference adopters:** [aiops-dataforge](https://github.com/loft-br/aiops-dataforge), [aiops-central](https://github.com/loft-br/aiops-central).

## Who needs what

| Layout | Workflows | Dockerfiles |
| --- | --- | --- |
| Front + API | front + api | Root `Dockerfile` + `backend/Dockerfile` |
| Front only | front only | Root `Dockerfile` |
| API only | api only | Root `Dockerfile` **or** `backend/Dockerfile` (fix workflow `context` / `dockerfile`) |

## Naming (Olivelas / Cross)

| Field | Typical value |
| --- | --- |
| Namespace | `aiops-<product>` |
| Front component | `aiops-<product>-front` |
| API component | `aiops-<product>-api` |
| `aws-account` | `cross` |
| `product` | `ai-ops` (required on `cross`) |
| GHA environment | `production` |
| EKS tree | `clusters/cross-prod/` |
| Internal host | `<service>.cross.loft-prod.io` |
| Corp front host | `<app>.loft-corp.com.br` |
| Corp API host | `<api-name>.loft-corp.com.br` |
| Runner / platform | `ubuntu-arm` / `linux/arm64` |
| Action | `loft-br/actions/deploy@deploy/v1.8.0` |
| Secret | `${{ secrets.GIT_HUB_TOKEN }}` (org; ≠ `GITHUB_TOKEN`) |

Keep a `deploy/published-hosts.env` in the app ([example](examples/published-hosts.env.example)).

## Recommended order

```text
1. GHA workflows (+ published-hosts.env)
2. Dockerfiles + /health
3. Vault KV (Cross) + secret push
4. k8s-apps PR (values + Application) — peer approval
5. kong-configs PR (corp front + external API)
6. DNS: corp often auto-sync; external via infra-live
7. CORS / front bake → redeploy
8. End-to-end validation + JumpCloud (Infosec)
```

Datadog observability: sibling pack [../loft-observability/README.md](../loft-observability/README.md).

---

## Step 1 — GitHub Actions workflows

Typical files:

- `.github/workflows/prod-k8s-deployment-front.yml`
- `.github/workflows/prod-k8s-deployment-api.yml`

Examples: [prod-k8s-deployment-front.yml.example](examples/prod-k8s-deployment-front.yml.example), [prod-k8s-deployment-api.yml.example](examples/prod-k8s-deployment-api.yml.example).

Minimal shape:

```yaml
runs-on: ubuntu-arm
environment: production
permissions:
  id-token: write
  contents: read

# steps:
#   - uses: actions/checkout@v6   # Node.js 24
# loft-br/actions/deploy@deploy/v1.8.0
# with:
#   aws-account: cross
#   product: ai-ops
#   github-token: ${{ secrets.GIT_HUB_TOKEN }}
#   platforms: linux/arm64
```

Front: `dockerfile: Dockerfile` + API URL `build-args`.  
API: `context: backend` + `dockerfile: backend/Dockerfile` when using a `backend/` layout.

Details: [github-actions-deploy.md](github-actions-deploy.md).

---

## Step 2 — Dockerfiles

Goals: multi-stage, non-root user, `EXPOSE`/`PORT`, `HEALTHCHECK` aligned to `/health`, no secrets in layers.

Examples: [Dockerfile.front.example](examples/Dockerfile.front.example), [Dockerfile.api.example](examples/Dockerfile.api.example), [docker-entrypoint.sh.example](examples/docker-entrypoint.sh.example).

Details: [dockerfiles.md](dockerfiles.md).

---

## Step 3 — Vault (Cross Prod)

```sh
export VAULT_ADDR=https://vault.loft-corp.com.br
vault login   # UI token
```

| Component | Mount | Typical path |
| --- | --- | --- |
| API | `cross` | `ai-ops/<api-name>` |
| Front | `cross` | `ai-ops/<front-name>` |

In `k8s-apps`, `application.vaultSecrets` uses `mount: cross` + `path: ai-ops/<name>` (**no** `cross/` prefix on the path).

Push stub: [push_secrets.py.example](examples/push_secrets.py.example).  
Never commit secret `.env` files; never log tokens/PII.

Details: [vault-secrets.md](vault-secrets.md).

---

## Step 4 — k8s-apps

Open a PR on [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) (peer approval required).

```text
clusters/cross-prod/deployments/<namespace>/<front-name>/values.yaml
clusters/cross-prod/deployments/<namespace>/<api-name>/values.yaml
clusters/cross-prod/applications/<namespace>.yaml
```

Examples: [k8s-apps-front.values.yaml.example](examples/k8s-apps-front.values.yaml.example), [k8s-apps-api.values.yaml.example](examples/k8s-apps-api.values.yaml.example), [k8s-apps-application.yaml.example](examples/k8s-apps-application.yaml.example).

Details: [k8s-apps.md](k8s-apps.md).

---

## Step 5 — Kong + DNS

### Source of truth

| Layer | Repository |
| --- | --- |
| Route + service | **`kong-configs`** `gateways/infra-prod/{corp\|external}/cross/` |
| Route53 DNS | **`infra-live`** (external; corp often automatic) |
| App working copies | optional `deploy/kong/`, `deploy/dns/` |

### Gateways

| Gateway | Use | Requirements |
| --- | --- | --- |
| **corp** | Front `*.loft-corp.com.br` | Netskope egress + **JumpCloud** (ALB/Cognito) |
| **external** | API `*-api.loft-corp.com.br` | `ip-restriction` plugin (Netskope) |

**Do not** put the SPA API on **kong-corp**: Cognito `302` on CORS `OPTIONS` breaks the browser. DataForge/Central pattern: corp front, external API.

Canonical DataForge references:

- [aiops-dataforge-front-route](https://github.com/loft-br/kong-configs/blob/main/gateways/infra-prod/corp/cross/routes/aiops-dataforge-front-route.yaml)
- [aiops-dataforge-front-service](https://github.com/loft-br/kong-configs/blob/main/gateways/infra-prod/corp/cross/services/aiops-dataforge-front-service.yaml)

Templates: [kong-front-*.example](examples/), [kong-api-*.example](examples/).

### DNS

- **corp** routes: after merge under `gateways/*/corp/**`, `sync-loft-corp-route53-records` often creates `*.loft-corp.com.br` (and Cognito callbacks).
- **external** routes: manual `infra-live` record with `kong_accessibility = external` ([dns-api.terragrunt.hcl.example](examples/dns-api.terragrunt.hcl.example)).
- Never local `terragrunt apply` — Terrateam/Atlantis only.

### Human access

Users need Netskope egress + JumpCloud/corp access via Infosec at [central.olivelas.com.br](https://central.olivelas.com.br).

Details: [kong-gateway.md](kong-gateway.md), [infra-live-route53.md](infra-live-route53.md).

---

## Step 6 — Validation and common failures

Safe order: merge k8s-apps → kong-configs → apply external DNS → run GHA deploys → Vault/CORS → smoke HTTPS (corp front needs JumpCloud).

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| `ImagePullBackOff` / `bootstrap` | GHA deploy not run | Trigger workflows; check ECR |
| CrashLoop / missing secret | Wrong Vault path | Align `vaultSecrets.path`; re-push; restart |
| Probe failing | Wrong port/path | API `8000` `/health`; front `8080` `/health` |
| DNS OK, Kong 404/502 | Bad route/upstream | Confirm kong-configs + `*.cross.loft-prod.io` |
| API DNS → `kong-internal` | Missing external record | `infra-live` with `kong_accessibility=external` |
| CORS / OPTIONS 302 | API behind kong-corp | Move API to **external** |
| User cannot open corp URL | No JumpCloud / Netskope | Infosec / Central |

---

## Step 7 — CORS and host cutover

1. Set Vault `CORS_ORIGINS` — [cors-origins.env.example](examples/cors-origins.env.example).
2. Front bake (`VITE_API_URL` / `FRONT_BAKE_API_URL`) points at a browser-reachable API (usually `CORP_API_URL`).
3. Bake change → **front redeploy**. `CORS_ORIGINS` change → **API restart/rollout**.
4. Optional Kong `cors` plugin on the API route does not replace app-level `CORS_ORIGINS` if the API already handles CORS.

Rules: exact origins, no trailing slash, prefer `https`.

---

## Where to open PRs

| Work | Repo |
| --- | --- |
| App (workflows, Docker, local `.env`) | product repo |
| Helm / Argo | `loft-br/k8s-apps` |
| Kong YAML | `loft-br/kong-configs` |
| External DNS | `loft-br/infra-live` |

Never hand-edit generated Kong artifacts under `k8s-apps/.../kong-corp/kong.yaml`.
