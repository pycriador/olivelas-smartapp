---
title: "Security Control: CTRL-001 admin edge auth (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
control_id: "CTRL-001"
---

# Security Control: CTRL-001 admin edge auth

> Language: pt-BR | [English](../en/control.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Control ID: CTRL-001
>
> **Exemplo ficcional — não é um projeto real.**

## Resumo

Controle preventivo: o edge-gateway rejeita requisições não autenticadas às rotas do catalog-admin-api antes de chegarem à aplicação.

## Identidade

| Campo | Valor |
| --- | --- |
| Control ID | CTRL-001 |
| Nome | Edge authentication for catalog admin routes |
| Tipo | Preventive |
| Status | Active |
| Owner | example-team |

## Desenho

| Campo | Valor |
| --- | --- |
| O que faz | Valida identidade de serviço do chamador no trust boundary e bloqueia identidade ausente/inválida |
| Onde se aplica | Trust boundary: borda Public/Internal → catalog-admin-api |
| Requisitos vinculados | REQ-SEC-001 |
| Riscos / ameaças vinculados | RISK-001, THR-001 |
| Resumo do mecanismo | Política do gateway referencia config do provedor de identidade pelo nome; credenciais nunca ficam nos docs |
| Classificação | Confirmed (exemplo) |

## Operação

| Campo | Valor |
| --- | --- |
| Monitoramento / detecção | Contadores de falha de auth; nome do alerta: `catalog-admin-auth-failures` (exemplo) |
| Modo de falha se o controle falhar | Escritas admin não autenticadas possíveis → elevar RISK-001 |
| Refs de evidência | Nome da política: `catalog-admin-edge-auth`; teste: `admin-write-rejects-unauthenticated` |
| Exceções relacionadas | EXC-001 não desativa este controle |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Requirement | ../requirement/ |
| Risk | ../risk/ |
| Threat | ../threat/ |
| Security test | ../security-test/ |
