# Checklist — publicar um serviço AIOps no modelo atual

> Language: pt-BR | [English (EN)](../../en/loft-infra/checklist-novo-servico.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Informational

Checklist operacional baseado no que os apps de referência já fazem. Não substitui o onboarding formal da plataforma (`[pending: Backstage template / runbook oficial de new service]`).

**Guia completo (passos + erros comuns):** [publish-guide.md](publish-guide.md)  
**Templates para copiar:** [examples/](examples/README.md)

## 1. Repositório da aplicação

- [ ] Layout: front na raiz e/ou `backend/` para API
- [ ] `Dockerfile`(s) com user non-root, `HEALTHCHECK`, porta documentada — [examples/](examples/README.md)
- [ ] Endpoint(s) de health estáveis (`/health`, `/api/health`, …)
- [ ] Workflows `prod-k8s-deployment-*.yml` com path filters — [examples/](examples/README.md)
- [ ] Action `loft-br/actions/deploy@deploy/v1.8.0` (ou pin SHA recente)
- [ ] Inputs: `name`, `namespace`, `aws-account: cross`, `product: ai-ops`, `platforms: linux/arm64`
- [ ] `github-token: ${{ secrets.GIT_HUB_TOKEN }}`
- [ ] `actions/checkout@v6` (Node.js 24)
- [ ] Front: `build-args` / `deploy/published-hosts.env` com URL da API alcançável pelo browser
- [ ] Repo permissions: `id-token: write`, environment `production`

## 2. k8s-apps

- [ ] Pasta `clusters/cross-prod/deployments/<namespace>/<service>/values.yaml` — [examples/](examples/README.md)
- [ ] `cpuArchitecture: arm64`, image repository ECR, probes, resources
- [ ] `vaultSecrets` com `mount: cross` e path `ai-ops/<service>` (sem `/secrets` extra se o KV não usa)
- [ ] `ingress.className: kong`
- [ ] `podAnnotations.loft.com.br/source-repository`
- [ ] Application Argo CD em `clusters/cross-prod/applications/<namespace>.yaml`
- [ ] Chart `web-server` + base values + values do serviço
- [ ] Namespace de destino criado via sync (`CreateNamespace=true`)
- [ ] **Aprovação de par** antes do merge

## 3. Kong

- [ ] Service: upstream `<service>.cross.loft-prod.io:443`
- [ ] Route: host `*.loft-corp.com.br`, methods/paths
- [ ] Front → `gateways/infra-prod/corp/cross/` — [kong-front-*.example](../../en/loft-infra/examples/)
- [ ] API pública → `gateways/infra-prod/external/cross/` (+ `ip-restriction` Netskope) — [kong-api-*.example](../../en/loft-infra/examples/)
- [ ] **Não** colocar API do SPA no kong-corp (Cognito `302` quebra CORS `OPTIONS`)
- [ ] Tags `impact_level` / `squad`
- [ ] URLs do front e CORS da API alinhados ao host final

## 4. DNS (`infra-live`)

- [ ] Corp: confirmar auto-sync após merge em `gateways/*/corp/**` (ou record manual se necessário)
- [ ] API external: pasta `…/route53/records/loft-corp.com.br/<fqdn>/terragrunt.hcl` — [dns-api.terragrunt.hcl.example](../../en/loft-infra/examples/dns-api.terragrunt.hcl.example)
- [ ] Blueprint `route53/kong-record` com `record_name` correto
- [ ] `kong_accessibility`: `corp` (front) ou `external` (API pública)
- [ ] `aws_account: infrastructure`, `environment: production`
- [ ] Apply via Atlantis/Terrateam (**sem** apply local); `dig` → `kong-{corp|external}.infrastructure.loft-prod.io`

Detalhes: [infra-live-route53.md](infra-live-route53.md)

## 5. Vault

- [ ] Path de secrets criado no mount `cross` (produto `ai-ops`)
- [ ] Keys = nomes de env que o código lê
- [ ] `application.vaultSecrets` no values alinhado ao path
- [ ] App lê apenas env injetados — sem secrets no Git
- [ ] Script de push (se houver) com o mesmo path default — [push_secrets.py.example](../../en/loft-infra/examples/push_secrets.py.example)
- [ ] `CORS_ORIGINS` com origins exactos (sem trailing slash) — [cors-origins.env.example](../../en/loft-infra/examples/cors-origins.env.example)

Detalhes: [vault-secrets.md](vault-secrets.md)

## 6. Observabilidade (Datadog)

Pack: [../loft-observability/README.md](../loft-observability/README.md). **Logs no Datadog** são pré-requisito documental para produção — [../loft-observability/documentation-prerequisites.md](../loft-observability/documentation-prerequisites.md).

- [ ] Entender default do chart Datadog: **habilitado em `production`** mesmo sem bloco `datadog:` explícito — [../loft-observability/k8s-datadog-enablement.md](../loft-observability/k8s-datadog-enablement.md)
- [ ] Override de `datadog.enabled` / `datadog.ttl` só quando intencional
- [ ] App emite **logs JSON estruturados** em stdout — [../loft-observability/structured-logging.md](../loft-observability/structured-logging.md)
- [ ] Biblioteca APM configurada para a stack (agent JVM, `dd-trace`, `ddtrace-run`) — [../loft-observability/application-instrumentation.md](../loft-observability/application-instrumentation.md)
- [ ] Verificação pós-deploy: serviço no APM, logs correlacionados — [../loft-observability/verification-checklist.md](../loft-observability/verification-checklist.md)
- [ ] `operations/observability.md` (ou template) com status de Logging não deixado `Not Documented`

## 7. Validação pós-deploy

- [ ] Workflow verde no GitHub Actions
- [ ] Tag nova no `values.yaml` do `k8s-apps`
- [ ] Argo CD Synced/Healthy; `VaultStaticSecret` OK
- [ ] Probes OK; HPA coerente
- [ ] Host corp responde HTTPS (JumpCloud); API external respeita IP policy
- [ ] Usuários com acesso JumpCloud/corp (Infosec / [Central](https://central.loft.com.br)) quando necessário
- [ ] Sem secret em logs / imagens / PRs

## Referências rápidas

- [publish-guide.md](publish-guide.md) · [examples/](examples/README.md) · [overview.md](overview.md) · [github-actions-deploy.md](github-actions-deploy.md) · [k8s-apps.md](k8s-apps.md) · [kong-gateway.md](kong-gateway.md) · [infra-live-route53.md](infra-live-route53.md) · [vault-secrets.md](vault-secrets.md) · [dockerfiles.md](dockerfiles.md) · [../loft-observability/README.md](../loft-observability/README.md)
