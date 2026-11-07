# Revisão Pós-Incidente

> Language: pt-BR | [English](../en/post-incident-review.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como conduzir e documentar uma post-incident review **blameless** (PIR / postmortem).

O objetivo é aprendizado e sistemas mais seguros — não encontrar uma pessoa para culpar.

## Princípio blameless

- Assuma que as pessoas agiram razoavelmente com a informação, ferramentas e incentivos que tinham.
- Foque em sistemas, processos, sinais e design.
- Nomeie roles e decisões; não humilhe indivíduos.
- Segurança psicológica é necessária para timelines e hipóteses honestas.

Se uma review não for blameless, otimizará pelo silêncio, não pela reliability.

## Quando realizar uma

| Guidance | |
| --- | --- |
| SEV-1 / SEV-2 (ou equivalente do projeto) | Geralmente sim |
| Falha nova ou near miss | Frequentemente sim |
| SEV-3 repetido com tendência de alta | Considere |
| SEV-4 trivial | Opcional / leve |

Se o projeto não tem prática de PIR: **Not Defined** — não finja preencher um template.

## Inputs

- [incident-timeline.md](incident-timeline.md) com FACT / HYPOTHESIS / CONFIRMED / UNKNOWN
- Resumo de impacto (usuários, duração, burn de SLO/error budget se usado)
- Distinções de [root-cause-analysis.md](root-cause-analysis.md)
- Arquitetura, contratos e runbooks relacionados como estavam *durante* o incidente

## Agenda sugerida

1. Impacto e severity (concordar nos fatos)
2. Walkthrough da timeline
3. O que correu bem
4. O que correu mal (sistemas, não pessoas)
5. Root causes, contributing factors, gaps de detection/recovery
6. Corrective actions com owners e datas
7. Atualizações de documentação necessárias (ops, arquitetura, contratos)

## Outputs

| Output | Required? |
| --- | --- |
| Resumo curto do incidente | Recomendado |
| Timeline | Recomendada para incidentes materiais |
| Análise de causa | Recomendada |
| Corrective actions | Recomendadas — [corrective-actions.md](corrective-actions.md) |
| Data de follow-up review | Opcional |

## Anti-padrões

- Reescrever a timeline para remover UNKNOWNs desconfortáveis.
- Action items sem owners ou com “investigate” eterno.
- Pular atualizações de arquitetura/contrato quando a falha cruzou uma fronteira.

## Documentos relacionados

- [incident-management.md](incident-management.md)
- [incident-timeline.md](incident-timeline.md)
- [root-cause-analysis.md](root-cause-analysis.md)
- [corrective-actions.md](corrective-actions.md)
- [error-budget.md](error-budget.md)
