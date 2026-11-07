# Security in Olivelas apps

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

| Theme | Observed |
| --- | --- |
| JWT | Cookies (DataForge), Bearer (Qualidade/Carteiras), PyJWT + ≥32-char secret (Deep Insight) |
| SSO | JumpCloud OAuth (Qualidade) |
| API tokens / service accounts | DataForge |
| CORS | Explicit origins; Deep Insight rejects `*` and empty prod list |
| Headers | Deep Insight `security.py` (nosniff, DENY frame, HSTS, CORP, …) |
| Proxy | `TRUST_PROXY` / `ProxyFix` behind Kong |
| Secrets | Vault + `.env.example` only |
| Slack / SCIM | AVA bot tokens + leadership gate on `/avaliar` |
| UI guards | `ProtectedRoute`, `PermissionRoute`, `requireIamPermission` |

Vault details: [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md). Fuller write-up: [pt-BR security](../../pt-BR/aiops-apps/security.md). AVA: [ava-prod.md](ava-prod.md).
