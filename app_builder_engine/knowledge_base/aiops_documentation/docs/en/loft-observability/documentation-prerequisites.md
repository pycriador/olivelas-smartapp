# Documentation prerequisites — logs in Datadog (Loft)

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-observability/documentation-prerequisites.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Loft-specific gate for **operational documentation readiness**. This does **not** change the vendor-agnostic [observability-model.md](../observability-model.md) or [observability-platform-notes.md](../observability-platform-notes.md).

## When this applies

| Context | Rule |
| --- | --- |
| Service running on **Loft EKS** with `web-server` chart | Applies |
| Library, CLI, or non-Kubernetes workload | Document observability honestly; Datadog may be N/A with evidence |
| Framework-only adoption (not Loft infra) | See generic template only |

## Prerequisite: logging

Before treating operational documentation as **complete** for a Loft production service:

1. Fill [templates/observability.md](../templates/observability.md) (or project equivalent under `operations/observability.md`).
2. Set **Logging → Status** to one of:
   - **`Implemented`** — structured logs ingested in Datadog; evidence linked (service name, env, sample query or screenshot path).
   - **`Partial`** — logs reach Datadog but gaps exist (missing correlation, wrong format, health-check noise); gaps listed.
   - **Not Applicable** — only with written justification (e.g. batch job with no runtime logs).
3. **Do not** leave Logging as **`Not Documented`** or silent when the service is in production on EKS.

If the org expects Datadog and the service does **not** yet ingest logs:

- Register **[documentation debt](../documentation-debt.md)** or project `knowledge-gaps.md` with owner, priority, and target date.
- Do not mark the service profile or operational readiness checklist as fully passed.

## What is required vs what can lag

| Signal | Loft documentation gate | Notes |
| --- | --- | --- |
| **Logs** (structured, Datadog) | **Required** for readiness | Minimum for incident triage |
| **Traces / APM** | Recommended; may be `Partial` + debt | See [application-instrumentation.md](application-instrumentation.md) |
| **Metrics / dashboards** | Recommended; may be `Partial` + debt | Do not invent dashboard URLs |
| **Monitors / alerts** | Recommended before high criticality | Link runbook or debt |

## Evidence to attach in project docs

| Field | Example |
| --- | --- |
| Datadog service name | Same as `DD_SERVICE` / `application.name` |
| Environment | `production`, `homologation`, `development` (`DD_ENV`) |
| Log query | `service:my-api env:production` |
| Trace correlation | Confirm logs tab on APM span shows entries |
| Retention class | From `datadog.ttl` when set — [k8s-datadog-enablement.md](k8s-datadog-enablement.md) |

Use GitHub blob links for code/config evidence — [publishing-surfaces.md](../publishing-surfaces.md).

## Review checklist (doc author)

- [ ] Logging status is explicit (`Implemented` / `Partial` / N/A), not omitted
- [ ] Datadog service + env documented or marked Unknown with debt
- [ ] No secrets or PII in example log lines
- [ ] Cross-link to this pack from project observability doc
- [ ] EN/pt-BR mirrors updated if the project is bilingual

## Related documents

- [verification-checklist.md](verification-checklist.md)
- [structured-logging.md](structured-logging.md)
- [../operational-readiness-checklist.md](../operational-readiness-checklist.md)
- [../templates/observability.md](../templates/observability.md)
