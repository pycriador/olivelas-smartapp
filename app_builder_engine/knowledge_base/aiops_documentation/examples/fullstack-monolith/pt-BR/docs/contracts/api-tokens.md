---
title: "Contract — api-tokens (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "API"
---

# api-tokens

> Language: pt-BR | [English](../../../en/docs/contracts/api-tokens.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional.** Não é contrato de produção. Stack ilustrativa ≠ padrão.

## Propósito
Tokens de usuário com least privilege (interseção com RBAC efetivo).

## Princípios
| Princípio | Notas |
| --- | --- |
| Least privilege | permissions ⊆ user |
| Secret once | plaintext só no create/rotate |
| Audit | evento de uso ilustrativo |

## Autenticação ilustrativa
Bearer ou header dedicado; prefixo ilustrativo `df_live_*`.

## Escopo de projeto
Mesma visibilidade do usuário dono (shares/grupos) — ilustrativo.

## Relacionados

- [rest-api.md](rest-api.md)
- [../security/overview.md](../security/overview.md)
- [service-accounts.md](service-accounts.md)

