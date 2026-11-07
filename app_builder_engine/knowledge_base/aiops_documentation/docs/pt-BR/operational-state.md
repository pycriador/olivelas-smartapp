# Estado Operacional

> Language: pt-BR | [English](../en/operational-state.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como descrever o **estado operacional** de um serviço ou capacidade com vocabulário consistente.

Use estes estados (ou mapeie os sinônimos do projeto a eles uma vez e reutilize):

| State | Meaning |
| --- | --- |
| **Healthy** | Servindo dentro do comportamento esperado; sem incidente material ativo |
| **Degraded** | Servindo com qualidade, capacity ou conjunto de features reduzidos |
| **Unavailable** | Capacidade material não pode ser usada |
| **Recovering** | Restauração em andamento; ainda não Healthy |
| **Maintenance** | Intencionalmente limitado ou offline para trabalho planejado |
| **Unknown** | Estado não pode ser determinado a partir dos sinais disponíveis |

```text
Healthy ⇄ Degraded ⇄ Unavailable
    ↑         ↑           ↑
    └──── Recovering ─────┘
              ↑
         Maintenance (planned)
```

## Regras

- Prefira **Unknown** a adivinhar Healthy.
- **Degraded** deve nomear *o que* está degradado (latency, freshness, um caminho de feature).
- **Maintenance** é planejado; não relabel incidentes como maintenance depois do fato.
- **Recovering** termina só quando critérios de validation para Healthy (ou Degraded aceito) forem atendidos.

## O que documentar

| Topic | Question |
| --- | --- |
| How state is determined | Sinais, dashboards, health checks — [health-checks.md](health-checks.md), [monitoring.md](monitoring.md) |
| Who may declare state | Incident commander / on-call / automation — [operational-ownership.md](operational-ownership.md) |
| User-visible meaning | O que customers ou dependents experimentam em cada estado |
| Transitions | Transições notáveis automáticas ou manuais |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Bloco de status sugerido (para status pages ou runbooks)

| Field | Value |
| --- | --- |
| Capability | |
| State | Healthy / Degraded / Unavailable / Recovering / Maintenance / Unknown |
| Since | Timestamp ISO-8601 |
| Evidence | |
| Next update | |

## Documentos relacionados

- [degradation.md](degradation.md)
- [health-checks.md](health-checks.md)
- [incident-management.md](incident-management.md)
- [maintenance.md](maintenance.md)
- [operations-model.md](operations-model.md)
