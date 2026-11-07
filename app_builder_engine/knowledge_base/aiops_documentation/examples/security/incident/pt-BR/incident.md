---
title: "Security Incident: INC-20260805-01 lookup abuse (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
incident_id: "INC-20260805-01"
severity: "SEV-3"
incident_type: "Security"
---

# Security Incident: INC-20260805-01 lookup abuse

> Language: pt-BR | [English](../en/incident.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Incident ID: INC-20260805-01
>
> **Exemplo ficcional — não é um projeto real. Sem dados pessoais.**

## Resumo

Volume elevado de lookup público de catálogo a partir de um conjunto pequeno de fingerprints de cliente, consistente com enumeração no estilo THR-001. Sem vazamento confirmado de campos Internal.

## Status

| Campo | Valor |
| --- | --- |
| Status do incidente | Resolved |
| Tipo do incidente | Security |
| Estado operacional | Healthy |
| Severidade | SEV-3 |
| Owner / commander de segurança | example-oncall |
| Início | 2026-08-05T09:20:00Z |
| Detecção | 2026-08-05T09:35:00Z |
| Contenção | 2026-08-05T10:05:00Z |
| Resolução | 2026-08-05T10:40:00Z |

## Impacto

| Campo | Valor |
| --- | --- |
| Ativos afetados | AST-001 (tentativa de inferência; só campos Public observados) |
| Impacto de confidencialidade | none (campos Internal não retornados — Confirmed exemplo) |
| Impacto de integridade | none |
| Impacto de disponibilidade | possible — carga elevada na borda pública |
| Escopo de usuário / tenant | usuários fictícios da vitrine na região de exemplo (latência de browse degradada) |

## Linha do tempo

| Hora (UTC) | Tipo | Entrada |
| --- | --- | --- |
| 09:20 | FACT | Taxa de lookup público começou a subir |
| 09:35 | FACT | Alerta `catalog-public-lookup-spike` disparou |
| 09:50 | HYPOTHESIS | Enumeração automatizada contra a borda pública |
| 10:05 | CONFIRMED | Rate limit reforçado; fingerprints abusivos bloqueados na borda |
| 10:40 | FACT | Volume normal; incidente fechado |

## Contenção e resposta

| Ação | Owner | Resultado |
| --- | --- | --- |
| Redução temporária de `EDGE_LOOKUP_RATE_LIMIT` | example-oncall | Volume caiu |
| Bloqueio de fingerprints abusivos na borda | example-oncall | Pico cessou |
| Verificação da allowlist de campos Public | example-oncall | Sem vazamento Internal |

## Evidência

| ID / localização da evidência | Sustenta | Notas de integridade |
| --- | --- | --- |
| Histórico do alerta: `catalog-public-lookup-spike` | Horário de detecção | Somente métricas agregadas |
| Contadores de deny na borda (nome de config) | Eficácia da contenção | Nenhum body de request neste registro |

## Causa raiz

| Campo | Valor |
| --- | --- |
| Causa raiz | Caminho de leitura pública sob EXC-001 atraiu scraping automatizado |
| Fatores contribuintes | Rate limit dimensionado para pico de marketing, não scrape sustentado |
| Gap de detecção | ~15 minutos |
| Gap de controle | Limiar de rate limit alto demais para a janela da campanha |
| Classificação | Confirmed (exemplo) |

## Follow-ups

| Ação | Tipo | Owner | Status |
| --- | --- | --- | --- |
| Retunar `EDGE_LOOKUP_RATE_LIMIT` para a janela EXC-001 | Control | example-team | done (exemplo) |
| Revisar se expiração de EXC-001 ainda é válida | Exception | example-team | open |
| Documentar residual de THR-001 sob campanha | Documentation | example-team | done (exemplo) |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Threat | ../threat/ |
| Exception | ../exception/ |
| Asset | ../asset/ |
| Control | ../control/ |
