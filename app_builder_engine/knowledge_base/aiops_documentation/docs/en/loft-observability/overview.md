# Overview — Datadog on Olivelas EKS

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-observability/overview.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Repo: [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) (chart `web-server`).

## Platform role

At Olivelas, **Datadog** is the standard platform for **metrics, logs, and traces**. A Datadog agent runs on EKS nodes; pods scheduled with Datadog tolerations receive host-level collection.

| Layer | Owner | What it provides |
| --- | --- | --- |
| **Node agent** | Platform / cluster | Host and container metrics; log and trace forwarding |
| **`web-server` chart** | Service team + platform chart | `DD_*` env vars, pod annotations, Datadog tolerations when enabled |
| **Application** | Service team | Structured JSON logs, APM libraries (`dd-trace`, `ddtrace`, Java agent), custom metrics |

## Signal flow

```text
Application (stdout JSON logs + APM library)
        │
        ▼
Datadog agent (on EKS node — status.hostIP)
        │
        ▼
Datadog SaaS (Logs, APM, Metrics)
        │
        ▼
Operators (dashboards, monitors, incident triage)
```

## What the chart does vs what the app must do

When [Datadog is enabled](k8s-datadog-enablement.md) for a workload, the chart injects (unless already set in `application.environmentVariables`):

| Variable | Source |
| --- | --- |
| `DD_SERVICE` | `datadog.service` or `application.name` |
| `DD_ENV` | `application.environment` |
| `DD_VERSION` | `application.image.tag` |
| `DD_LOGS_INJECTION` | `"true"` |
| `DD_TRACE_ENABLED` | `"true"` |
| `DD_RUNTIME_METRICS_ENABLED` | `"true"` |
| `DD_AGENT_HOST` | `status.hostIP` (downward API) |

Evidence: [web-server `_helpers.tpl`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl) (DD env block).

The **application** must still:

1. Emit **structured logs** to stdout/stderr ([structured-logging.md](structured-logging.md)).
2. Load the **APM library** appropriate to the stack ([application-instrumentation.md](application-instrumentation.md)).
3. Avoid logging secrets and unnecessary PII.

Env injection alone does **not** produce useful APM or correlated logs without app-side formatting and libraries.

## Production default

The chart resolves `datadog.enabled` as **`true` when `application.environment` is `production`**, unless explicitly overridden in `values.yaml`.

Evidence: [`web-server.datadogEnabled`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl) — defaults to production; explicit `datadog.enabled` overrides.

Non-production environments default to **disabled** unless opted in (with TTL annotations for temporary enablement).

## Relation to documentation

For Olivelas services on EKS:

- **Logging** in Datadog is a **documentation prerequisite** before operational docs are considered complete — [documentation-prerequisites.md](documentation-prerequisites.md).
- Project teams still fill [templates/observability.md](../templates/observability.md) with honest `Implemented` / `Partial` / `Not Applicable` status.

## Related documents

- [k8s-datadog-enablement.md](k8s-datadog-enablement.md)
- [../loft-infra/k8s-apps.md](../loft-infra/k8s-apps.md)
- [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md)
