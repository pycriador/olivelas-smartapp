# Guia de publicação — apps AIOps na infra Loft

> Language: pt-BR | [English (EN)](../../en/loft-infra/publish-guide.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Runbook operacional para publicar (ou re-publicar) um app AIOps no modelo atual: GitHub Actions → ECR → `k8s-apps` → Kong → DNS → Vault → CORS.

Detalhes as-is por tópico: [overview.md](overview.md), [github-actions-deploy.md](github-actions-deploy.md), [dockerfiles.md](dockerfiles.md), [vault-secrets.md](vault-secrets.md), [k8s-apps.md](k8s-apps.md), [kong-gateway.md](kong-gateway.md), [infra-live-route53.md](infra-live-route53.md).

**Exemplos copiáveis:** [examples/](examples/README.md)  
**Checklist curto:** [checklist-novo-servico.md](checklist-novo-servico.md)

**Adopters de referência:** [aiops-dataforge](https://github.com/loft-br/aiops-dataforge), [aiops-central](https://github.com/loft-br/aiops-central).

## Quem precisa de quê

| Layout | Workflows | Dockerfiles |
| --- | --- | --- |
| Front + API | front + api | `Dockerfile` na raiz + `backend/Dockerfile` |
| Só front | só front | `Dockerfile` na raiz |
| Só API | só api | `Dockerfile` na raiz **ou** `backend/Dockerfile` (ajuste `context` / `dockerfile` no workflow) |

## Nomes (padrão AIOps / Cross)

| Campo | Valor típico |
| --- | --- |
| Namespace | `aiops-<produto>` |
| Componente front | `aiops-<produto>-front` |
| Componente API | `aiops-<produto>-api` |
| `aws-account` | `cross` |
| `product` | `ai-ops` (obrigatório em `cross`) |
| Environment GHA | `production` |
| Diretório EKS | `clusters/cross-prod/` |
| Host interno | `<service>.cross.loft-prod.io` |
| Host corp front | `<app>.loft-corp.com.br` |
| Host corp API | `<api-name>.loft-corp.com.br` |
| Runner / platform | `ubuntu-arm` / `linux/arm64` |
| Action | `loft-br/actions/deploy@deploy/v1.8.0` |
| Secret | `${{ secrets.GIT_HUB_TOKEN }}` (org; ≠ `GITHUB_TOKEN`) |

Convenção de URLs: manter um `deploy/published-hosts.env` no app ([exemplo](../../en/loft-infra/examples/published-hosts.env.example)).

## Ordem recomendada

```text
1. Workflows GHA (+ published-hosts.env)
2. Dockerfiles + /health
3. Vault KV (Cross) + push de secrets
4. PR em k8s-apps (values + Application) — aprovação de par
5. PR em kong-configs (corp front + external API)
6. DNS: corp costuma auto-sync; external via infra-live
7. CORS / bake front → redeploy
8. Validação end-to-end + JumpCloud (Infosec)
```

Observabilidade Datadog: pack [../loft-observability/README.md](../loft-observability/README.md).

---

## Passo 1 — Workflows GitHub Actions

Arquivos típicos:

- `.github/workflows/prod-k8s-deployment-front.yml`
- `.github/workflows/prod-k8s-deployment-api.yml`

Exemplos: [prod-k8s-deployment-front.yml.example](../../en/loft-infra/examples/prod-k8s-deployment-front.yml.example), [prod-k8s-deployment-api.yml.example](../../en/loft-infra/examples/prod-k8s-deployment-api.yml.example).

Forma mínima:

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

Front: `dockerfile: Dockerfile` + `build-args` com URL da API (`FRONT_BAKE_API_URL` / `VITE_API_URL`).  
API: `context: backend` + `dockerfile: backend/Dockerfile` quando o layout for `backend/`.

Detalhes: [github-actions-deploy.md](github-actions-deploy.md).

---

## Passo 2 — Dockerfiles

Objetivos: multi-stage, user non-root, `EXPOSE`/`PORT`, `HEALTHCHECK` alinhado a `/health`, sem secrets nas layers.

Exemplos: [Dockerfile.front.example](../../en/loft-infra/examples/Dockerfile.front.example), [Dockerfile.api.example](../../en/loft-infra/examples/Dockerfile.api.example), [docker-entrypoint.sh.example](../../en/loft-infra/examples/docker-entrypoint.sh.example).

Smoke local:

```sh
docker build -t <front-name>:local --build-arg VITE_API_URL=http://localhost:8000 .
docker run --rm -p 8080:8080 <front-name>:local
curl -sf http://127.0.0.1:8080/health

docker build -t <api-name>:local -f backend/Dockerfile backend
docker run --rm -p 8000:8000 --env-file backend/.env <api-name>:local
curl -sf http://127.0.0.1:8000/health
```

Detalhes: [dockerfiles.md](dockerfiles.md).

---

## Passo 3 — Vault (Cross Prod)

```sh
export VAULT_ADDR=https://vault.loft-corp.com.br
vault login   # token da UI
```

| Componente | Mount | Path típico |
| --- | --- | --- |
| API | `cross` | `ai-ops/<api-name>` |
| Front | `cross` | `ai-ops/<front-name>` |

No `k8s-apps`, `application.vaultSecrets` usa `mount: cross` + `path: ai-ops/<name>` (**sem** prefixo `cross/` no path).

Stub de push: [push_secrets.py.example](../../en/loft-infra/examples/push_secrets.py.example).  
Nunca versionar `.env` com secrets; nunca logar tokens/PII.

Detalhes: [vault-secrets.md](vault-secrets.md).

---

## Passo 4 — k8s-apps

Abrir PR em [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) (aprovação de par obrigatória).

```text
clusters/cross-prod/deployments/<namespace>/<front-name>/values.yaml
clusters/cross-prod/deployments/<namespace>/<api-name>/values.yaml
clusters/cross-prod/applications/<namespace>.yaml
```

Exemplos: [k8s-apps-front.values.yaml.example](../../en/loft-infra/examples/k8s-apps-front.values.yaml.example), [k8s-apps-api.values.yaml.example](../../en/loft-infra/examples/k8s-apps-api.values.yaml.example), [k8s-apps-application.yaml.example](../../en/loft-infra/examples/k8s-apps-application.yaml.example).

Checklist rápido:

- [ ] `cpuArchitecture: arm64`, probes `/health`, portas corretas
- [ ] `vaultSecrets` alinhado ao Vault
- [ ] `ingress.className: kong`
- [ ] Application multi-source + `CreateNamespace=true`
- [ ] Após merge: 1º deploy GHA substitui tag `bootstrap`

Detalhes: [k8s-apps.md](k8s-apps.md).

---

## Passo 5 — Kong + DNS

### Fonte da verdade (não misturar repos)

| Camada | Repositório |
| --- | --- |
| Route + service | **`kong-configs`** `gateways/infra-prod/{corp\|external}/cross/` |
| DNS Route53 | **`infra-live`** (external; corp frequentemente auto) |
| Espelho no app | opcional `deploy/kong/`, `deploy/dns/` |

### Gateways

| Gateway | Uso | Requisitos |
| --- | --- | --- |
| **corp** | Front `*.loft-corp.com.br` | Egress Netskope + auth **JumpCloud** (ALB/Cognito) |
| **external** | API `*-api.loft-corp.com.br` | Plugin `ip-restriction` (Netskope) |

**Não** colocar a API do SPA no **kong-corp**: o ALB responde `302` Cognito no preflight `OPTIONS` e o browser quebra com “Redirect is not allowed for a preflight request”. Padrão DataForge/Central: front corp, API external.

Exemplos canônicos de referência:

- [aiops-dataforge-front-route](https://github.com/loft-br/kong-configs/blob/main/gateways/infra-prod/corp/cross/routes/aiops-dataforge-front-route.yaml)
- [aiops-dataforge-front-service](https://github.com/loft-br/kong-configs/blob/main/gateways/infra-prod/corp/cross/services/aiops-dataforge-front-service.yaml)

Templates: [kong-front-*.example](../../en/loft-infra/examples/), [kong-api-*.example](../../en/loft-infra/examples/).

### DNS

- Rotas **corp**: após merge em `gateways/*/corp/**`, o workflow `sync-loft-corp-route53-records` costuma criar o record `*.loft-corp.com.br` (e callbacks Cognito).
- Rotas **external**: record manual em `infra-live` com `kong_accessibility = external` ([dns-api.terragrunt.hcl.example](../../en/loft-infra/examples/dns-api.terragrunt.hcl.example)).
- Nunca `terragrunt apply` local — Terrateam/Atlantis.

### Acesso humano (Independente da rota)

Usuários precisam de egress Netskope + liberação JumpCloud/corp via Infosec em [central.loft.com.br](https://central.loft.com.br).

Detalhes: [kong-gateway.md](kong-gateway.md), [infra-live-route53.md](infra-live-route53.md).

---

## Passo 6 — Validação e erros comuns

Ordem segura:

1. Merge **k8s-apps** → Argo cria namespace (pods podem falhar imagem até o deploy).
2. Merge **kong-configs** → rotas no gateway.
3. DNS external aplicado → `dig` aponta para `kong-external…`.
4. Rodar workflows de deploy (tag real no ECR).
5. Atualizar Vault (`CORS_ORIGINS`, secrets) e redeploy se o bake mudou.
6. Smoke HTTPS nos hosts corp (front exige JumpCloud).

| Sintoma | Causa provável | O que fazer |
| --- | --- | --- |
| `ImagePullBackOff` / tag `bootstrap` | Deploy GHA ainda não rodou | Disparar workflows; conferir ECR |
| CrashLoop / missing secret | Path Vault errado | Alinhar `vaultSecrets.path`; re-push; restart |
| Probe failing | Porta/path errados | API `8000` `/health`; front `8080` `/health` |
| DNS OK, Kong 404/502 | Route/service ou upstream | Conferir merge kong-configs e `*.cross.loft-prod.io` |
| API DNS → `kong-internal` | Record external ausente | PR/apply em `infra-live` com `kong_accessibility=external` |
| CORS / OPTIONS 302 | API atrás de kong-corp | Mover API para **external** |
| Usuário não acessa corp | Sem JumpCloud / Netskope | Orientar Infosec / Central |

---

## Passo 7 — CORS e cutover de hosts

1. Definir origins no Vault (`CORS_ORIGINS`) — [cors-origins.env.example](../../en/loft-infra/examples/cors-origins.env.example).
2. Bake do front (`VITE_API_URL` / `FRONT_BAKE_API_URL`) aponta para a API **alcançável pelo browser** (em geral `CORP_API_URL`).
3. Mudança de bake → **novo deploy do front**. Mudança de `CORS_ORIGINS` → **restart/rollout da API**.
4. Opcional: plugin `cors` na route Kong da API (GitOps em `kong-configs`) se o time padronizar isso — não substitui `CORS_ORIGINS` da app se a API já trata CORS.

Rules: origins exatas, sem trailing slash, preferir `https`.

---

## Onde clonar / abrir PR

| Trabalho | Repo |
| --- | --- |
| App (workflows, Docker, `.env` local) | repo do produto |
| Helm / Argo | `loft-br/k8s-apps` |
| Kong YAML | `loft-br/kong-configs` |
| DNS external | `loft-br/infra-live` |

Nunca editar à mão artefatos gerados de Kong em `k8s-apps/.../kong-corp/kong.yaml`.
