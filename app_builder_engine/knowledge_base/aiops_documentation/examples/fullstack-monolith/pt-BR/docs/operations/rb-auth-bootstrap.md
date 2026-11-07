---
title: "Runbook — Bootstrap admin (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Runbook: bootstrap admin

> Language: pt-BR | [English](../../../en/docs/operations/rb-auth-bootstrap.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / Fictional example.**

## Quando usar
Ambiente novo sem usuário Admin; login impossível.

## Comportamento ilustrativo
Bootstrap cria o primeiro Admin quando variáveis de ambiente dedicadas existem e nenhum admin está presente.

## Procedimento
1. Definir env no secret store (nunca commitadas)
2. Subir/reiniciar a API
3. Validar login na UI
4. Rotacionar/remover senha de bootstrap
5. Criar usuários adicionais via procedimento operacional do projeto

## Segurança
Não logar senha. Não documentar valores.

## Relacionados

- [service-profile.md](service-profile.md)
- [../security/overview.md](../security/overview.md)

