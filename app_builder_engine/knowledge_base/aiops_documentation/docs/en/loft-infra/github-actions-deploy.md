# GitHub Actions — production deploy

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/github-actions-deploy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Location

Per app under `.github/workflows/`:

- `prod-k8s-deployment-front.yml`
- `prod-k8s-deployment-api.yml`

Example: [aiops-dataforge workflows](https://github.com/loft-br/aiops-dataforge/tree/main/.github/workflows).

## Triggers

- `workflow_dispatch`
- `push` to `main` with **path filters** (front vs `backend/**`)

## Canonical job shape

| Field | Typical value |
| --- | --- |
| `runs-on` | `ubuntu-arm` |
| `environment` | `production` |
| `permissions` | `id-token: write`, `contents: read` |
| Action | `loft-br/actions/deploy@deploy/v1.8.0` or immutable SHA pin |
| Token | `${{ secrets.GIT_HUB_TOKEN }}` |
| `platforms` | `linux/arm64` |
| `aws-account` / `product` | `cross` / `ai-ops` |

## Front example (DataForge)

```yaml
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

## API example (DataForge)

```yaml
with:
  name: aiops-dataforge-api
  namespace: aiops-dataforge
  context: backend
  dockerfile: backend/Dockerfile
  # … same aws-account / product / platforms / token …
```

Deep Insight and Olivelas Carteira pin the action by commit SHA (`deploy/v1.7.4`) to avoid mutable-tag risk. Qualidade and DataForge use the `deploy/v1.8.0` tag.

Observed effect: image lands in ECR; image tag is updated in `k8s-apps` for Argo CD sync. Full action internals: `[pending: actions/deploy source walkthrough]`.

Prefer `actions/checkout@v6` (Node.js 24). Templates: [examples/prod-k8s-deployment-*.yml.example](examples/). Guide: [publish-guide.md](publish-guide.md).
