---
id: REF-AIOPS-TEAM-011
title: "AIOps — Troubleshooting"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Troubleshooting

> Language: pt-BR | [English (EN)](../../en/aiops-team/troubleshooting.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Runbook transversal para incidentes e problemas comuns nos serviços AIOps. **Troubleshooting específico de cada app** vive no README do repositório (nível 3).

## Fluxo geral

```text
Alerta Datadog / reporte usuário
  → Identificar app e namespace k8s
  → Logs/traces no Datadog (service tag)
  → Health endpoint (/api/health, /health)
  → Vault secrets / deploy recente
  → Escalar para owner do produto
```

## Checks rápidos

| Sintoma | Verificar |
| --- | --- |
| 502/503 no corp | Kong route, pods no namespace, probes k8s |
| Auth falha | JWT/SSO config, Vault secrets, CORS origins |
| Bot Slack offline (AVA) | Socket Mode tokens, réplica única, logs `app.py` |
| Deploy falhou | GitHub Actions log, ECR push, Argo sync k8s-apps |

## Por camada

| Camada | Doc |
| --- | --- |
| Deploy / k8s | [../loft-infra/publish-guide.md](../loft-infra/publish-guide.md) |
| Kong | [../loft-infra/kong-gateway.md](../loft-infra/kong-gateway.md) |
| Vault | [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md) |
| Datadog | [../loft-observability/datadog-usage-guide.md](../loft-observability/datadog-usage-guide.md) |

## Por aplicação (nível 2 → 3)

| App | Doc nível 2 | README nível 3 |
| --- | --- | --- |
| DataForge | [dataforge.md](../aiops-apps/dataforge.md) | [README](https://github.com/loft-br/aiops-dataforge/blob/main/README.md) |
| Deep Insight | [deep-insight.md](../aiops-apps/deep-insight.md) | [README](https://github.com/loft-br/aiops-deep-insight/blob/main/README.md) |
| Qualidade | [qualidade-loft.md](../aiops-apps/qualidade-loft.md) | [README](https://github.com/loft-br/qualidade-loft/blob/main/README.md) |
| Loft Carteiras | [loft-carteiras.md](../aiops-apps/loft-carteiras.md) | [README](https://github.com/loft-br/aiops-loft-carteira/blob/main/README.md) |
| AVA | [ava-prod.md](../aiops-apps/ava-prod.md) | [README](https://github.com/loft-br/ava-prod/blob/main/README.md) |

## Relacionados

- [observability.md](observability.md)
- [applications.md](applications.md)
