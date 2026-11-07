# Datadog usage guide (operators)

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-observability/datadog-usage-guide.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Practical guide for engineers and operators triaging Olivelas services on EKS. Org URL: `[pending: Olivelas Datadog organization URL]`.

## Before you start

Know from `k8s-apps` values or documentation:

| Token | Where |
| --- | --- |
| `DD_SERVICE` | `application.name` or `datadog.service` |
| `DD_ENV` | `application.environment` |
| `DD_VERSION` | Image tag (deploy action) |

See [k8s-datadog-enablement.md](k8s-datadog-enablement.md).

## 1. Find the service (APM)

1. Open **APM → Services**.
2. Filter by `env:production` (or your environment).
3. Select the service matching `DD_SERVICE`.

Confirm:

- Request volume and error rate visible.
- Resource names use **route templates** (e.g. `GET /api/health`), not unbounded paths.

## 2. Inspect traces

1. Open a trace from a slow or failed request.
2. Check spans: HTTP server, database, outbound HTTP.
3. Use **Logs** tab on the span — should show correlated JSON log lines when [structured logging](structured-logging.md) and instrumentation are correct.

If Logs tab is empty: check app JSON logs, `ddtrace` / Java agent, and `DD_LOGS_INJECTION`.

## 3. Search logs (Logs Explorer)

Common queries:

```text
service:<DD_SERVICE> env:<DD_ENV>
service:<DD_SERVICE> env:<DD_ENV> status:error
service:<DD_SERVICE> env:<DD_ENV> @http.status_code:>=500
```

Tips:

- Narrow time range around an incident.
- Add `@request_id:` or custom fields your app emits.
- Do not share queries containing secrets or PII in tickets.

## 4. Dashboards (RED baseline)

For each production service, expect (or plan) a dashboard covering:

| Signal | Examples |
| --- | --- |
| **Rate** | Requests per second |
| **Errors** | Error rate, 5xx count |
| **Duration** | p50/p95/p99 latency |

Saturation (CPU/memory) may come from infrastructure metrics.

`[pending: standard Olivelas service dashboard template ID]`

## 5. Monitors and alerts

Monitors should:

- Fire on **actionable** conditions (SLO breach, error spike, pod crash loop).
- Link to a **runbook** in project docs.
- Route to the owning squad channel/on-call.

Do not document monitor IDs unless they exist — register debt if missing.

## 6. During an incident

Suggested order:

1. **APM** — error rate and latency regression on `DD_SERVICE`.
2. **Logs** — `status:error` around incident start; follow `trace_id`.
3. **Dependencies** — downstream spans (DB, HTTP clients).
4. **Deploy correlation** — compare `DD_VERSION` / image tag with deploy time.
5. **Runbook** — project `runbooks/` per [operations-model.md](../operations-model.md).

## 7. What to document after triage

Update project observability doc with:

- Queries that worked.
- Gaps found (missing fields, no correlation).
- Monitor/dashboard debt with owner.

## Related documents

- [verification-checklist.md](verification-checklist.md)
- [documentation-prerequisites.md](documentation-prerequisites.md)
- [../monitoring.md](../monitoring.md)
- [../alerting.md](../alerting.md)
