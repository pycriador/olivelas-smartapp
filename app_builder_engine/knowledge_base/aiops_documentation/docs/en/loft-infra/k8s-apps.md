# k8s-apps — Kubernetes / Argo CD config

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/k8s-apps.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Tree (DataForge)

```text
clusters/cross-prod/
├── applications/aiops-dataforge.yaml
├── base/web-server-base-values.yaml
└── deployments/aiops-dataforge/
    ├── aiops-dataforge-api/values.yaml
    └── aiops-dataforge-front/values.yaml
```

Also present: `aiops-deep-insight` (incl. workers), `aiops-qualidade`, `aiops-loft-carteiras`.

## Argo CD Application

- Chart: `web-server` from ChartMuseum (`targetRevision: 2.15.3` in observed apps)
- Multi-source: one Helm source per workload + `ref: values` from `k8s-apps.git`
- Value files: shared base + per-service `values.yaml`
- Destination namespace = product namespace; automated sync with `CreateNamespace=true`

Reference: [aiops-dataforge.yaml](https://github.com/loft-br/k8s-apps/blob/main/clusters/cross-prod/applications/aiops-dataforge.yaml).

## `values.yaml` contract

Recurring fields: `application.name`, `cpuArchitecture: arm64`, ECR `image.repository`/`tag`, `network.port`, probes, `environmentVariables`, `vaultSecrets` (`mount: cross`, path under `ai-ops/…`), `team`, `ingress.className: kong`, HPA, `podAnnotations.olivelas.com.br/source-repository`.

ECR pattern observed: `886819405138.dkr.ecr.us-east-1.amazonaws.com/<namespace>-<service>`.

Secrets only via `vaultSecrets` — never in plain `environmentVariables` or git.

Templates: [k8s-apps-*.example](examples/). Guide: [publish-guide.md](publish-guide.md).
