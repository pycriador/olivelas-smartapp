# RPO e RTO

> Language: pt-BR | [English](../en/rpo-rto.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar Recovery Point Objective (RPO) e Recovery Time Objective (RTO) com clareza — e quando dizer que não estão definidos.

## Definições

| Term | Meaning | Measures |
| --- | --- | --- |
| **RPO** (Recovery Point Objective) | Máxima **perda de dados** aceitável, medida para trás a partir do momento da falha | Tempo (ou gap de eventos) entre o último ponto recuperável bom e a falha |
| **RTO** (Recovery Time Objective) | Máximo **tempo aceitável para restaurar** um serviço utilizável após a falha ser declarada | Duração da falha (ou declaração) até a capacidade atender os critérios de recovery acordados |

```text
Timeline:  … last good point … [data loss window = RPO] … failure … [restore window = RTO] … usable again
```

Respostas a perguntas diferentes:

- RPO → *Quanto de dados podemos perder?*
- RTO → *Por quanto tempo podemos ficar down (ou degradados além do aceitável)?*

**Não** trate RPO e RTO como sinônimos. Não invente metas numéricas.

## Quando Unknown

Se o projeto não tem RPO ou RTO acordados, declare:

> **Not Defined**

Opcionalmente note se uma meta é Proposed (futura) vs Confirmed (política aceita). Nunca apresente uma meta Proposed como compromisso atual.

## O que documentar quando definidos

| Field | Content |
| --- | --- |
| Capability / data set | A que o objetivo se aplica |
| RPO | Valor + como é alcançado (ex.: intervalo de backup, bound de lag de replication) |
| RTO | Valor + caminho de recovery que o sustenta |
| Recovery criteria | O que significa “usable again” |
| Owner | Quem é owner de cumprir ou revisar o objetivo |
| Evidence | Cadência de backup, drill de DR, config de replication — conforme aplicável |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Relação com outros docs

| Concern | Document |
| --- | --- |
| Como backups sustentam o RPO | [backup-restore.md](backup-restore.md) |
| Recovery de catástrofe mais ampla | [disaster-recovery.md](disaster-recovery.md) |
| Restore de incidente de rotina | Runbooks / [incident-management.md](incident-management.md) |
| Timeouts de contrato | Timing contracts **não** são RTO — [timing-contract.md](timing-contract.md) |

## Anti-padrões

- Publicar RTO agressivo sem caminho de recovery praticado.
- Assumir que frequência de backup iguala RPO sem verificar usabilidade do restore.
- Copiar números de “tier” da indústria sem acordo do projeto.

## Documentos relacionados

- [disaster-recovery.md](disaster-recovery.md)
- [backup-restore.md](backup-restore.md)
- [reliability-model.md](reliability-model.md)
- [criticality.md](criticality.md)
- [operations-model.md](operations-model.md)
