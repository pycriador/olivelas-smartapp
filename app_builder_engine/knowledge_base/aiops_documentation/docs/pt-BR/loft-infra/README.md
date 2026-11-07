# Infra Olivelas atual (Olivelas)

> Language: pt-BR | [English (EN)](../../en/loft-infra/README.md)
>
> Status: ACCEPTED
>
> Authority: Verified
>
> Documentation Standard v1.0

Documentação **as-is** da forma como os apps Olivelas da Olivelas são publicados hoje: GitHub Actions → ECR → `k8s-apps` (Argo CD + chart `web-server`) → Kong → DNS (`infra-live`) + secrets (Vault).

Stacks de **frontend/backend** (libs, rotas, segurança): ver pasta irmã [../aiops-apps/README.md](../aiops-apps/README.md).

Esta pasta é um pacote separado do padrão genérico de documentação. Os fatos abaixo foram observados nos repositórios de referência; o que não aparece no código está marcado como `[pending: …]`.

## Repositórios de evidência

| Papel | Repositório |
| --- | --- |
| App (front + API) | [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge) |
| App (front + API) | [loft-br/aiops-central](https://github.com/loft-br/aiops-central) |
| App | [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight) |
| App | [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft) (`aiops-qualidade` no cluster) |
| App | [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) (`aiops-loft-carteiras` no cluster) |
| Deploy Kubernetes / Argo CD | [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) |
| Gateway Kong | [loft-br/kong-configs](https://github.com/loft-br/kong-configs) |
| DNS Route53 / IaC | [loft-br/infra-live](https://github.com/loft-br/infra-live) |
| Action de deploy | [loft-br/actions](https://github.com/loft-br/actions) (`deploy@deploy/v1.8.0` ou pin por SHA) |

## Mapa desta pasta

| Documento | Conteúdo |
| --- | --- |
| [publish-guide.md](publish-guide.md) | **Guia completo** passo a passo (workflows → CORS) |
| [examples/](examples/README.md) | Templates `.example` para copiar em novos apps / PRs |
| [overview.md](overview.md) | Fluxo ponta a ponta e papéis de cada repositório |
| [github-actions-deploy.md](github-actions-deploy.md) | Workflows `.github/workflows`, inputs da action `deploy` |
| [k8s-apps.md](k8s-apps.md) | Layout em `clusters/cross-prod`, Application Argo CD, `values.yaml` |
| [kong-gateway.md](kong-gateway.md) | Routes/services corp (front) e external (API) |
| [infra-live-route53.md](infra-live-route53.md) | Records Route53 `loft-corp.com.br` (CNAME → Kong) |
| [vault-secrets.md](vault-secrets.md) | Vault KV + `application.vaultSecrets` (como configurar e cuidados) |
| [dockerfiles.md](dockerfiles.md) | Padrões e exemplos reais de Dockerfile |
| [checklist-novo-servico.md](checklist-novo-servico.md) | Checklist operacional para publicar um app novo no mesmo modelo |

**Comece por:** [publish-guide.md](publish-guide.md) + [examples/](examples/README.md).

**Observabilidade (Datadog):** pack irmão [../loft-observability/README.md](../loft-observability/README.md).

## Escopo e limites

- Foco: cluster **`cross-prod`**, conta AWS **`cross`**, produto Vault/ECR **`ai-ops`**, runners **`ubuntu-arm`**, plataforma **`linux/arm64`**.
- Não documenta aqui o conteúdo interno do chart `web-server` nem o código-fonte da action `deploy` além do contrato de inputs observado nos workflows.
- Segredos vivem no Vault (`application.vaultSecrets`); nunca em YAML de app nem em `.env` versionado.
