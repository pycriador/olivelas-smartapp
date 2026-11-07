---
title: "Threat: THR-001 bulk catalog enumeration (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
threat_id: "THR-001"
---

# Threat: THR-001 bulk catalog enumeration

> Language: pt-BR | [English](../en/threat.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Threat ID: THR-001
>
> **Exemplo ficcional — não é um projeto real.**

## Resumo

Um ator externo automatiza lookups em alto volume na borda pública do catálogo para inferir padrões de faixas de preço Internal a partir do formato ou timing das respostas.

## Identidade

| Campo | Valor |
| --- | --- |
| Threat ID | THR-001 |
| Nome | Bulk catalog enumeration via public edge |
| Categoria de ator | external |
| Status | Mitigated |

## Alvo

| Campo | Valor |
| --- | --- |
| Ativo(s) afetado(s) | AST-001 |
| Trust boundary / superfície | Internet pública → edge-gateway → catalog-api (Exposed) |
| Caminho de entrada | Interface pública de lookup de catálogo (nome genérico: `/v1/catalog/items`) |

## Cenário

| Campo | Valor |
| --- | --- |
| Como poderia ocorrer | Clientes automatizados emitem muitas consultas distintas e correlacionam respostas |
| Pré-condições | Caminho de leitura pública alcançável; rate limits fracos ou ausentes; campos Internal vazam em respostas Public |
| Impacto se realizado | Inferência de estratégia de preço Internal; possível abuso de capacidade |
| Classificação | Inferred (exemplo) |

## Risco e mitigação

| Campo | Valor |
| --- | --- |
| Risco vinculado | RISK-001 |
| Requisitos vinculados | REQ-SEC-001 (escritas admin); política de taxa de leitura pública (exemplo) |
| Controles vinculados | CTRL-001; rate limiting na borda (nome: `EDGE_LOOKUP_RATE_LIMIT`) |
| Notas residuais | Browse público permanece aberto por desenho; risco residual de inferência Accepted Risk só para campos Public |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Asset | ../asset/ |
| Risk | ../risk/ |
| Control | ../control/ |
| Incident | ../incident/ |
