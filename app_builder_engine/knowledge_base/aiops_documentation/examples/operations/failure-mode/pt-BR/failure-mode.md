---
title: "Modo de falha: timeout do inventory-store (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
failure_mode_id: "fm-inventory-store-timeout"
---

# Modo de falha: timeout do inventory-store

> Language: pt-BR | [English](../en/failure-mode.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Failure mode ID: fm-inventory-store-timeout
>
> **Exemplo ficcional — não é um projeto real.**

## Resumo

Lookups do catalog-service estouram timeout quando a latência do inventory-store excede o timeout configurado no cliente.

## Categoria

| Campo | Valor |
| --- | --- |
| Categoria | dependency |
| Componente(s) relacionado(s) | catalog-service, inventory-store |
| Domínio de falha relacionado | domínio de dependência runtime |
| Classificação | Confirmed (example) |

## Gatilho

| Campo | Valor |
| --- | --- |
| Como começa | Latência do inventory-store sobe acima do timeout, ou o timeout é configurado baixo demais |
| Pré-condições conhecidas | Carga sustentada ou mudança ruim de timeout |

## Propagação e impacto

| Campo | Valor |
| --- | --- |
| Como propaga | Timeouts aparecem como erros de lookup para consumidores da vitrine |
| Limites de isolamento | Serviços que não chamam inventory-store via catalog não são afetados |
| Impacto ao usuário / capacidade | Browse / add-to-cart degradam ou falham |
| Estado operacional quando ativo | Degraded (se cache serve) ou Unavailable |

## Detecção

| Sinal | Onde | Limiar / padrão |
| --- | --- | --- |
| Contagem de erros de timeout | Logs / metrics | Subida acima do baseline |
| Latência p99 do cliente | Metrics | Se aproxima ou excede o timeout |
| Probe de saúde da dependência | Health checks | Falhando ou lento |

## Mitigação e recuperação

| Campo | Valor |
| --- | --- |
| Mitigação imediata | Degrade com cache; pausar mudanças relacionadas |
| Caminho de recuperação | Restaurar saúde da dependência ou corrigir timeout; validar ratio de erro |
| Runbook | rb-catalog-high-error-rate |
| Rollback aplicável? | sim (para config ruim de timeout) |

## Prevenção

| Campo | Valor |
| --- | --- |
| Controles preventivos | Alinhar timeout ao p99 medido; check pré-mudança |
| Dívida de confiabilidade relacionada | Gate automatizado de latência de dependência ausente (exemplo) |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Modelo de confiabilidade | docs/pt-BR/reliability-model.md |
| Confiabilidade de dependências | docs/pt-BR/dependency-reliability.md |
| Contratos | catalog.lookup (fictício) |
| Alertas | alta taxa de erro / SLO burn |
| Runbook | ../runbook/ |
| Incidente | ../incident/ |
