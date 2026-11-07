---
title: "Contract — service-accounts (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "API"
---

# service-accounts

> Language: pt-BR | [English](../../../en/docs/contracts/service-accounts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional.** Não é contrato de produção. Stack ilustrativa ≠ padrão.

## Propósito
Identidades M2M com escopo explícito de projetos/grupos.

## Autenticação ilustrativa
`POST.../auth/service-account` com client_id/secret → JWT.

## Segurança
Secret once; status ACTIVE/DISABLED/REVOKED ilustrativos; sem shares implícitos.

## Permissões
Subset da matriz RBAC; chaves admin-only não atribuíveis a SA (ilustrativo).

## Relacionados

- [rest-api.md](rest-api.md)
- [api-tokens.md](api-tokens.md)
- [../security/overview.md](../security/overview.md)

