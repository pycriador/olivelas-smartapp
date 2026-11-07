# Segurança nas apps Olivelas

> Language: pt-BR | [English (EN)](../../en/aiops-apps/security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

Padrões **as-is** nos quatro repos. Segredos e Vault: [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md). Exposição Kong/IP: [../loft-infra/kong-gateway.md](../loft-infra/kong-gateway.md).

## Autenticação

### JWT (maioria)

| App | Mecanismo |
| --- | --- |
| DataForge | `Flask-JWT-Extended` — access + refresh; refresh em **cookies**; claims de user e service account |
| Deep Insight | `PyJWT` + validação de secret (≥32 chars) no boot |
| Qualidade | `python-jose` — Bearer após SSO JumpCloud |
| Carteiras | `Flask-JWT-Extended` — `/auth/v1/token`, signup |

DataForge ainda autentica por **API token** no header (resolvido em `app/utils/auth.py` depois do JWT opcional) e **service accounts** (`POST /api/auth/service-account`).

### SSO (Qualidade)

- OAuth JumpCloud (`JUMPCLOUD_TOKEN_URL = https://oauth.id.jumpcloud.com/oauth2/token`).
- Fluxo com state/nonce; handoff para o front via form POST (comentário no código: ALB/Cognito quebra `?token=`).
- Waiting room / aprovação admin antes do primeiro acesso efetivo.
- Callback front: `/auth/callback`.

### Slack + SCIM (AVA)

- Autenticação de usuários = plataforma Slack (Socket Mode + bot/app tokens).
- `/avaliar` gated por mapa líder→liderados via **Slack SCIM** (`SLACK_SCIM_TOKEN`); sem token → bloqueia todos (fail closed).
- Avaliação nunca é enviada ao liderado nem postada em canal.
- Sem JWT/CORS de app web; HTTP público limitado a `/health`.
- Secrets: `SLACK_*`, DB, `GEMINI_API_KEY`, etc. em Vault `ai-ops/ava-prod/secrets`.

## Autorização

| Camada | Exemplos |
| --- | --- |
| Backend permissions | DataForge `can(...)` / permissions em services; Carteiras IAM (`iam.me`, `has_role`) |
| Front route guards | Qualidade `ProtectedRoute` / `PermissionRoute anyPrefix="report."`; Carteiras `requireIamPermission` |
| Active user | Qualidade bloqueia `profile.is_active === false` com mensagem em PT |
| Slack leadership | AVA `/avaliar` só com liderados mapeados via SCIM |

## CORS

| App | Comportamento observado |
| --- | --- |
| Deep Insight | Lista explícita em `CORS_ORIGINS`; **falha o boot** se vazio em production ou se contém `*` |
| Qualidade | `CORSMiddleware` com `settings.cors_origin_list`, credentials habilitados |
| DataForge / Carteiras | Flask-CORS a partir da config da app |

Front corp e API corp em hosts diferentes → CORS obrigatório quando o browser chama a API direto (DataForge/Deep Insight). Qualidade pode usar host interno da API no build.

## Headers HTTP (Deep Insight como referência explícita)

`backend/app/security.py` aplica em `after_request`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restritiva
- `Cache-Control: no-store` / `Pragma: no-cache`
- `Cross-Origin-Resource-Policy: same-site`
- `Strict-Transport-Security` se HTTPS ou `FORCE_HSTS=true`

DataForge/Carteiras usam `TRUST_PROXY` / `FORCE_HSTS` via env no `k8s-apps` values.

## Proxy / Kong

- Apps atrás do Kong setam `TRUST_PROXY=true` e usam `ProxyFix` (Deep Insight) para respeitar `X-Forwarded-*`.
- APIs em gateway **external** podem ter `ip-restriction` (Netskope) — camada de rede além da app.

## Secrets e config

| Faça | Não faça |
| --- | --- |
| Vault KV + `application.vaultSecrets` | Commitar `.env` com valores |
| `.env.example` só com nomes | Logar JWT, passwords, tokens |
| Rotacionar se vazou no Git | `CORS_ORIGINS=*` em produção |
| JWT secret longo (DI exige ≥32) | Hardcode de API keys no front |

Scripts: `scripts/vault/push_secrets.py` (DataForge, Deep Insight, …).

## Front — sessão e 401

- Clients HTTP anexam Bearer/cookie conforme o app.
- 401 → redirect `/login` (guards TanStack / RR).
- Carteiras: cache IAM com fallback se backend indisponível **somente** se permissão já estava em cache.

## Checklist rápido de segurança (app)

- [ ] Auth em todas as rotas sensíveis (`@login_required` / Depends / IAM)
- [ ] Health público sem vazamento de secret
- [ ] CORS allowlist = hosts corp reais
- [ ] Headers de segurança (ou equivalentes no gateway)
- [ ] Secrets só via Vault/env
- [ ] Guards de UI alinhados às permissions do backend (UI não é a única barreira)

## Relacionados

- [routes.md](routes.md) · [backend-stack.md](backend-stack.md) · [ava-prod.md](ava-prod.md) · [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md)
