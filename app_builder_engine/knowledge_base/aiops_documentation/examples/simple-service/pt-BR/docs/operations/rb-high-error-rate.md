# Runbook: Alta Taxa de Erro

> Language: pt-BR | [English](../../../en/docs/operations/rb-high-error-rate.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Runbook ID: rb-high-error-rate
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Restaurar taxas de erro aceitáveis para solicitações de aceitação do `notification-api`.

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Erros de aceitação da API | Falhas de entrega downstream |

## Pré-condições

| Pré-condição | Como verificar |
| --- | --- |
| Acesso a logs/métricas do serviço | Acesso de observabilidade concedido |
| Capacidade de checar saúde do store | Health check da dependência disponível |

## Sintomas

| Sintoma | Onde observado |
| --- | --- |
| 5xx elevados ou `store_unavailable` | Metrics / logs |
| Tempestades de retry do consumidor | Dashboards do consumidor |

## Diagnóstico

1. Verificar taxa de erro da API e principais códigos de erro.
2. Verificar saúde do acknowledgement-store.
3. Verificar deployments recentes.

| Verificação | Esperado | Se inesperado |
| --- | --- | --- |
| Saúde do store | healthy | Continuar para resolução de falha de dependência |
| Mix de códigos de erro | majoritariamente erros de cliente | Investigar mudanças de validação |

## Resolução

1. Se o store estiver unhealthy, seguir o procedimento de recuperação do store para o ambiente.
2. Se causado por um deployment ruim, fazer rollback do deployment da API.
3. Se falhas de auth dominarem, verificar a configuração da fonte do token **apenas nome/fonte** — não colar secrets.

## Validação

| Verificação | Resultado esperado |
| --- | --- |
| Taxa de erro | De volta à faixa normal |
| Solicitação sintética de aceitação | Retorna `accepted` |

## Rollback

1. Fazer rollback do deployment da API para a versão conhecida como boa anterior.
2. Rechecificar a taxa de erro.

| Condição que exige rollback | Ação |
| --- | --- |
| Taxa de erro permanece alta após recuperação da dependência | Fazer rollback da API |

## Escalação

| Condição | Escalar para | Informação a fornecer |
| --- | --- | --- |
| Outage do store > 15 minutos | platform on-call (ficcional) | timeline, amostras de erro sem secrets |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Architecture | [../architecture/overview.md](../architecture/overview.md) |
| Component | [../application/notification-api.md](../application/notification-api.md) |
| Contract | [../contracts/send-notification.md](../contracts/send-notification.md) |
