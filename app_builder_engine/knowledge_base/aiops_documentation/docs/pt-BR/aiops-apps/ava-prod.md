# AVA — bot Slack de reconhecimento e feedback

> Language: pt-BR | [English (EN)](../../en/aiops-apps/ava-prod.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

Documentação **as-is** do app [loft-br/ava-prod](https://github.com/loft-br/ava-prod) no catálogo AIOps. Evidência cruzada com a documentação do próprio repo (`docs/` em `ava-prod`) e com código/`pyproject.toml`/`Dockerfile`/workflow.

## O que é

Bot Slack (**AVA**) para reconhecimento entre colegas (`/brilhou`), feedback de desenvolvimento (`/evoluir`), histórico e avaliação de liderança (`/avaliar`). Produção isolada de `loft-br/Bot-AVA` (homolog/legado) — ver ADR-002 no repo do app.

Não é um monorepo front+API: **não há UI React**. A superfície de usuário é o **Slack**; o processo Python só expõe HTTP para `GET /health` (probes k8s).

## Stack

| Item | Valor observado |
| --- | --- |
| Linguagem | Python 3.12 (imagem); `requires-python >=3.11` |
| Package name (`pyproject.toml`) | `brilhou-bot` |
| Framework Slack | `slack-bolt` (Socket Mode) |
| DB | PostgreSQL via `psycopg[binary]` |
| Scheduler | `apscheduler` (lembrete semanal + refresh config) |
| HTTP client | `requests` |
| Google | `google-auth` (Sheets opcional; webhook Apps Script legado) |
| Empacotamento | **uv** (`uv.lock`); `uv sync --frozen` no Docker |
| Processo | monólito `app.py` |
| Health | `ThreadingHTTPServer` porta **8080**, `GET /health` |

## Organização do repositório

```text
ava-prod/
├── app.py                         # bot + healthcheck
├── pyproject.toml / uv.lock
├── Dockerfile
├── db/                            # SQL migrations (registros, config_*)
├── deploy/k8s/ava-prod/values.yaml
├── .github/workflows/prod-k8s-deployment.yml
├── .env.example
└── docs/                          # documentação as-is do próprio produto
```

## Deploy (padrão Loft)

| Campo | Valor |
| --- | --- |
| Workflow | `prod-k8s-deployment.yml` (um só — sem front) |
| Action | `loft-br/actions/deploy` |
| `name` / `namespace` | `ava-prod` |
| `aws-account` / `product` | `cross` / `ai-ops` |
| `platforms` | `linux/arm64` |
| `context` / `dockerfile` | `.` / `Dockerfile` |
| k8s-apps | `clusters/cross-prod/deployments/ava-prod/ava-prod/` |
| Vault | `mount: cross`, `path: ai-ops/ava-prod/secrets` |
| Réplicas | **1** (APScheduler no processo — multi-réplica duplicaria lembretes) |
| Ingress / Kong corp | Não aplicável como UI web; Socket Mode = conexão de saída |

## Comandos Slack (ativos)

| Comando | Papel | AuthZ |
| --- | --- | --- |
| `/brilhou` | Reconhecimento (card no canal + DM) | Qualquer pessoa |
| `/evoluir` | Feedback de desenvolvimento (DM opcional) | Qualquer pessoa |
| `/histórico` | Consulta ephemeral do próprio histórico | Só o próprio usuário |
| `/avaliar` | Líder avalia liderado (Cultura/Potencial) | Só quem tem liderados via **SCIM** |

Desativados (código dormente): `/avaliacao`, `/historico-time`.

## Segurança (resumo)

- Tokens Slack (`SLACK_BOT_TOKEN`, `SLACK_APP_TOKEN`, `SLACK_SCIM_TOKEN`) e DB/Gemini via Vault.
- Sem `SLACK_SCIM_TOKEN` → `/avaliar` bloqueia todo mundo (fail closed).
- Resultado de `/avaliar` **nunca** vai ao liderado nem a canal público.
- Sem API HTTP pública além do health; sem JWT/CORS de app web.

Detalhes no pack: [security.md](security.md). Docs autoritativos do produto: no repo `ava-prod` (`docs/security/overview.md`, `docs/contracts/slash-commands.md`).

## Relacionados

- [overview.md](overview.md) · [backend-stack.md](backend-stack.md) · [routes.md](routes.md)
- Infra: [../loft-infra/overview.md](../loft-infra/overview.md) · [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md)
