# Common routes — API and frontend

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/routes.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

| Pattern | Examples |
| --- | --- |
| API prefix | `/api/...` (most apps); Carteiras `/auth/v1`, `/rest/v1`, `/public/v1` |
| Health | `/health`, `/api/health` |
| Auth | `/api/auth/login|refresh|logout|me`; Qualidade JumpCloud; Carteiras `/auth/v1/token` |
| Slack (AVA) | `/brilhou`, `/evoluir`, `/histórico`, `/avaliar`; HTTP `/health` only |

DataForge: projects, admin, tokens, imports, comparisons. Deep Insight: `/api/knowledge`, `/api/conversations`, `/api/ai`, `/external`. Qualidade: content, chat, confluence, admin analytics. Carteiras: portfolio/dashboard UI + Slack/WhatsApp public routes. AVA: Slack bot — [ava-prod.md](ava-prod.md).

Fuller tables: [pt-BR routes](../../pt-BR/aiops-apps/routes.md).
