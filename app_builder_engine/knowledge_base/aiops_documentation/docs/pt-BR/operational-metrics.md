# Métricas Operacionais

> Language: pt-BR | [English](../en/operational-metrics.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Propósito das **métricas operacionais** comuns. Nem todo projeto precisa de toda métrica — documente as que dirigem decisões.

Para seleção de SLI/SLO veja [service-levels.md](service-levels.md). Para MTTD/MTTR/MTBF veja [reliability-metrics.md](reliability-metrics.md).

## Propósitos das métricas

| Metric family | Purpose | Typical questions answered |
| --- | --- | --- |
| **Availability / uptime** | Se a capacidade estava alcançável/usável | Estávamos up para usuários que precisavam? |
| **Error rate / success rate** | Correção dos resultados | Requests/jobs estão tendo sucesso? |
| **Latency** | Quanto tempo o trabalho leva | Estamos lentos para usuários ou dependents? |
| **Saturation** | Quão cheios estão recursos ou filas | Estamos nos aproximando de um cliff? |
| **Throughput** | Trabalho concluído por tempo | Estamos acompanhando a demanda? |
| **Frescor / lag** | Quão stale estão dados ou projections | O estado async está aceitavelmente atual? |
| **Queue depth / backlog** | Trabalho pendente | O trabalho está se acumulando? |
| **Utilization** | Uso de recurso vs capacity | Precisamos de ação de capacity? |
| **Traffic / demand** | Forma da carga de entrada | A carga é anômala? |
| **Dependency health** | Status downstream/upstream | A falha está dentro ou fora? |
| **Deploy / change markers** | Correlacionar mudanças com sintomas | Um release coincidiu com a dor? |

Projetos podem usar nomes diferentes. Mapeie termos locais uma vez.

## O que documentar por métrica usada

| Field | Content |
| --- | --- |
| Name | Nome estável da métrica |
| Purpose | Decisão que sustenta |
| Definition | Fórmula / conjunto de eventos |
| Source | De onde vem |
| Owner | Quem mantém significado e qualidade |
| Related alerts / SLIs | Links |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Regras

- **Nem todas obrigatórias.** Prefira poucas métricas que dirigem decisão a um catálogo de vaidade.
- Não invente métricas ou dashboards.
- Evite labels de alta cardinalidade ou com PII em exemplos documentados.
- Alinhe definições de métrica à linguagem de contrato e arquitetura quando medirem a mesma fronteira.

## Documentos relacionados

- [reliability-metrics.md](reliability-metrics.md)
- [monitoring.md](monitoring.md)
- [observability-model.md](observability-model.md)
- [service-levels.md](service-levels.md)
- [capacity.md](capacity.md)
- [standards.md](standards.md)
