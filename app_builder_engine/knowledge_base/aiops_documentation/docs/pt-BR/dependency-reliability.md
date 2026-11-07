# Confiabilidade de Dependências

> Language: pt-BR | [English](../en/dependency-reliability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar expectativas de reliability e tratamento de falha para dependências das quais o sistema depende.

Use como companheiro operacional dos dependency maps de arquitetura e de [operational-dependencies.md](operational-dependencies.md) (*kinds* de dependência).

## Forma obrigatória da tabela

Documente dependências materiais com pelo menos:

| Dependency | Criticality | Failure Impact | Detection | Mitigation | Recovery |
| --- | --- | --- | --- | --- | --- |
| | Veja [criticality.md](criticality.md) | O que quebra para usuários/nós | Como notamos | Soften automático ou manual | Como restauramos ou esperamos |

Estilo de linha de exemplo (ilustrativo):

| Dependency | Criticality | Failure Impact | Detection | Mitigation | Recovery |
| --- | --- | --- | --- | --- | --- |
| Identity provider | Critical | Login e APIs autenticadas falham | Auth error rate / health | Cache de tokens se aplicável; senão hard fail | Esperar provider; status page; escalate |
| Analytics sink | Low | Perda de métricas secundárias | Alert de lag de export | Drop ou buffer de events | Replay / backfill se suportado |

Substitua por fatos do projeto. Marque campos Unknown explicitamente.

## Orientação dos campos

| Column | Guidance |
| --- | --- |
| Dependency | Nome estável; link para arquitetura / contrato |
| Criticality | Escala do projeto; sem auto-classificação |
| Failure Impact | Jornadas de usuário, dados, SLOs afetados |
| Detection | Metric, log, probe, synthetic, customer report |
| Mitigation | Timeout, circuit break, degrade, queue, fail fast — conforme implementado |
| Recovery | Failover, retry budget, runbook manual, restore |

## Links de owner e contrato

| Also record when useful | Where |
| --- | --- |
| Dependency owner | [operational-ownership.md](operational-ownership.md) |
| Interaction rules | Docs de contrato ([contract-model.md](contract-model.md)) |
| Retry / timeout | [retry-policy.md](retry-policy.md), [timing-contract.md](timing-contract.md) |
| Failure domain | [failure-domains.md](failure-domains.md) |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Tabela só para dependências críticas de runtime |
| Medium | Todas as deps de runtime que podem pagear alguém |
| Large | Runtime + deps operacionais-chave; revisar em mudança de arquitetura |

## Anti-padrões

- Listar toda biblioteca como linha de dependência.
- Coluna Mitigation preenchida com buzzwords da indústria que não existem no sistema.
- Dependência Critical com Detection vazia e sem owner.

## Documentos relacionados

- [operational-dependencies.md](operational-dependencies.md)
- [reliability-model.md](reliability-model.md)
- [failure-propagation.md](failure-propagation.md)
- [criticality.md](criticality.md)
- [component-relationships.md](component-relationships.md)
