---
title: "Security Exception: EXC-001 public marketing read (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-09-07"
version: "1.0"
exception_id: "EXC-001"
---

# Security Exception: EXC-001 public marketing read

> Language: pt-BR | [English](../en/exception.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Exception ID: EXC-001
>
> **Exemplo ficcional — não é um projeto real.**

## Resumo

Aprovação com prazo para expor um subconjunto Public do catálogo sem autenticação do chamador, para campanha de microsite de marketing.

## Campos obrigatórios

| Campo | Valor |
| --- | --- |
| Exception ID | EXC-001 |
| **Requirement** | Default de authn em leitura pública (política de exemplo) — dispensado só para campos Public; REQ-SEC-001 (escritas admin) permanece |
| **Reason** | Microsite de campanha precisa de browse não autenticado do subconjunto Public |
| **Risk** | Inferência residual de RISK-001 em campos Public; sem campos Internal na resposta |
| **Compensating control** | Rate limit na borda `EDGE_LOOKUP_RATE_LIMIT`; allowlist de campos só Classification Public |
| **Owner** | example-team |
| **Approval** | example-security-approver (papel) |
| **Expiration** | 2026-09-30 |

## Status

| Campo | Valor |
| --- | --- |
| Status | Approved |
| Aprovado em | 2026-08-01 |
| Última revisão | 2026-08-07 |

## Contexto

| Campo | Valor |
| --- | --- |
| Vulnerabilidade / dívida vinculada | Nenhuma |
| Monitoramento enquanto ativo | Alertas de volume de lookup público; testes que negam projeção de campos Internal |
| Classificação | Confirmed (exemplo) |

## Encerramento

| Campo | Valor |
| --- | --- |
| Motivo de fechamento | — (aberto até a expiração) |
| Fechado em | — |
| Follow-ups | Reverter caminho de leitura pública à política padrão após a campanha |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Requirement | ../requirement/ |
| Risk | ../risk/ |
| Control | ../control/ |
| Incident | ../incident/ |
