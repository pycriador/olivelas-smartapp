---
title: "Service Profile: catalog-service (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
service_id: "catalog-service"
criticality: "High"
---

# Service Profile: catalog-service

> Language: pt-BR | [English](../en/service-profile.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Service ID: catalog-service
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Servir consultas de catálogo de produtos para vitrine e fluxos de pedido. Ilustra um cartão de identidade operacional sem prescrever infraestrutura ou vendors.

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Disponibilidade de consulta, ownership, deps, service levels, postura de recuperação | Autoria de conteúdo do catálogo, regras de preço |

## Ownership

| Papel | Owner | Notas |
| --- | --- | --- |
| Serviço / produto | example-product | Ficcional |
| Técnico | example-team | Ficcional |
| Operacional / on-call | example-team | Mesmo time |
| Escalonamento | example-platform | Contato de platform fictício |

## Criticidade

| Campo | Valor |
| --- | --- |
| Nível | High |
| Justificativa | Navegação da vitrine depende das consultas de catálogo |
| Impacto se indisponível | Browse e add-to-cart degradam; checkout pode completar para SKUs conhecidos |

## Links de arquitetura

| Concern | Link |
| --- | --- |
| Overview / componente | `docs/architecture/overview.md` fictício (fora desta árvore) |
| Domínios de falha | domínio de dependência: inventory-store |
| Mapa de dependências | ver Dependências abaixo |

## Dependências

| Dependência | Tipo | Criticidade | Impacto da falha | Detecção | Mitigação / recuperação |
| --- | --- | --- | --- | --- | --- |
| inventory-store | runtime | High | Latência / erros elevados na consulta | Sinais de erro + latência | Timeout, degradar para snapshot em cache, runbook |
| catalog-cache | runtime | Medium | Resultados stale ou vazios | Hit/miss + freshness | Procedimento de restore de backup |

## Contratos (relevantes para confiabilidade)

| Contrato | Timeout | Retry | Idempotência | Notas |
| --- | --- | --- | --- | --- |
| catalog.lookup (API, fictício) | 500 ms | 2 retries, backoff | sim (leitura) | Apenas link; schema não duplicado |

## Service Levels

| SLI | SLO | Janela | Error budget | Classificação |
| --- | --- | --- | --- | --- |
| catalog-lookup-availability | 99,5% de lookups bem-sucedidos | 30 dias | 0,5% | Confirmed (example) |

## Modos de falha (resumo)

| Modo de falha | Impacto | Detecção | Runbook / recuperação |
| --- | --- | --- | --- |
| timeout do inventory-store | Lookups degradados | Latência + erros de timeout | rb-catalog-high-error-rate; FM timeout |

## Observabilidade

| Tipo de sinal | Status | Notas / link |
| --- | --- | --- |
| Metrics | Implemented | contagem, ratio de erro, latência |
| Logs | Implemented | request id, outcome |
| Traces | Partial | apenas span de entrada |
| Health checks | Implemented | liveness + probe de dependência |
| Alerts | Implemented | alta taxa de erro, SLO burn |

## Estado operacional

| Como o estado é determinado | Sinais Healthy / Degraded / Unavailable |
| --- | --- |
| Ratio de erro + saúde da dependência + freshness do cache | Healthy: ratio abaixo do limiar; Degraded: timeouts com cache servindo; Unavailable: lookups falhando e cache vazio |

## Deploy e mudança

| Tópico | Link / notas |
| --- | --- |
| Deploy / validate | Deploy → smoke lookup → observar ratio de erro |
| Postura de rollback | Seguro para versão da app; restore de cache é separado |
| Manutenção | Janela planejada documentada |

## Recuperação

| Tópico | Status | Link |
| --- | --- | --- |
| Backup / restore | Defined | exemplo de recovery-procedure |
| RPO / RTO | Defined | RPO 1 h / RTO 30 min (valores de exemplo) |
| Disaster recovery | Formal Disaster Recovery not defined. | — |

## Runbooks e incidentes relacionados

| Artefato | ID / path |
| --- | --- |
| Runbooks | rb-catalog-high-error-rate |
| Troubleshooting | — |
| Incidentes materiais recentes | INC-20260801-01 |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Arquitetura | (projeto adotante) |
| Contratos | catalog.lookup (fictício) |
| Observabilidade | inventário do projeto |
| Modelo de confiabilidade | docs/pt-BR/reliability-model.md |
