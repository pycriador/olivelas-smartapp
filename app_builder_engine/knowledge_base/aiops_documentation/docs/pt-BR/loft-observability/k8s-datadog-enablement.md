# Kubernetes — habilitação Datadog (`web-server`)

> Language: pt-BR | [English (EN)](../../en/loft-observability/k8s-datadog-enablement.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Repo: [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) — chart `helm-charts/web-server/`.

Estende [../loft-infra/k8s-apps.md](../loft-infra/k8s-apps.md).

## Modelo de opt-in

```yaml
datadog:
  enabled: true    # override explícito opcional
  ttl: 7d          # TTL de opt-in fora de prod (ex.: 7d, 15d, 30d, ou default do chart "eod")
  # service: ""    # override opcional de DD_SERVICE (default: application.name)
```

Referência do chart: [values.yaml](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/values.yaml) (seção Datadog).

### Default em produção (importante)

Se `datadog.enabled` for **omitido**, o chart habilita Datadog quando `application.environment` é **`production`**.

Evidência: [`web-server.datadogEnabled`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl).

Exemplo: [values.yaml aiops-dataforge-api](https://github.com/loft-br/k8s-apps/blob/main/clusters/cross-prod/deployments/aiops-dataforge/aiops-dataforge-api/values.yaml) tem `environment: production` sem bloco `datadog:` — injeção de env Datadog ainda se aplica.

Fora de produção (`development`, `homologation`, `sandbox`) default é **desligado**, salvo `datadog.enabled: true` (com TTL para enablement temporário).

## Variáveis de ambiente injetadas pelo chart

Com Datadog habilitado, o chart adiciona (salvo se já existirem em `application.environmentVariables`):

| Variável | Valor |
| --- | --- |
| `DD_SERVICE` | `datadog.service` ou `application.name` |
| `DD_ENV` | `application.environment` |
| `DD_VERSION` | `application.image.tag` |
| `DD_LOGS_INJECTION` | `"true"` |
| `DD_TRACE_ENABLED` | `"true"` |
| `DD_RUNTIME_METRICS_ENABLED` | `"true"` |
| `DD_AGENT_HOST` | `status.hostIP` do pod |

Evidência: [bloco DD em `_helpers.tpl`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl).

**Não duplique** em `environmentVariables` salvo override intencional.

### Adições manuais (quando necessário)

| Variável | Quando |
| --- | --- |
| `DD_AGENT_HOST` | Raro — chart define via downward API |
| `DD_TRACE_ENABLED` | Só para desabilitar traces globalmente |
| Sample rates, flags de profiling | Tuning específico da app |

## Scheduling

Workloads habilitados recebem toleration `karpenter.olivelas.com.br/datadog=enabled` para rodar em nodes com agent.

Opt-in fora de prod pode adicionar annotations `datadog.olivelas.com.br/enabled` e `datadog.olivelas.com.br/ttl`.

## Annotations de pod (processamento de logs)

O chart pode definir annotations de autodiscovery Datadog (ex.: exclusão de health checks). Ver [`web-server.datadogExcludePattern`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl).

Prefira excluir ruído de health check a desligar coleta de logs.

## Não copiar de manifests legados

| Evite | Motivo |
| --- | --- |
| `DD_TAGS` em values Helm | Não funciona nos clusters Olivelas (nota de migração kustomize) |
| Duplicar `DD_SERVICE` / `DD_ENV` já injetados | Risco de drift |

## Desabilitar explicitamente (exceção)

```yaml
datadog:
  enabled: false
```

Só com justificativa documentada (ex.: sandbox efêmero). Produção não deve desabilitar sem aprovação e documentation debt.

## Verificar após merge no `k8s-apps`

1. Argo CD sync healthy.
2. Pod com variáveis `DD_*` (`kubectl` describe pod — não cole secrets).
3. Seguir [verification-checklist.md](verification-checklist.md).

## Documentos relacionados

- [application-instrumentation.md](application-instrumentation.md)
- [structured-logging.md](structured-logging.md)
- [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md)
