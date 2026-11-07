# Métricas de Confiabilidade

> Language: pt-BR | [English](../en/reliability-metrics.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Definições para **métricas de processo de reliability** comuns. Esclareça ambiguidade — times frequentemente significam coisas diferentes pelo mesmo acrônimo.

Documente as definições que o projeto realmente usa. Marque **Not Defined** quando não usadas.

## Definições centrais

| Metric | Meaning (default in this standard) | Notes |
| --- | --- | --- |
| **MTTD** | Mean Time **To Detect** — tempo do início da falha (ou início do impacto no usuário) até o time tomar conhecimento | Exige eventos claros de “start” e “detected” |
| **MTTR** | Mean Time **To Restore** / **To Recover** — tempo da detection (ou do início da falha — **declare qual**) até o serviço atender os critérios de recovery | Ambíguo na indústria; **documente o clock do projeto** |
| **MTBF** | Mean Time **Between Failures** — intervalo médio entre eventos de falha em uma classe | Precisa de definição estável de falha; encaixa mal em streams contínuos de erro sem eventização |

```text
failure start ──► detected ──► mitigated / restored
     │               │                │
     └──── MTTD ─────┘                │
     └──────── MTTR (if from start) ──┘
                     └─ MTTR (if from detect) ─┘
```

## Esclareça ambiguidade explicitamente

Ao documentar MTTR (ou similar), sempre declare:

| Clarification | Example choices |
| --- | --- |
| Clock start | Início da falha vs detection vs abertura do incidente |
| Clock end | Mitigation vs restore completo vs fechamento do PIR |
| Population | Só SEV-1, todos os incidentes, por capability |
| Aggregation | Média, mediana, percentis |
| Exclusions | Mispages, falhas de provider externo — só se for verdade |

Se o esclarecimento estiver ausente, rotule a métrica como **Unknown** / poorly defined — não compare times com MTTR incomparável.

## Métricas relacionadas opcionais

| Metric | Meaning |
| --- | --- |
| **MTTM** | Mean Time To Mitigate (parar o sangramento) |
| **MTTF** | Mean Time To Failure (frequentemente intent similar a MTBF; defina localmente) |
| **Alert noise rate** | Fração de alerts que são non-actionable |
| **Recurrence rate** | Incidentes repetidos com a mesma classe de root cause |

## O que documentar

| Field | Content |
| --- | --- |
| Metric | Nome |
| Definition | Clock e population precisos |
| Purpose | Que decisão informa |
| Source | Sistema de incidentes, timeline, monitoring |
| Target | Só se real; senão Not Defined |
| Owner | |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Anti-padrões

- Otimizar MTTD pageando por ruído.
- Reivindicar MTTR melhorando enquanto se estreita silenciosamente a population de incidentes.
- Publicar MTBF sem definir o que conta como falha.

## Documentos relacionados

- [operational-metrics.md](operational-metrics.md)
- [incident-management.md](incident-management.md)
- [incident-timeline.md](incident-timeline.md)
- [post-incident-review.md](post-incident-review.md)
- [service-levels.md](service-levels.md)
