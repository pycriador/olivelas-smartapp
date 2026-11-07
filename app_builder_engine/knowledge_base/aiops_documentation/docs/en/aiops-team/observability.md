---
id: REF-OLIVELAS-TEAM-010
title: "Olivelas — Observability"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Observability

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/observability.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Observability practices for the Olivelas team. **Full pack:** [../loft-observability/README.md](../loft-observability/README.md).

## Platform

| Signal | Tool |
| --- | --- |
| Metrics, logs, traces | **Datadog** (Olivelas standard) |
| Agent | Available on EKS nodes (`loft-infra-cloud`) |

## Per-service checklist

1. `web-server` chart with Datadog enabled — [../loft-observability/k8s-datadog-enablement.md](../loft-observability/k8s-datadog-enablement.md)
2. Structured JSON logs — [../loft-observability/structured-logging.md](../loft-observability/structured-logging.md)
3. APM by stack — [../loft-observability/application-instrumentation.md](../loft-observability/application-instrumentation.md)
4. Post-deploy verification — [../loft-observability/verification-checklist.md](../loft-observability/verification-checklist.md)

## Operators

Datadog usage guide: [../loft-observability/datadog-usage-guide.md](../loft-observability/datadog-usage-guide.md).

## Related

- [troubleshooting.md](troubleshooting.md)
- [technical-standards.md](technical-standards.md)
