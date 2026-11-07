---
id: REF-AIOPS-TEAM-011
title: "AIOps — Troubleshooting"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Troubleshooting

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/troubleshooting.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Cross-cutting runbook for incidents and common issues in AIOps services. **App-specific troubleshooting** lives in each repository README (level 3).

## General flow

```text
Datadog alert / user report
  → Identify app and k8s namespace
  → Logs/traces in Datadog (service tag)
  → Health endpoint (/api/health, /health)
  → Vault secrets / recent deploy
  → Escalate to product owner
```

## Quick checks

| Symptom | Check |
| --- | --- |
| 502/503 on corp | Kong route, pods in namespace, k8s probes |
| Auth failure | JWT/SSO config, Vault secrets, CORS origins |
| Slack bot offline (AVA) | Socket Mode tokens, single replica, `app.py` logs |
| Deploy failed | GitHub Actions log, ECR push, k8s-apps Argo sync |

## By layer

| Layer | Doc |
| --- | --- |
| Deploy / k8s | [../loft-infra/publish-guide.md](../loft-infra/publish-guide.md) |
| Kong | [../loft-infra/kong-gateway.md](../loft-infra/kong-gateway.md) |
| Vault | [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md) |
| Datadog | [../loft-observability/datadog-usage-guide.md](../loft-observability/datadog-usage-guide.md) |

## By application (level 2 → 3)

| App | Level 2 doc | Level 3 README |
| --- | --- | --- |
| DataForge | [dataforge.md](../aiops-apps/dataforge.md) | [README](https://github.com/loft-br/aiops-dataforge/blob/main/README.md) |
| Deep Insight | [deep-insight.md](../aiops-apps/deep-insight.md) | [README](https://github.com/loft-br/aiops-deep-insight/blob/main/README.md) |
| Qualidade | [qualidade-loft.md](../aiops-apps/qualidade-loft.md) | [README](https://github.com/loft-br/qualidade-loft/blob/main/README.md) |
| Loft Carteiras | [loft-carteiras.md](../aiops-apps/loft-carteiras.md) | [README](https://github.com/loft-br/aiops-loft-carteira/blob/main/README.md) |
| AVA | [ava-prod.md](../aiops-apps/ava-prod.md) | [README](https://github.com/loft-br/ava-prod/blob/main/README.md) |

## Related

- [observability.md](observability.md)
- [applications.md](applications.md)
