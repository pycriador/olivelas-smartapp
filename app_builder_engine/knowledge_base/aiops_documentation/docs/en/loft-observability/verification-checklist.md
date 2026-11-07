# Verification checklist — Datadog (Olivelas)

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-observability/verification-checklist.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Run after deploying or changing observability for a Olivelas EKS service. Pair with [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md).

## Kubernetes / chart

- [ ] `application.environment` correct (`production`, `homologation`, …)
- [ ] Datadog enablement understood: explicit `datadog.enabled` or production default — [k8s-datadog-enablement.md](k8s-datadog-enablement.md)
- [ ] Pod has `DD_SERVICE`, `DD_ENV`, `DD_VERSION`, `DD_LOGS_INJECTION`, `DD_AGENT_HOST`
- [ ] No duplicate/conflicting `DD_*` in `environmentVariables`
- [ ] Datadog toleration present when enabled
- [ ] Argo CD application Healthy

## Application — logs (required)

- [ ] Logs are **JSON** (one object per line) to stdout/stderr
- [ ] Logs appear in **Datadog Logs** for `service:` + `env:` filters
- [ ] No secrets or unnecessary PII in log payloads
- [ ] Health check noise acceptable (excluded or low volume)
- [ ] Project [templates/observability.md](../templates/observability.md) Logging = `Implemented` or `Partial` with listed gaps

## Application — traces (recommended)

- [ ] APM library configured ([application-instrumentation.md](application-instrumentation.md))
- [ ] Service visible under **APM → Services**
- [ ] HTTP resources use route templates, not unbounded URLs
- [ ] Trace ↔ log correlation works on sample request

## Metrics and operations (recommended)

- [ ] Runtime metrics visible when `DD_RUNTIME_METRICS_ENABLED=true`
- [ ] Baseline dashboard exists or debt registered `[pending: …]`
- [ ] Critical monitors exist with runbook links or debt registered
- [ ] On-call knows Datadog service name and env

## Documentation gate (Olivelas)

- [ ] [documentation-prerequisites.md](documentation-prerequisites.md) satisfied for production
- [ ] Evidence links (GitHub blob URLs) in project observability doc
- [ ] Gaps registered in documentation/reliability debt if not Implemented

## Sign-off

| Field | Value |
| --- | --- |
| Service | |
| `DD_SERVICE` / `DD_ENV` | |
| Verified by | |
| Date | YYYY-MM-DD |
| Result | Pass / Pass with debt / Fail |

## Related documents

- [datadog-usage-guide.md](datadog-usage-guide.md)
- [../operational-readiness-checklist.md](../operational-readiness-checklist.md)
