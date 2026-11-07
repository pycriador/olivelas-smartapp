# AVA — Slack recognition and feedback bot

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/ava-prod.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

As-is notes for [loft-br/ava-prod](https://github.com/loft-br/ava-prod) in the Olivelas catalog.

## Summary

Slack bot (**AVA**) for peer recognition (`/brilhou`), development feedback (`/evoluir`), history, and leadership review (`/avaliar`). Production repo separate from `Bot-AVA` (ADR-002).

**No React frontend.** User surface = Slack (Socket Mode). Only HTTP endpoint: `GET /health` on `:8080` for k8s probes.

| Item | Value |
| --- | --- |
| Python | 3.12 image; `>=3.11` in pyproject |
| Package name | `brilhou-bot` |
| Stack | `slack-bolt`, `apscheduler`, `psycopg`, **uv** |
| Deploy | single workflow → namespace `ava-prod`, Vault `ai-ops/ava-prod/secrets` |
| Replicas | **1** (in-process scheduler) |

Active slash commands: `/brilhou`, `/evoluir`, `/histórico`, `/avaliar` (SCIM-gated). Dormant: `/avaliacao`, `/historico-time`.

Fuller detail: [pt-BR ava-prod](../../pt-BR/aiops-apps/ava-prod.md).
