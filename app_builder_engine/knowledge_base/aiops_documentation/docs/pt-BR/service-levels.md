# Níveis de Serviço

> Language: pt-BR | [English](../en/service-levels.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar service level indicators, objectives e agreements — quando o projeto os usa.

**Nem todo projeto precisa de um SLA.** Muitos precisam de SLIs; alguns de SLOs; SLAs formais são opcionais e frequentemente contratuais.

## SLI → SLO → SLA

| Term | Meaning | Required? |
| --- | --- | --- |
| **SLI** (Service Level Indicator) | Sinal mensurável de qualidade visível ao usuário ou da capacidade (ex.: taxa de sucesso, percentil de latência, freshness) | Recomendado quando reliability importa |
| **SLO** (Service Level Objective) | Meta para um SLI em uma janela (ex.: 99,9% de sucesso em 30 dias) | Opcional; use quando o time se compromete com uma meta |
| **SLA** (Service Level Agreement) | Compromisso com outra parte (frequentemente com consequências) | Opcional; **Not Applicable** para muitos sistemas internos |

```text
SLI (measure) → SLO (target) → SLA (external commitment, if any)
```

Não invente SLOs para preencher um template. Prefira **Not Defined** / **Not Applicable** a percentuais fictícios.

## O que documentar para um SLI

| Field | Question |
| --- | --- |
| Name | O que é medido? |
| Definition | Fórmula / conjunto de eventos exato (incluir e excluir) |
| Source | De onde vem a medição |
| Window | Período rolling, mês calendário, etc. |
| Good event / bad event | O que conta como sucesso vs falha |
| Scope | Quais usuários, regiões, endpoints ou fluxos |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## O que documentar para um SLO

| Field | Question |
| --- | --- |
| SLI | Qual indicador |
| Target | Objetivo numérico |
| Window | Janela de tempo |
| Owner | Quem observa burn e prioriza trabalho — [operational-ownership.md](operational-ownership.md) |
| Error budget policy | Link para [error-budget.md](error-budget.md) se usado |
| Not Applicable | Motivo se o projeto não define SLOs |

## Orientação de SLA

Documente um SLA somente quando um acordo real existir. Capture:

- parties;
- SLIs/SLOs cobertos;
- exclusions (maintenance, force majeure — como realmente escritos);
- consequences / credits, se houver;
- como disputas ou medições são resolvidas.

Se não houver SLA: declare **Not Applicable — no formal SLA**.

## Relação com contratos e arquitetura

| Concern | Where it lives |
| --- | --- |
| Expectativas de latency / timeout entre parties | Frequentemente [timing-contract.md](timing-contract.md) |
| Retry e delivery sob falha | [retry-policy.md](retry-policy.md), [delivery-semantics.md](delivery-semantics.md) |
| Meta de reliability voltada ao usuário | Este documento / tabela de SLO do projeto |
| Limites estruturais de capacity | [capacity.md](capacity.md), constraints de arquitetura |

Timing de contrato não é automaticamente um SLO. Vincule-os quando se alinharem intencionalmente.

## Tabela sugerida

| SLI | Definition | SLO | Window | SLA? | Owner | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| | | or N/A | | yes / no / N/A | | |

## Documentos relacionados

- [error-budget.md](error-budget.md)
- [observability-model.md](observability-model.md)
- [criticality.md](criticality.md)
- [operations-model.md](operations-model.md)
- [templates/observability.md](templates/observability.md)
