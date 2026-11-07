# k8s-apps — configuração Kubernetes / Argo CD

> Language: pt-BR | [English (EN)](../../en/loft-infra/k8s-apps.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Repositório e cluster

- Repo: [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps)
- Cluster / ambiente observado para AIOps: **`clusters/cross-prod`**

## Árvore de diretórios (exemplo DataForge)

```text
clusters/cross-prod/
├── applications/
│   └── aiops-dataforge.yaml          # Argo CD Application
├── base/
│   └── web-server-base-values.yaml   # values base do chart (compartilhado)
└── deployments/
    └── aiops-dataforge/
        ├── aiops-dataforge-api/
        │   └── values.yaml
        └── aiops-dataforge-front/
            └── values.yaml
```

### Outros apps AIOps no mesmo cluster

| Pasta em `deployments/` | Application |
| --- | --- |
| `aiops-dataforge/` | `applications/aiops-dataforge.yaml` |
| `aiops-deep-insight/` (+ workers) | `applications/aiops-deep-insight.yaml` |
| `aiops-qualidade/` | `applications/aiops-qualidade.yaml` |
| `aiops-loft-carteiras/` | `applications/aiops-loft-carteiras.yaml` |

Deep Insight também declara workers (`aiops-deep-insight-scheduler-worker`, `aiops-deep-insight-slack-worker`) sob o mesmo deployment root.

## Argo CD Application

Fonte: `clusters/cross-prod/applications/aiops-dataforge.yaml` (padrão igual em `aiops-qualidade`).

Pontos observados:

- Chart Helm: **`web-server`** em `https://chartmuseum.loft-corp.com.br`, revision **`2.15.3`**
- Multi-source: um source por componente (API, front, …) + source `ref: values` apontando para `loft-br/k8s-apps.git`
- Cada componente monta:
  1. `$values/clusters/cross-prod/base/web-server-base-values.yaml`
  2. `$values/clusters/cross-prod/deployments/<app>/<service>/values.yaml`
- `destination.namespace`: igual ao produto (ex.: `aiops-dataforge`)
- `syncPolicy.automated` com `prune: true`, `CreateNamespace=true`

```yaml
# Estrutura resumida (não omitir campos reais ao copiar — ver arquivo no repo)
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: aiops-dataforge
  namespace: argo-cd
spec:
  sources:
    - repoURL: https://chartmuseum.loft-corp.com.br
      targetRevision: 2.15.3
      chart: web-server
      helm:
        valueFiles:
          - $values/clusters/cross-prod/base/web-server-base-values.yaml
          - $values/clusters/cross-prod/deployments/aiops-dataforge/aiops-dataforge-api/values.yaml
    # … segundo source para o front …
    - repoURL: https://github.com/loft-br/k8s-apps.git
      targetRevision: HEAD
      ref: values
  destination:
    namespace: aiops-dataforge
```

## `values.yaml` — contrato `application.*`

Campos recorrentes nos values de DataForge / Deep Insight / Loft Carteiras:

| Campo | Significado observado |
| --- | --- |
| `application.name` | Nome do workload (= serviço) |
| `application.environment` | `production` |
| `application.cpuArchitecture` | `arm64` (alinha com runners e `platforms`) |
| `application.image.repository` | ECR `886819405138.dkr.ecr.us-east-1.amazonaws.com/<ns>-<name>` |
| `application.image.tag` | Tag imutável estilo `YYYYMMDD.<gitsha>` atualizada pelo deploy |
| `application.network.port` | Porta do container (front `8080`, API Flask `5000`, FastAPI qualidade `8000`) |
| `application.resources` | requests/limits CPU e memória |
| `application.*Probe` | HTTP GET em `/health`, `/api/health`, `/health/live`, etc. |
| `application.environmentVariables` | Env não-secretos (`TZ`, `PORT`, flags) |
| `application.vaultSecrets` | `mount: cross` + `path: ai-ops/<app>/secrets` |
| `application.team` | Label de ownership (`squad-ai-ops`, `squad-infosec`, …) |
| `replicaCount` / `rollingUpdate` | Rolling deploy |
| `ingress.enabled` / `className` | `true` / **`kong`** |
| `autoscaling` | HPA CPU (KEDA off nos exemplos) |
| `podAnnotations.loft.com.br/source-repository` | Repo GitHub de origem |

### Exemplo — API DataForge (trechos)

Fonte: `clusters/cross-prod/deployments/aiops-dataforge/aiops-dataforge-api/values.yaml`.

```yaml
application:
  name: aiops-dataforge-api
  environment: production
  cpuArchitecture: arm64
  image:
    repository: 886819405138.dkr.ecr.us-east-1.amazonaws.com/aiops-dataforge-aiops-dataforge-api
    pullPolicy: IfNotPresent
    tag: "20260811.b554dbd"
  network:
    port: 5000
    protocol: TCP
  livenessProbe:
    httpGet:
      port: 5000
      path: /api/health
  readinessProbe:
    httpGet:
      port: 5000
      path: /api/health
  vaultSecrets:
    - mount: cross
      path: ai-ops/aiops-dataforge/secrets
  team: squad-ai-ops
ingress:
  enabled: true
  className: kong
autoscaling:
  enabled: true
  kedaEnabled: false
  minReplicas: 2
  maxReplicas: 4
  targetCPUUtilizationPercentage: 80
podAnnotations:
  loft.com.br/source-repository: aiops-dataforge
```

### Exemplo — front DataForge

- Porta `8080`, probes em `/health`, inclusive `startupProbe`
- Mesmo `vaultSecrets` path do produto DataForge
- ECR: `…/aiops-dataforge-aiops-dataforge-front`

### Variações observadas

| App / serviço | Diferença relevante |
| --- | --- |
| Deep Insight API | `team: squad-infosec`; Vault path `ai-ops/aiops-deep-insight-api/secrets`; `replicaCount: 1` |
| Loft Carteiras front | Probes `/health/live` e `/health/ready`; HPA `minReplicas: 0` |
| Qualidade | Deployment root `aiops-qualidade` (repo app: `qualidade-loft`) |

## Segredos

- Declarados só via `application.vaultSecrets` (Vault Secrets Operator no cluster).
- Não colocar secrets em `environmentVariables` nem em arquivos commitados.
- Comentário no Dockerfile de loft-carteira confirma: em EKS o loader usa env injetado pelo VaultStaticSecret.
- Guia completo (paths observados, scripts de push, cuidados): [vault-secrets.md](vault-secrets.md).

## Ingress

`ingress.className: kong` nos values; o hostname **público** corp/external é configurado em [kong-configs](kong-gateway.md). O host **interno** usado pelo Kong como upstream segue o padrão `<service>.cross.loft-prod.io`. O DNS `*.loft-corp.com.br` → LB Kong fica em [infra-live](infra-live-route53.md).

## Templates

- [k8s-apps-front.values.yaml.example](../../en/loft-infra/examples/k8s-apps-front.values.yaml.example)
- [k8s-apps-api.values.yaml.example](../../en/loft-infra/examples/k8s-apps-api.values.yaml.example)
- [k8s-apps-application.yaml.example](../../en/loft-infra/examples/k8s-apps-application.yaml.example)
- Guia: [publish-guide.md](publish-guide.md)
