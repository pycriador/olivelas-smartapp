# Degradação

> Language: pt-BR | [English](../en/degradation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar comportamento degradado quando o sistema não consegue oferecer capacidade plena.

Degradação é preocupação de reliability e resilience: permanecer parcialmente útil pode ser melhor do que falhar fechado — ou pior, se o modo parcial corromper dados. Documente o que o sistema **de fato** faz.

## Tipos

| Type | Meaning |
| --- | --- |
| **Graceful degradation** | Features não críticas são cortadas; o caminho central continua com qualidade ou opções reduzidas |
| **Hard failure** | A capacidade para; callers recebem erros ou não progridem |
| **Partial degradation** | Alguns tenants, regiões, endpoints ou features falham enquanto outros funcionam |

Estas são categorias de documentação, não requisitos de produto. Um projeto pode ter só hard failure para um caminho — marque graceful degradation como **Not Applicable** para esse caminho.

## O que documentar

| Field | Question |
| --- | --- |
| Trigger | O que causa a degradação? |
| User-visible behavior | O que ainda funciona / o que não? |
| Operator signals | Como sabemos que estamos degradados? |
| Data safety | O modo degradado é seguro (sem corrupção silenciosa)? |
| Exit criteria | O que restaura o serviço pleno? |
| Duration expectations | Unknown / Not Defined se não houver meta |
| Runbook | Link se operadores precisam agir |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Tabela sugerida

| Capability | Trigger | Mode | Still works | Stops / worsens | Detection | Recovery |
| --- | --- | --- | --- | --- | --- | --- |
| | | graceful / hard / partial | | | | |

## Honestidade de design

- Não documente “graceful degradation” como Confirmed para designs Proposed.
- Se o único comportamento é crash-and-retry, diga **hard failure** e aponte para [retry-policy.md](retry-policy.md).
- Outages parciais que parecem “healthy” globalmente precisam de detecção explícita ([health-checks.md](health-checks.md), [monitoring.md](monitoring.md)).

## Relação com operational state

O estado runtime degradado deve alinhar-se a [operations-model.md](operations-model.md) e a qualquer vocabulário de operational-state que o projeto adote (ex.: Healthy / Degraded / Unavailable). Vincule em vez de redefinir.

## Documentos relacionados

- [reliability-model.md](reliability-model.md)
- [failure-modes.md](failure-modes.md)
- [failure-propagation.md](failure-propagation.md)
- [health-checks.md](health-checks.md)
- [incident-management.md](incident-management.md)
