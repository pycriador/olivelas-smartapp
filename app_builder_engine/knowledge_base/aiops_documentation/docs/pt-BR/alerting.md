# Alerting

> Language: pt-BR | [English](../en/alerting.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar alerts para que sejam **actionable**.

Um alert que não dirige uma decisão desperdiça atenção e erode confiança. Prefira menos alerts, mais claros, a teatro de cobertura ruidosa.

## Cadeia de alert actionable

```text
Condition → Alert → Owner → Action → Escalation
```

| Stage | Meaning |
| --- | --- |
| **Condition** | Predicado observável (threshold, ausência de sinal, falha de health) |
| **Alert** | Canal de notificação e rótulo de severity / priority |
| **Owner** | Quem o recebe ([operational-ownership.md](operational-ownership.md)) |
| **Action** | Primeiros passos ou link de runbook |
| **Escalation** | Quando e para quem se não resolvido |

## Inventário sugerido

| Condition | Alert | Owner | Action | Escalation |
| --- | --- | --- | --- | --- |
| | | | link runbook / steps | |

## Regras de qualidade

| Do | Avoid |
| --- | --- |
| Alertar sobre sintomas ligados a impacto no usuário ou SLO quando possível | Alertar sobre todo gauge interno |
| Incluir contexto suficiente para iniciar diagnóstico | Pagear só com nome nu de métrica |
| Vincular um runbook ou ação explícita | Esperar conhecimento tribal às 3h |
| Definir escalation | Deixar on-call sozinho |
| Ajustar após falsos positivos | Culpar pessoas por mutar alerts ruins sem corrigi-los |

Se não existir on-call, documente quem é notificado e que paging formal é **Not Applicable**.

## Severity vs criticality

A urgência do alert pode seguir [incident-severity.md](incident-severity.md). A [criticality.md](criticality.md) do componente informa se um alert deve existir — são relacionados, não idênticos.

## Ausência de sinal

“Sem dados” pode ser tão importante quanto um valor ruim. Documente monitors para falha do backend de observability quando cegueira for inaceitável ([operational-dependencies.md](operational-dependencies.md)).

## Documentos relacionados

- [monitoring.md](monitoring.md)
- [runbooks/README.md](runbooks/README.md)
- [incident-management.md](incident-management.md)
- [incident-severity.md](incident-severity.md)
- [operational-ownership.md](operational-ownership.md)
- [error-budget.md](error-budget.md)
