---
title: "Security overview — SheetLedger (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Security overview

> Language: pt-BR | [English](../../../en/docs/security/overview.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional.** Threat model formal: Unknown.

## Propósito

Resumo de autenticação, autorização, trust boundaries e controles observáveis **no exemplo**.

## Authn (Confirmed within example)

1. JWT de usuário
2. API token de usuário
3. Login de service account → JWT

## Authz (Confirmed within example)

Roles ilustrativas; escopos `global|group|own|none`; avaliação por permissão granular.

## Controles

| Controle | Status | Classification |
| --- | --- | --- |
| Rate limiting | Implemented (ilustrativo) | Confirmed (within example) |
| Version rewrite | Implemented (ilustrativo) | Confirmed (within example) |
| Audit log | Implemented (ilustrativo) | Confirmed (within example) |
| Storage credentials encrypted | Implemented (ilustrativo) | Confirmed (within example) |
| Threat model | Unknown | Unknown |

## Secrets

Nunca em docs. Env/secret store apenas. Ver padrão Olivelas de secrets quando aplicável à org — não é requisito deste framework.

## Relacionados

- [../contracts/api-tokens.md](../contracts/api-tokens.md)
- [../contracts/service-accounts.md](../contracts/service-accounts.md)
- [../knowledge-gaps.md](../knowledge-gaps.md)
