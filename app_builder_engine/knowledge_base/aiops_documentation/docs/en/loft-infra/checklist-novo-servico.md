# Checklist — ship an Olivelas service on the current model

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/checklist-novo-servico.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Informational

Operational checklist derived from reference apps. Does not replace formal platform onboarding (`[pending: Backstage template / official new-service runbook]`).

**Full walkthrough:** [publish-guide.md](publish-guide.md)  
**Copy-paste templates:** [examples/](examples/README.md)

## App repo

- [ ] Front root and/or `backend/` API layout
- [ ] Dockerfiles: non-root, HEALTHCHECK, documented port — [examples/](examples/README.md)
- [ ] Stable health endpoints
- [ ] `prod-k8s-deployment-*.yml` with path filters — [examples/](examples/README.md)
- [ ] `loft-br/actions/deploy@deploy/v1.8.0` (or recent SHA pin)
- [ ] Inputs: `name`, `namespace`, `aws-account: cross`, `product: ai-ops`, `linux/arm64`
- [ ] `${{ secrets.GIT_HUB_TOKEN }}`, OIDC (`id-token: write`), `actions/checkout@v6`
- [ ] Front bake / `deploy/published-hosts.env` for browser-reachable API URL
- [ ] Environment `production`

## k8s-apps

- [ ] `clusters/cross-prod/deployments/<ns>/<service>/values.yaml` — [examples/](examples/README.md)
- [ ] arm64, ECR image, probes, resources
- [ ] `vaultSecrets` (`mount: cross`, path `ai-ops/<service>`)
- [ ] `ingress.className: kong`
- [ ] Argo CD Application with `web-server` + base + service values
- [ ] Peer approval before merge

## Kong + DNS (`infra-live`)

- [ ] Front → `gateways/infra-prod/corp/cross/` — [kong-front-*.example](examples/)
- [ ] API → `gateways/infra-prod/external/cross/` + Netskope `ip-restriction` — [kong-api-*.example](examples/)
- [ ] Do **not** put SPA API on kong-corp (Cognito `302` breaks CORS `OPTIONS`)
- [ ] Corp DNS often auto-syncs after corp merge; external DNS needs `infra-live` (`kong_accessibility=external`)
- [ ] DNS resolves to `kong-{corp|external}.infrastructure.loft-prod.io`

## Vault

- [ ] KV on mount `cross`; path matches `application.vaultSecrets`
- [ ] Keys = env names the code reads; nothing secret in Git
- [ ] `CORS_ORIGINS` exact origins (no trailing slash) — [cors-origins.env.example](examples/cors-origins.env.example)

## Observability (Datadog)

Pack: [../loft-observability/README.md](../loft-observability/README.md). **Logs in Datadog** are a documentation prerequisite for production — [../loft-observability/documentation-prerequisites.md](../loft-observability/documentation-prerequisites.md).

- [ ] Understand chart Datadog default: **enabled in `production`** even without explicit `datadog:` block — [../loft-observability/k8s-datadog-enablement.md](../loft-observability/k8s-datadog-enablement.md)
- [ ] Override `datadog.enabled` / `datadog.ttl` only when intentional
- [ ] Application emits **structured JSON logs** to stdout — [../loft-observability/structured-logging.md](../loft-observability/structured-logging.md)
- [ ] APM library configured for stack — [../loft-observability/application-instrumentation.md](../loft-observability/application-instrumentation.md)
- [ ] Post-deploy verification — [../loft-observability/verification-checklist.md](../loft-observability/verification-checklist.md)

## Verify

- [ ] Workflow green → new tag in k8s-apps → Argo Healthy → `VaultStaticSecret` OK → corp HTTPS OK (JumpCloud)
- [ ] Users have JumpCloud/corp access via Infosec / [Central](https://central.olivelas.com.br) when required
- [ ] No secrets in logs, images, or PRs

See also: [publish-guide.md](publish-guide.md), [examples/](examples/README.md), [overview.md](overview.md), [infra-live-route53.md](infra-live-route53.md), [vault-secrets.md](vault-secrets.md), [kong-gateway.md](kong-gateway.md), [k8s-apps.md](k8s-apps.md), [../loft-observability/README.md](../loft-observability/README.md).
