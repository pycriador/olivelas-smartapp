# Modelo de Confiabilidade

> Language: pt-BR | [English](../en/reliability-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar a postura de reliability de um sistema: do que depende, como falha, como degrada e como se recupera.

Fundamente afirmações em [arquitetura](architecture-model.md) e [failure domains](failure-domains.md). Não invente redundancy ou capacity que não exista.

## Escopo

Um modelo de reliability do projeto tipicamente cobre:

| Topic | Document here or link |
| --- | --- |
| Dependencies | Dependências críticas de runtime; veja também [dependency-reliability.md](dependency-reliability.md) |
| SPOFs | Single points of failure (Confirmed / Inferred / Unknown) |
| Failure modes | Catálogo ou resumo — [failure-modes.md](failure-modes.md) |
| Degradation | Graceful / hard / partial — [degradation.md](degradation.md) |
| Recovery | Caminhos de volta ao healthy — runbooks, failover, restore |
| Redundancy | O que de fato está replicado ou multi-homed |
| Limits | Limites rígidos, quotas, pontos de saturação |
| Capacity | Métricas relevantes apenas — [capacity.md](capacity.md) |

Marque seções como **Not Applicable** quando não se aplicam (ex.: sem redundancy por design em uma ferramenta batch).

## Dependências

Liste dependências materiais e se são necessárias para caminhos centrais. Prefira o dependency map de arquitetura mais uma visão operacional:

| Dependency | Type | Required for | Criticality | Notes |
| --- | --- | --- | --- | --- |
| | runtime / data / identity / … | | | |

Alinhe tipos com [operational-dependencies.md](operational-dependencies.md).

## Single Points of Failure (SPOF)

Um SPOF é um componente cuja falha torna uma capacidade material indisponível sem caminho alternativo efetivo.

| Candidate SPOF | Capability impacted | Mitigated? | How / why not | Classification |
| --- | --- | --- | --- | --- |
| | | yes / no / partial | | |

Não afirme “sem SPOFs” sem evidência. Prefira Unknown a falso conforto.

## Failure modes e propagação

Resuma os modes importantes; detalhe em [failure-modes.md](failure-modes.md) e [failure-propagation.md](failure-propagation.md). Vincule isolamento arquitetural a [failure-domains.md](failure-domains.md).

## Degradação e recovery

| Capability | On dependency failure | Degradation type | Recovery path | Runbook |
| --- | --- | --- | --- | --- |
| | | graceful / hard / partial / Unknown | | |

Veja [degradation.md](degradation.md).

## Redundancy

Documente redundancy **real**:

| Layer | Redundancy present? | What it protects | What it does not protect |
| --- | --- | --- | --- |
| Process / instance | | | |
| Data store | | | |
| Region / site | | | Not Applicable se single-site |

Múltiplas instâncias atrás de um datastore compartilhado ainda compartilham esse datastore como failure domain.

## Limits e capacity

Registre limites conhecidos (tamanho de payload, concurrency, profundidade de fila, rate limits) e aponte para [capacity.md](capacity.md) / [scaling.md](scaling.md). Limites no nível de contrato também podem aparecer em contratos — vincule em vez de duplicar.

## Integração com contratos

O comportamento de reliability nas fronteiras deve corresponder às semânticas de contrato documentadas:

- retries e timeouts — [retry-policy.md](retry-policy.md), [timing-contract.md](timing-contract.md)
- tratamento de duplicatas — [idempotency.md](idempotency.md)
- garantias de delivery — [delivery-semantics.md](delivery-semantics.md)

Se operações assumem que “clients vão fazer retry” mas o contrato diz o contrário, isso é drift — corrija um dos dois.

## Documentos relacionados

- [operations-model.md](operations-model.md)
- [failure-domains.md](failure-domains.md)
- [failure-modes.md](failure-modes.md)
- [dependency-reliability.md](dependency-reliability.md)
- [capacity.md](capacity.md)
- [architecture-model.md](architecture-model.md)
