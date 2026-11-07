# Kubernetes — Datadog enablement (`web-server`)

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-observability/k8s-datadog-enablement.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Repo: [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) — chart `helm-charts/web-server/`.

Extends [../loft-infra/k8s-apps.md](../loft-infra/k8s-apps.md).

## Opt-in model

```yaml
datadog:
  enabled: true    # optional explicit override
  ttl: 7d          # non-prod opt-in TTL (e.g. 7d, 15d, 30d, or chart default "eod")
  # service: ""    # optional override for DD_SERVICE (defaults to application.name)
```

Chart reference: [values.yaml](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/values.yaml) (Datadog section).

### Production default (important)

If `datadog.enabled` is **omitted**, the chart enables Datadog when `application.environment` is **`production`**.

Evidence: [`web-server.datadogEnabled`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl).

Example: [aiops-dataforge-api values.yaml](https://github.com/loft-br/k8s-apps/blob/main/clusters/cross-prod/deployments/aiops-dataforge/aiops-dataforge-api/values.yaml) has `environment: production` and no `datadog:` block — Datadog env injection still applies.

Non-production (`development`, `homologation`, `sandbox`) defaults to **disabled** unless `datadog.enabled: true` is set (with TTL tracking for temporary enablement).

## Environment variables injected by the chart

When Datadog is enabled, the chart adds these unless already present in `application.environmentVariables`:

| Variable | Value |
| --- | --- |
| `DD_SERVICE` | `datadog.service` or `application.name` |
| `DD_ENV` | `application.environment` |
| `DD_VERSION` | `application.image.tag` |
| `DD_LOGS_INJECTION` | `"true"` |
| `DD_TRACE_ENABLED` | `"true"` |
| `DD_RUNTIME_METRICS_ENABLED` | `"true"` |
| `DD_AGENT_HOST` | Pod `status.hostIP` |

Evidence: [\_helpers.tpl DD block](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl).

**Do not duplicate** these in `environmentVariables` unless overriding intentionally.

### Manual additions (when needed)

| Variable | When |
| --- | --- |
| `DD_AGENT_HOST` | Rare — chart sets via downward API; only override for non-standard agent routing |
| `DD_TRACE_ENABLED` | Only to disable traces globally for a workload |
| Sample rates, profiling flags | App-specific tuning |

## Scheduling

Enabled workloads receive toleration `karpenter.olivelas.com.br/datadog=enabled` so pods can run on nodes where the agent is scheduled.

Non-production opt-in may add annotations `datadog.olivelas.com.br/enabled` and `datadog.olivelas.com.br/ttl`.

## Pod annotations (log processing)

The chart can set Datadog autodiscovery annotations (e.g. log exclusion patterns for health checks). See [`web-server.datadogExcludePattern`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl).

Prefer excluding noisy health-check lines over disabling log collection.

## Do not copy from legacy manifests

| Avoid | Why |
| --- | --- |
| `DD_TAGS` on Helm values | Does not work on Olivelas clusters (legacy kustomize migration note) |
| Duplicating `DD_SERVICE` / `DD_ENV` already injected | Drift risk |

## Explicit disable (exception)

```yaml
datadog:
  enabled: false
```

Use only with documented justification (e.g. short-lived sandbox). Production services should not disable without approval and documentation debt.

## Verify after merge to `k8s-apps`

1. Argo CD sync healthy.
2. Pod env contains `DD_*` variables (`kubectl` describe pod — do not paste secrets).
3. Follow [verification-checklist.md](verification-checklist.md).

## Related documents

- [application-instrumentation.md](application-instrumentation.md)
- [structured-logging.md](structured-logging.md)
- [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md)
