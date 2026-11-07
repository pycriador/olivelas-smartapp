# Game Days

> Language: pt-BR | [English](../en/game-days.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar **game days** (exercícios agendados de reliability) quando o projeto os usa.

## Opcional para projetos pequenos

Game days são **opcionais**. Projetos pequenos ou de baixa criticality podem declarar:

> Game days not practiced — **Not Applicable**.

Não invente um programa de game day para satisfazer um template.

## O que é um game day

Um exercício planejado que ensaiar falha, detection, diagnosis e recovery sob condições controladas — frequentemente com hipóteses explícitas (“se X falhar, degradamos para Y em até Z”).

Relacionado: [reliability-testing.md](reliability-testing.md), [incident-management.md](incident-management.md).

## O que documentar quando praticado

| Topic | Question |
| --- | --- |
| Objective | Qual hipótese ou skill está sendo ensaiada |
| Scope | Sistemas, ambientes, limites de blast-radius |
| Scenario | Falha injetada ou simulada (alto nível — sem payloads de ataque inventados) |
| Participants | Roles (facilitator, on-call, observers) |
| Safety limits | Condições de parada, salvaguardas de produção |
| Signals watched | Metrics, logs, alerts esperados |
| Outcome | O que foi aprendido; gaps encontrados |
| Follow-ups | Corrective actions / dívida de reliability |
| Date | Quando realizado |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Orientação de cadência

| Criticality (example) | Typical stance |
| --- | --- |
| Critical / High | Exercícios periódicos para top failure modes quando viável |
| Medium | Ocasional ou após mudança major de arquitetura |
| Low / small project | Frequentemente N/A |

Substitua pela prática real do projeto.

## Anti-padrões

- Chamar um outage sem review de “game day”.
- Rodar exercícios destrutivos sem condições de parada ou ownership.
- Documentar game days passados fictícios.

## Documentos relacionados

- [reliability-testing.md](reliability-testing.md)
- [failure-modes.md](failure-modes.md)
- [post-incident-review.md](post-incident-review.md)
- [corrective-actions.md](corrective-actions.md)
- [reliability-debt.md](reliability-debt.md)
- [criticality.md](criticality.md)
