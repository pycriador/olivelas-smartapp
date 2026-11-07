---
title: "Security Asset: AST-001 catalog pricing tiers (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
asset_id: "AST-001"
---

# Security Asset: AST-001 catalog pricing tiers

> Language: pt-BR | [English](../en/asset.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Asset ID: AST-001
>
> **Exemplo ficcional — não é um projeto real.**

## Resumo

Rótulos e ranks relativos de faixas de preço internas usados pelo catalog-service para browse e preview admin. Não é copy de marketing pública.

## Identidade

| Campo | Valor |
| --- | --- |
| Asset ID | AST-001 |
| Nome | Catalog pricing tiers |
| Tipo | data |
| Owner | example-team |
| Classificação | Internal |

## Descrição

| Campo | Valor |
| --- | --- |
| Por que importa | Expor ranks de faixa pode revelar estratégia comercial antes do lançamento público |
| Onde vive | Datastore do catalog-service (nome lógico: catalog-store); cache de preview admin |
| Componentes relacionados | catalog-api, catalog-admin-api, edge-gateway |
| Fluxos de dados relacionados | Escrita admin → catalog-store; Leitura pública retorna apenas campos Public |

## Ameaças e controles

| Ameaça vinculada | Risco vinculado | Controles vinculados |
| --- | --- | --- |
| THR-001 | RISK-001 | CTRL-001 |

## Evidência e monitoramento

| Campo | Valor |
| --- | --- |
| Detecção / monitoramento | Negativas de acesso em rotas admin; volume anômalo de leitura em massa na borda pública |
| Refs de evidência | Nome de config: `CATALOG_ADMIN_AUTH_MODE` (fonte: secret store — valor não documentado) |
| Classificação das afirmações | Confirmed (exemplo) |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Threat | ../threat/ |
| Risk | ../risk/ |
| Control | ../control/ |
