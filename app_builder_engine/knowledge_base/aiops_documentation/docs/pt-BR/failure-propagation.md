# Propagação de Falhas

> Language: pt-BR | [English](../en/failure-propagation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como falhas começam, se espalham, são isoladas e geram impacto — e como documentar esse caminho.

Blast radius arquitetural pertence a [failure-domains.md](failure-domains.md). Este documento foca no **comportamento de propagação** para análise de operações e reliability.

## Modelo de propagação

```text
Start → Propagate → Isolate (or fail to) → Impact
```

| Stage | Question |
| --- | --- |
| **Start** | Onde a falha se origina? |
| **Propagate** | Por quais caminhos se espalha? |
| **Isolate** | O que limita o blast radius (se houver)? |
| **Impact** | O que é visível a usuários, integradores ou operadores? |

Se o isolamento for Unknown, diga isso. Não invente circuit breakers ou bulkheads que não estão implementados.

## Caminhos comuns de propagação (exemplos)

| Path | Example |
| --- | --- |
| Synchronous call chain | A → B → C; C falha → A erra |
| Shared datastore | Vizinho ruidoso trava ou satura storage |
| Shared thread / worker pool | Uma task travada bloqueia outras |
| Poison event / message | Payload ruim derruba consumers repetidamente |
| Retry amplification | Retries do client sobrecarregam dependência em dificuldade |
| Config / feature flag blast | Config global ruim atinge todas as instâncias |
| Identity / platform dependency | Outage do auth provider bloqueia muitos apps |

Relacione amplificação de retry a [retry-policy.md](retry-policy.md) e [idempotency.md](idempotency.md).

## Forma de documentação

| Origin | Propagation path | Isolation mechanism | Residual impact | Failure domain link | Classification |
| --- | --- | --- | --- | --- | --- |
| | | or None / Unknown | | [failure-domains.md](failure-domains.md) | |

## Condições de início

Documente starters típicos quando conhecidos:

- outage de dependência;
- deploy / mudança de config;
- pico de tráfego;
- data skew / poison input;
- exaustão de recurso;
- Unknown (incidentes só por sintoma).

## Isolamento vs impacto

| Situation | Document as |
| --- | --- |
| Falha contida a um domain | Isolamento efetivo; impacto limitado |
| Falha atravessa domains | Caminho de propagação + isolamento ausente |
| Capacidade continua degradada | Veja [degradation.md](degradation.md) |
| Parada total | Hard failure; caminho de recovery necessário |

## Link com arquitetura

| Arquitetura view | Use for |
| --- | --- |
| [failure-domains.md](failure-domains.md) | O que está dentro de um domain; isolamento pretendido |
| [component-relationships.md](component-relationships.md) | Arestas que podem carregar falha |
| [system-boundaries.md](system-boundaries.md) | Sistemas externos que você não controla |
| [trust-boundaries.md](trust-boundaries.md) | Fronteiras de segurança (podem ou não isolar falhas) |

## Documentos relacionados

- [failure-domains.md](failure-domains.md)
- [failure-modes.md](failure-modes.md)
- [reliability-model.md](reliability-model.md)
- [degradation.md](degradation.md)
- [dependency-reliability.md](dependency-reliability.md)
