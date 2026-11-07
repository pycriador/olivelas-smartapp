# Error Budget

> Language: pt-BR | [English](../en/error-budget.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar error budgets quando um projeto usa gestão de reliability baseada em SLO.

Se o projeto não tem SLOs ou prática de error budget, declare **Not Applicable** ou **Not Defined**. Não invente uma política de budget.

## Conceito

Um **error budget** é a quantidade permitida de unreliability em um período, derivada de um SLO.

Exemplo (apenas ilustrativo):

- SLO: 99,9% de requests bem-sucedidas em 30 dias
- Fração de falha permitida: 0,1%
- Error budget: 0,1% dos eventos elegíveis (ou downtime equivalente para SLIs de availability)

Fórmulas exatas dependem da definição do SLI ([service-levels.md](service-levels.md)).

## Cálculo (documente a fórmula do projeto)

Registre:

| Field | Content |
| --- | --- |
| SLI / SLO | Referência |
| Window | ex.: rolling de 28 dias |
| Budget definition | Como o budget restante é calculado |
| Measurement source | Mesma fonte do SLI, ou documente diferenças |
| Classification | Confirmed / Inferred / Unknown / Proposed |

Se o cálculo for Unknown, diga isso — não copie um default de vendor como Confirmed.

## Consumo

Documente como o budget é consumido e reportado:

| Topic | Question |
| --- | --- |
| What burns budget | Eventos falhos, downtime, misses de SLO — conforme definido |
| What does not | Exclusions realmente aplicadas (input ruim do client, planned maintenance — só se for verdade) |
| Visibility | Quem vê burn rate / budget restante |
| Thresholds | Quando burn dispara review, freeze ou incidente |

## Impactoo em mudanças

Error budget existe para tornar explícitos os trade-offs **reliability vs change**. Documente a política do projeto, por exemplo:

| Remaining budget (example policy) | Typical stance (example) |
| --- | --- |
| Healthy | Velocidade normal de mudanças |
| Fast burn | Desacelerar mudanças arriscadas; priorizar trabalho de reliability |
| Exhausted | Congelar mudanças não essenciais que afetam o SLI; focar em recovery e hardening |

Substitua o exemplo pela política **real**. Se não houver política: **Not Defined**.

## Bloco de política sugerido

Projetos devem registrar:

1. Se error budgets são usados (yes / no / planned).
2. SLOs vinculados.
3. Quem decide quando a exaustão do budget muda a política de release ([operational-ownership.md](operational-ownership.md)).
4. O que acontece com incidentes que queimam budget ([incident-management.md](incident-management.md)).
5. Como corrective actions são priorizadas ([corrective-actions.md](corrective-actions.md)).

## Anti-padrões

- Publicar um SLO sem budget ou sem ownership do burn.
- Usar exaustão de budget como culpa em vez de priorização.
- Excluir falhas ad hoc para “salvar” o budget sem documentar exclusions.

## Documentos relacionados

- [service-levels.md](service-levels.md)
- [alerting.md](alerting.md)
- [post-incident-review.md](post-incident-review.md)
- [corrective-actions.md](corrective-actions.md)
- [operations-model.md](operations-model.md)
