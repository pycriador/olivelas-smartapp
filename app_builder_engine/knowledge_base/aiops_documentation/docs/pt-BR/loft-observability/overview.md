# Overview — Datadog na EKS Loft

> Language: pt-BR | [English (EN)](../../en/loft-observability/overview.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Repo: [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) (chart `web-server`).

## Papel da plataforma

Na Loft, o **Datadog** é a plataforma padrão de **métricas, logs e traces**. Um agent Datadog roda nos nodes EKS; pods com tolerations Datadog recebem coleta em nível de host.

| Camada | Dono | O que entrega |
| --- | --- | --- |
| **Agent no node** | Plataforma / cluster | Métricas de host e container; encaminhamento de logs e traces |
| **Chart `web-server`** | Time do serviço + chart de plataforma | Variáveis `DD_*`, annotations de pod, tolerations Datadog quando habilitado |
| **Aplicação** | Time do serviço | Logs JSON estruturados, libs APM (`dd-trace`, `ddtrace`, Java agent), métricas custom |

## Fluxo de sinais

```text
Aplicação (stdout logs JSON + lib APM)
        │
        ▼
Agent Datadog (no node EKS — status.hostIP)
        │
        ▼
Datadog SaaS (Logs, APM, Metrics)
        │
        ▼
Operadores (dashboards, monitors, triagem de incidente)
```

## O que o chart faz vs o que a app deve fazer

Quando o [Datadog está habilitado](k8s-datadog-enablement.md), o chart injeta (salvo se já definido em `application.environmentVariables`):

| Variável | Origem |
| --- | --- |
| `DD_SERVICE` | `datadog.service` ou `application.name` |
| `DD_ENV` | `application.environment` |
| `DD_VERSION` | `application.image.tag` |
| `DD_LOGS_INJECTION` | `"true"` |
| `DD_TRACE_ENABLED` | `"true"` |
| `DD_RUNTIME_METRICS_ENABLED` | `"true"` |
| `DD_AGENT_HOST` | `status.hostIP` (downward API) |

Evidência: [bloco DD em `_helpers.tpl`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl).

A **aplicação** ainda deve:

1. Emitir **logs estruturados** em stdout/stderr ([structured-logging.md](structured-logging.md)).
2. Carregar a **lib APM** da stack ([application-instrumentation.md](application-instrumentation.md)).
3. Não logar secrets nem PII desnecessário.

Injetar env **sozinho** não produz APM útil nem logs correlacionados sem formato e libs na app.

## Default em produção

O chart resolve `datadog.enabled` como **`true` quando `application.environment` é `production`**, salvo override explícito no `values.yaml`.

Evidência: [`web-server.datadogEnabled`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl).

Ambientes não produtivos default **desligado**, salvo opt-in com TTL.

## Relação com documentação

Para serviços Loft na EKS:

- **Logging** no Datadog é **pré-requisito documental** antes de considerar docs operacionais completas — [documentation-prerequisites.md](documentation-prerequisites.md).
- Times ainda preenchem [templates/observability.md](../templates/observability.md) com status honesto `Implemented` / `Partial` / `Not Applicable`.

## Documentos relacionados

- [k8s-datadog-enablement.md](k8s-datadog-enablement.md)
- [../loft-infra/k8s-apps.md](../loft-infra/k8s-apps.md)
- [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md)
