# Loft observability — Datadog (as-is)

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-observability/README.md)
>
> Status: DRAFT
>
> Authority: Verified
>
> Documentation Standard v1.0

**As-is** documentation for **Datadog** as Loft's observability platform on **EKS** (`web-server` Helm chart, node agent, application instrumentation).

Deploy path (Actions, k8s-apps, Kong, Vault): sibling pack [../loft-infra/README.md](../loft-infra/README.md).

Application stacks (Python/Flask, FastAPI, React): [../aiops-apps/README.md](../aiops-apps/README.md).

This pack is **Loft org convention**, not a vendor requirement of the generic [observability-model.md](../observability-model.md). See [observability-platform-notes.md](../observability-platform-notes.md).

## Evidence repositories

| Role | Repository |
| --- | --- |
| Helm chart (`web-server`) | [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) |
| Reference apps (AIOps) | [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge), [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight), [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft), [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) |
| Datadog IaC (teams, monitors) | [loft-br/infra-live](https://github.com/loft-br/infra-live) (`live/datadog/`) |
| Deploy action (image tag → `DD_VERSION`) | [loft-br/actions](https://github.com/loft-br/actions) |

## Documents in this pack

| Document | Content |
| --- | --- |
| [overview.md](overview.md) | Platform role, agent on EKS, chart vs app responsibilities |
| [documentation-prerequisites.md](documentation-prerequisites.md) | **Logs in Datadog** as Loft documentation gate |
| [k8s-datadog-enablement.md](k8s-datadog-enablement.md) | `datadog` block in `values.yaml`, env injection, tolerations |
| [application-instrumentation.md](application-instrumentation.md) | Kotlin, TypeScript/Node, Python recipes |
| [structured-logging.md](structured-logging.md) | JSON logs, trace correlation, retention, no secrets/PII |
| [datadog-usage-guide.md](datadog-usage-guide.md) | Operator guide: APM, Logs, dashboards, monitors |
| [verification-checklist.md](verification-checklist.md) | Post-deploy verification |

## Scope

- Services on Loft **EKS** using the **`web-server`** chart from `k8s-apps`.
- **Logs** are the minimum observability signal for Loft operational documentation readiness.
- Does not replace squad-specific runbooks or org-wide Datadog onboarding (`[pending: official Datadog onboarding runbook URL]`).

## Known as-is gaps (AIOps reference apps)

| Gap | Evidence |
| --- | --- |
| Chart enables Datadog env in **production** by default even without explicit `datadog:` in values | [web-server `_helpers.tpl`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl) (`web-server.datadogEnabled`) |
| Reference app values omit explicit `datadog:` block | [aiops-dataforge-api values.yaml](https://github.com/loft-br/k8s-apps/blob/main/clusters/cross-prod/deployments/aiops-dataforge/aiops-dataforge-api/values.yaml) |
| App-level APM (e.g. `ddtrace-run`) not observed in DataForge backend entrypoint | [backend/entrypoint.sh](https://github.com/loft-br/aiops-dataforge/blob/main/backend/entrypoint.sh) uses `gunicorn` without `ddtrace-run` |
| Baseline dashboards/monitors per service | `[pending: squad Datadog dashboard standard]` |

Document gaps honestly; do not claim **Implemented** without evidence.
