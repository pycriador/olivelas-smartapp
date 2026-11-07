---
id: REF-AIOPS-TEAM-009
title: "AIOps — Segurança"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Segurança

> Language: pt-BR | [English (EN)](../../en/aiops-team/security.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Visão transversal de segurança dos produtos AIOps. **Detalhe por app:** [../aiops-apps/security.md](../aiops-apps/security.md).

## Princípios (Confirmed)

| Princípio | Implementação |
| --- | --- |
| Secrets nunca no git | Vault + `.env.example` sem valores |
| AuthN em apps web | JWT, SSO (JumpCloud no Qualidade), API tokens (DataForge) |
| AuthN bot AVA | Tokens Slack + SCIM para `/avaliar` (fail closed) |
| CORS | Origins explícitas; produção sem `*` (Deep Insight) |
| Headers de segurança | `X-Content-Type-Options`, `X-Frame-Options`, HSTS onde aplicável |
| Proxy | `ProxyFix` / `TRUST_PROXY` atrás do Kong |

## Controles operacionais

| Controle | Referência |
| --- | --- |
| Vault paths por app | [../loft-infra/vault-secrets.md](../loft-infra/vault-secrets.md) |
| Front guards | `ProtectedRoute`, `PermissionRoute`, IAM permissions |
| Metodologia segurança (framework) | [../security-model.md](../security-model.md) |

## Por produto

| App | Doc |
| --- | --- |
| Todos (matriz) | [../aiops-apps/security.md](../aiops-apps/security.md) |
| AVA | [../aiops-apps/ava-prod.md](../aiops-apps/ava-prod.md) (seção Segurança) |

## Relacionados

- [technical-standards.md](technical-standards.md)
- [troubleshooting.md](troubleshooting.md)
