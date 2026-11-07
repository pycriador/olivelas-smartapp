---
title: "Visão de segurança — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "SEC-NS-001"
type: "security"
---

# Visão de segurança (ilustrativa)

> Idioma: pt-BR | [English](../../../en/docs/security/overview.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — não é certificação de compliance.

## Ativos

| Asset | Sensitivity | Classification |
| --- | --- | --- |
| User credentials / sessions | High | Confirmed (within example) |
| Group LLM API keys (encrypted at rest) | High | Confirmed (within example) |
| External API tokens | High | Confirmed (within example) |
| Document content + chat history | High | Confirmed (within example) |
| Vault path `secrets/path/example` | High | Proposed (example only) |

## Controles (exemplo)

| Control | Approach | Classification |
| --- | --- | --- |
| Authn | Session/JWT for UI; hashed tokens for `/external` | Confirmed (within example) |
| Authz | Multi-group RBAC | Confirmed (within example) |
| Secret handling | Env/Vault; never in frontend or git | Confirmed (within example) |
| Encryption | App-level encryption for group secrets | Confirmed (within example) |
| Logging | No raw tokens, no full document dumps | Confirmed (within example) |
| Network | BFF/API private where possible | Inferred |

## Esboços de ameaça

| Threat | Mitigation sketch | Classification |
| --- | --- | --- |
| Token leakage in logs | Redaction + hashed storage | Confirmed (within example) |
| Cross-group data access | Mandatory group scope on queries | Confirmed (within example) |
| Prompt injection via docs | Unknown residual risk | Unknown |

## Relacionados

- [../contracts/external-api.md](../contracts/external-api.md)
- [../architecture/system-context.md](../architecture/system-context.md)
