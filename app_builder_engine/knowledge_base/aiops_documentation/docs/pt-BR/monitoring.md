# Monitoring

> Language: pt-BR | [English](../en/monitoring.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar o que é monitorado, por quê e quem age sobre isso.

Monitoring é a observação contínua de sinais ([observability-model.md](observability-model.md)). Alerting é quando essa observação notifica um humano ou automação ([alerting.md](alerting.md)).

## O que documentar por monitor

| Field | Question |
| --- | --- |
| **What** | Sinal ou check observado |
| **Why** | Risco ou decisão que sustenta |
| **Source** | De onde vêm os dados |
| **Frequency** | Com que frequência é avaliado / scraped / amostrado |
| **Threshold** | Condição que significa “notável” (ou regra qualitativa) |
| **Owner** | Quem mantém o monitor |
| **Action** | O que acontece quando o threshold é cruzado (ticket, alert, auto-scale, só log) |

Se um campo for desconhecido, escreva **Not Defined**. Se monitoring estiver intencionalmente ausente para uma tool não crítica, **Not Applicable**.

## Inventário sugerido

| What | Why | Source | Frequency | Threshold | Owner | Action |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Bom monitoring

- Ligado a impacto no usuário, risco de capacity ou falha de dependência — não a toda métrica.
- Thresholds revisados após falsos positivos/negativos.
- Coluna Action não vazia (mesmo que “só log / review semanal”).

## Mau monitoring

- Monitores sem owner.
- Thresholds copiados de outro sistema sem significado.
- “Observar tudo” sem caminho de ação.
- Falha silenciosa do próprio sistema de monitoring não documentada ([operational-dependencies.md](operational-dependencies.md)).

## Encadeamento

| If action is… | Also document… |
| --- | --- |
| Page / notify | [alerting.md](alerting.md) |
| Executar um procedimento | [runbooks/README.md](runbooks/README.md) |
| Scale | [scaling.md](scaling.md) |
| Abrir um incidente | [incident-management.md](incident-management.md) |

## Documentos relacionados

- [observability-model.md](observability-model.md)
- [alerting.md](alerting.md)
- [health-checks.md](health-checks.md)
- [service-levels.md](service-levels.md)
- [capacity.md](capacity.md)
