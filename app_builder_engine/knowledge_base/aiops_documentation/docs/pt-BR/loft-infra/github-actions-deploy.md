# GitHub Actions — deploy para produção

> Language: pt-BR | [English (EN)](../../en/loft-infra/github-actions-deploy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Onde vive

Em cada app, sob `.github/workflows/`:

| Workflow | Serviço | Exemplo |
| --- | --- | --- |
| `prod-k8s-deployment-front.yml` | Frontend | [aiops-dataforge](https://github.com/loft-br/aiops-dataforge/blob/main/.github/workflows/prod-k8s-deployment-front.yml) |
| `prod-k8s-deployment-api.yml` | API | [aiops-dataforge](https://github.com/loft-br/aiops-dataforge/blob/main/.github/workflows/prod-k8s-deployment-api.yml) |

O mesmo par aparece em `aiops-deep-insight`, `qualidade-loft` e `aiops-loft-carteira`.

## Gatilhos

Padrão observado:

- `workflow_dispatch` — deploy manual
- `push` em `main` com **path filters** para só rebuildar o que mudou

### Front (DataForge) — paths

```yaml
paths:
  - "src/**"
  - "docker/**"
  - "Dockerfile"
  - "package.json"
  - "package-lock.json"
  - "vite.config.ts"
  - ".env.production"
  - ".env.example"
  - "tsconfig.json"
  - "components.json"
  - "wrangler.jsonc"
  - "deploy/k8s/aiops-dataforge-front/**"
  - ".github/workflows/prod-k8s-deployment-front.yml"
```

### API (DataForge) — paths

```yaml
paths:
  - "backend/**"
  - "deploy/k8s/aiops-dataforge-api/**"
  - ".github/workflows/prod-k8s-deployment-api.yml"
```

Deep Insight inclui também `server/**`, `index.html`, `.npmrc`, `nginx/**`, etc., conforme o layout do front.

## Job canônico

Elementos comuns aos workflows observados:

| Campo | Valor típico |
| --- | --- |
| `runs-on` | `ubuntu-arm` |
| `environment` | `production` |
| `permissions` | `id-token: write`, `contents: read` (OIDC → AWS) |
| Concurrency group | `deploy-<service>-prod`, `cancel-in-progress: false` |
| Action | `loft-br/actions/deploy@deploy/v1.8.0` **ou** pin por SHA (ex.: deep-insight / loft-carteira em `dcee0cf…` / `deploy/v1.7.4`) |
| Token | `${{ secrets.GIT_HUB_TOKEN }}` (org secret; **não** o `GITHUB_TOKEN` built-in) |
| `platforms` | `linux/arm64` |
| `ecr-max-images` | `10` |
| `aws-account` | `cross` |
| `product` | `ai-ops` |
| `environment` (input) | `production` |

## Exemplo — front (DataForge)

Fonte: `loft-br/aiops-dataforge` `.github/workflows/prod-k8s-deployment-front.yml`.

```yaml
jobs:
  deploy:
    name: Deploy front to PROD
    runs-on: ubuntu-arm
    environment: production
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Build image and deploy front to prod
        uses: loft-br/actions/deploy@deploy/v1.8.0
        with:
          name: aiops-dataforge-front
          namespace: aiops-dataforge
          aws-account: cross
          product: ai-ops
          environment: production
          github-token: ${{ secrets.GIT_HUB_TOKEN }}
          dockerfile: Dockerfile
          platforms: linux/arm64
          ecr-max-images: 10
          build-args: |
            VITE_API_URL=https://aiops-dataforge-api.loft-corp.com.br
```

## Exemplo — API (DataForge)

```yaml
        with:
          name: aiops-dataforge-api
          namespace: aiops-dataforge
          aws-account: cross
          product: ai-ops
          environment: production
          github-token: ${{ secrets.GIT_HUB_TOKEN }}
          context: backend
          dockerfile: backend/Dockerfile
          platforms: linux/arm64
          ecr-max-images: 10
```

`context: backend` faz o build usar o diretório da API como contexto Docker; o `dockerfile` aponta para o arquivo relativo ao repo.

## Variações entre apps

| App | Action pin | Observação |
| --- | --- | --- |
| `aiops-dataforge` | tag `deploy/v1.8.0` | Front passa `VITE_API_URL` público corp |
| `qualidade-loft` | tag `deploy/v1.8.0` | Namespace/name `aiops-qualidade-*` |
| `aiops-deep-insight` | SHA `dcee0cf…` (`deploy/v1.7.4`) | Comentário no workflow: pin imutável contra mutação de tag |
| `aiops-loft-carteira` | mesmo SHA | Namespaces `aiops-loft-carteiras-*` |

## O que a action faz (contrato observado)

A partir dos inputs e do efeito em `k8s-apps` (tag de imagem atualizada nos `values.yaml`):

1. Autentica na AWS via OIDC (`id-token: write`).
2. Builda a imagem multi-arch conforme `platforms` (aqui `linux/arm64`).
3. Publica no ECR da conta `cross` (repositório nomeado a partir de namespace/serviço — ver [k8s-apps.md](k8s-apps.md)).
4. Atualiza a tag da imagem no repositório `k8s-apps` (Argo CD sincroniza).

Detalhe interno dos steps da action: `[pending: actions/deploy source walkthrough]`.

## Segurança

- Credenciais de cloud via OIDC — sem access keys estáticas no workflow.
- `GIT_HUB_TOKEN` vem de `${{ secrets.* }}`; nunca literal no YAML.
- Preferir pin por SHA da action quando o time quiser imutabilidade (já feito em deep-insight e loft-carteira).
- Preferir `actions/checkout@v6` (runtime Node.js 24).

## Templates

- [examples/prod-k8s-deployment-front.yml.example](../../en/loft-infra/examples/prod-k8s-deployment-front.yml.example)
- [examples/prod-k8s-deployment-api.yml.example](../../en/loft-infra/examples/prod-k8s-deployment-api.yml.example)
- Guia: [publish-guide.md](publish-guide.md)
