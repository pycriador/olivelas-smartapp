# Capacidade

> Language: pt-BR | [English](../en/capacity.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar capacity que importa para operação segura.

**Documente apenas métricas relevantes.** Não cole todo gauge de infraestrutura. Se capacity não é gerenciada no projeto, declare **Not Defined** ou **Not Applicable**.

## Propósito

Documentação de capacity responde:

> Quais limites de recurso ou throughput nos restringem, e como sabemos que estamos nos aproximando deles?

## O que “relevante” significa

Inclua uma métrica quando ela:

- limita performance ou availability visível ao usuário; ou
- aparece em failure modes de saturação; ou
- dirige decisões de scaling / throttling; ou
- é necessária para diagnóstico de incidente.

Exclua vanity metrics e dashboards não usados.

## Campos sugeridos

| Campo | Significado |
| --- | --- |
| Resource / dimension | ex.: request rate, queue depth, storage, workers, connections |
| Metric | Como é medida |
| Soft limit | Threshold de warning / scale, se houver |
| Hard limit | Ponto de falha / rejeição, se conhecido |
| Headroom practice | Quanto de capacity sobrando é intencional — ou Not Defined |
| Owner | Quem observa |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Forma da tabela

| Dimension | Metric | Soft limit | Hard limit | Signal / alert | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Relação com outros docs

| Topic | Link |
| --- | --- |
| Scaling actions | [scaling.md](scaling.md) |
| Saturation failure modes | [failure-modes.md](failure-modes.md) |
| SLIs sensíveis a capacity | [service-levels.md](service-levels.md) |
| Contract rate limits | Contrato relevante + [timing-contract.md](timing-contract.md) |

## Anti-padrões

- Documentar só “CPU” quando o limitador real é queue depth ou quota downstream.
- Hard limits marcados Confirmed sem evidência de medição.
- Docs de capacity que nunca dizem o que acontece no limite (reject, block, shed, crash).

## Documentos relacionados

- [scaling.md](scaling.md)
- [reliability-model.md](reliability-model.md)
- [monitoring.md](monitoring.md)
- [operations-model.md](operations-model.md)
