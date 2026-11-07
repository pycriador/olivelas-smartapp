# Structured logging for Datadog

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-observability/structured-logging.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

**Structured logs** are the minimum observability signal for Olivelas operational documentation — [documentation-prerequisites.md](documentation-prerequisites.md).

## Requirements

| Rule | Detail |
| --- | --- |
| Format | **One JSON object per log line** on stdout/stderr |
| Destination | Container stdout → Datadog agent → Datadog Logs |
| Correlation | With `DD_LOGS_INJECTION=true`, traces link to logs; optionally include `trace_id` / `span_id` in JSON |
| Language | Log **messages** for operators may be English; user-facing UI copy stays pt-BR per Olivelas language policy |
| Secrets | **Never** log credentials, tokens, full CPF/CNPJ, bank data — placeholders only |
| PII | Mask or omit; default deny for document examples |

## Recommended fields

| Field | Purpose |
| --- | --- |
| `timestamp` | ISO 8601 |
| `level` | `info`, `warn`, `error`, … |
| `message` | Human-readable summary |
| `service` | Optional in payload — also set via `DD_SERVICE` |
| `env` | Optional — also set via `DD_ENV` |
| `trace_id`, `span_id` | When manual correlation needed (Python) |
| `request_id` / correlation id | Cross-service debugging |
| `http.method`, `http.route` | Prefer route template, not raw URL with ids |

Avoid high-cardinality labels in log attributes (raw URLs, user ids as metric tags).

## Chart support

When Datadog is enabled, the chart sets `DD_LOGS_INJECTION=true` ([\_helpers.tpl](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl)).

Some stacks also receive default `LOG_FORMAT=ndjson` and `LOG_LEVEL=info` from the chart when not overridden — confirm for your language stack in the same template block.

## Retention

Non-production temporary enablement uses `datadog.ttl` (e.g. `7d`, chart default `eod` for opt-in annotations).

Production retention follows org Datadog account policies (`[pending: Olivelas log retention policy link]`).

## Health checks and noise

Health probe traffic should not dominate logs. Options:

- Log health checks at `debug` only, or
- Rely on chart log exclusion patterns where configured ([k8s-datadog-enablement.md](k8s-datadog-enablement.md)).

## Example query (Datadog Logs)

```text
service:aiops-dataforge-api env:production status:error
```

Replace service/env with your `DD_SERVICE` / `DD_ENV`.

## Project documentation

In [templates/observability.md](../templates/observability.md) **Logging** section, record:

| Field | Value |
| --- | --- |
| Status | `Implemented` / `Partial` / … |
| What is logged | Request errors, business events, audit trail, … |
| What must not be logged | Secrets, PII policy |
| Correlation identifiers | `request_id`, trace injection |
| Evidence | Datadog query or link `[pending: …]` |

## Related documents

- [application-instrumentation.md](application-instrumentation.md)
- [datadog-usage-guide.md](datadog-usage-guide.md)
- [verification-checklist.md](verification-checklist.md)
