# Troubleshooting: Inventory Projector

> Language: pt-BR | [English](../../../en/docs/operations/troubleshooting.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Diagnosticar lag de projeção, retries e comportamento de eventos poison para `inventory-projector`.

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Lag do consumer e falhas de apply | Bugs de regra de negócio do write model |

## Como usar

1. Corresponder os sintomas.
2. Executar as verificações de diagnóstico em ordem.
3. Aplicar a resolução.
4. Escalar se a validação falhar.

## Índice de sintomas

| Sintoma | Área provável | Ir para |
| --- | --- | --- |
| Lag crescente do consumer | capacidade do bus ou do consumer | Issue: Lag de projeção |
| Falhas repetidas em um evento | payload poison | Issue: Evento poison |
| Alta taxa de retry | instabilidade do store | Issue: Falhas de apply no store |

## Problemas comuns

### Issue: Lag de projeção

| Campo | Valor |
| --- | --- |
| Symptoms | Métrica de lag subindo; projeção parece desatualizada |
| Likely causes | consumers subdimensionados; backpressure do bus; store lento |
| Diagnosis | Verificar lag, contagem de consumers, latência do store |
| Resolution | Escalar consumers ou restaurar desempenho do store |
| Validation | Tendência de lag diminui |
| Related runbook | este documento |
| Classification | Confirmed (example) |

### Issue: Evento poison

| Campo | Valor |
| --- | --- |
| Symptoms | Um evento falha repetidamente; progresso da partição estagna |
| Likely causes | schema_invalid; nulls inesperados |
| Diagnosis | Inspecionar campos do payload no dead-letter (sem secrets) |
| Resolution | Encaminhar para dead-letter; corrigir producer; replay se necessário |
| Validation | Consumer retoma; alerta de dead-letter reconhecido |
| Related runbook | este documento |
| Classification | Confirmed (example) |

### Issue: Falhas de apply no store

| Campo | Valor |
| --- | --- |
| Symptoms | Métricas de retry elevadas; erros transitórios nos logs |
| Likely causes | projection-store indisponível ou lento |
| Diagnosis | Verificar saúde do store e assinaturas de erro |
| Resolution | Restaurar store; manter backoff habilitado |
| Validation | Taxa de sucesso se recupera; retries normalizam |
| Related runbook | este documento |
| Classification | Confirmed (example) |

## Sinais diagnósticos

| Sinal | Onde encontrar | Como é “saudável” |
| --- | --- | --- |
| consumer lag | metrics | estável / próximo de zero |
| dead-letter count | metrics | zero ou raro |
| apply error rate | metrics | dentro da faixa normal |

## Escalação

| Condição | Escalar para | Fornecer |
| --- | --- | --- |
| Lag cresce por > 30 minutos após mitigação | platform on-call (ficcional) | timelines, métricas, event_ids |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| Contract | [../contracts/inventory-adjusted.md](../contracts/inventory-adjusted.md) |
| Component | [../application/inventory-projector.md](../application/inventory-projector.md) |
| Integration | [../application/integration-inventory-adjusted.md](../application/integration-inventory-adjusted.md) |
