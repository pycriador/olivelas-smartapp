---
title: "Runbook — Database unavailable (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Runbook: database unavailable

> Language: pt-BR | [English](../../../en/docs/operations/rb-db-unavailable.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / Fictional example.**

## Sintomas
- Health com `database: false`
- HTTP 503 ilustrativo em falha de conexão
- UI Live falha em listagens autenticadas

## Verificação
1. Chamar health e inspecionar campos de database
2. Validar env de conexão **sem logar senha**
3. Reachability de rede até o DB e search_path ilustrativo

## Mitigação
1. Restaurar conectividade/credenciais
2. Reiniciar processo API se pool inconsistente
3. Confirmar retries de startup se existirem no runtime

## Escalação
Operational / on-call: **Unknown** (preencher em projetos reais).

## Evidência
Ilustrativa neste exemplo — não inventar comandos de cloud específicos.

