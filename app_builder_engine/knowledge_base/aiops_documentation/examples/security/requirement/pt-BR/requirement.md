---
title: "Security Requirement: REQ-SEC-001 admin write authn (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
requirement_id: "REQ-SEC-001"
---

# Security Requirement: REQ-SEC-001 admin write authn

> Language: pt-BR | [English](../en/requirement.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Requirement ID: REQ-SEC-001
>
> **Exemplo ficcional — não é um projeto real.**

## Resumo

Operações de mutação no admin do catálogo devem autenticar o chamador antes que qualquer escrita chegue ao catalog-store.

## Identidade

| Campo | Valor |
| --- | --- |
| Requirement ID | REQ-SEC-001 |
| Nome | Authenticated catalog admin writes |
| Categoria | authn |
| Status | Active |
| Owner | example-team |

## Declaração

| Campo | Valor |
| --- | --- |
| Requisito | Toda escrita no catalog-admin-api DEVE apresentar identidade de serviço válida aceita pelo edge-gateway antes da persistência |
| Justificativa | Proteger integridade de AST-001 e confidencialidade de campos Internal |
| Escopo | catalog-admin-api; exclui catalog-api somente leitura pública |
| Ativos / ameaças / riscos vinculados | AST-001, THR-001, RISK-001 |
| Classificação | Confirmed (exemplo) |

## Satisfação

| Campo | Valor |
| --- | --- |
| Controles vinculados | CTRL-001 |
| Refs de evidência | Seção de authn do contrato (ficcional); nome de config `CATALOG_ADMIN_AUTH_MODE` |
| Exceções | EXC-001 (somente leitura pública — não dispensa este requisito de escrita) |
| Verificação | Nome da suíte de integração: `admin-write-rejects-unauthenticated` (exemplo) |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Control | ../control/ |
| Exception | ../exception/ |
| Asset | ../asset/ |
