---
title: "Security Risk: RISK-001 pricing-tier exposure (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
risk_id: "RISK-001"
---

# Security Risk: RISK-001 pricing-tier exposure

> Language: pt-BR | [English](../en/risk.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Risk ID: RISK-001
>
> **Exemplo ficcional — não é um projeto real.**

## Resumo

THR-001 atuando sobre AST-001 pode expor ranks de faixas de preço Internal por vazamento de resposta ou bypass do caminho admin.

## Identidade

| Campo | Valor |
| --- | --- |
| Risk ID | RISK-001 |
| Nome | Exposure of Internal catalog pricing tiers |
| Status | Mitigating |
| Owner | example-team |

## Fatores

| Campo | Valor |
| --- | --- |
| Ativo(s) vinculado(s) | AST-001 |
| Ameaça(s) vinculada(s) | THR-001 |
| Vulnerabilidade vinculada | VULN-001 |
| Probabilidade | Medium (escala do projeto, exemplo) |
| Impacto | Medium — confidencialidade comercial, não PII de cliente |
| Severidade | Medium |
| Confiança | Medium |
| Risco residual | Low após CTRL-001 e filtragem de campos; inferência em leitura pública Accepted Risk |

## Tratamento

| Campo | Valor |
| --- | --- |
| Tratamento | Mitigate |
| Controles vinculados | CTRL-001 |
| Exceções vinculadas | EXC-001 |
| Dívida vinculada | Nenhuma documentada (exemplo) |
| Classificação | Confirmed (exemplo) |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Asset | ../asset/ |
| Threat | ../threat/ |
| Control | ../control/ |
| Exception | ../exception/ |
