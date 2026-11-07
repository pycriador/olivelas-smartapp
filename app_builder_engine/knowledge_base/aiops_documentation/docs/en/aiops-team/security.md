---
id: REF-AIOPS-TEAM-009
title: "AIOps — Security"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Security

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/security.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Cross-cutting security view for AIOps products. **Per-app detail:** [../aiops-apps/security.md](../aiops-apps/security.md).

## Principles (Confirmed)

| Principle | Implementation |
| --- | --- |
| Secrets never in git | Vault + `.env.example` without values |
| AuthN in web apps | JWT, SSO (JumpCloud in Qualidade), API tokens (DataForge) |
| AVA bot AuthN | Slack tokens + SCIM for `/avaliar` (fail closed) |
| CORS | Explicit origins; no `*` in production (Deep Insight) |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, HSTS where applicable |
| Proxy | `ProxyFix` / `TRUST_PROXY` behind Kong |

## Operational controls

| Control | Reference |
| --- | --- |
| Vault paths per app | [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md) |
| Front guards | `ProtectedRoute`, `PermissionRoute`, IAM permissions |
| Security methodology (framework) | [../security-model.md](../security-model.md) |

## By product

| App | Doc |
| --- | --- |
| All (matrix) | [../aiops-apps/security.md](../aiops-apps/security.md) |
| AVA | [../aiops-apps/ava-prod.md](../aiops-apps/ava-prod.md) (Security section) |

## Related

- [technical-standards.md](technical-standards.md)
- [troubleshooting.md](troubleshooting.md)
