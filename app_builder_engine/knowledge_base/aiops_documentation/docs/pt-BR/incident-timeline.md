# Timeline de Incidentes

> Language: pt-BR | [English](../en/incident-timeline.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como registrar o que aconteceu durante um incidente sem misturar fatos e palpites.

Uma timeline é a espinha de notas de response, [análise de causa raiz](root-cause-analysis.md) e [post-incident review](post-incident-review.md).

## Marcadores de entrada

Marque cada entrada:

| Marker | Meaning |
| --- | --- |
| **FACT** | Evidência observada ou registrada (metric, log, mensagem, ação tomada) |
| **HYPOTHESIS** | Teoria de trabalho ainda não comprovada |
| **CONFIRMED** | Hipótese anterior validada por evidência |
| **UNKNOWN** | Pergunta aberta; não preencha com invenção |

Promova HYPOTHESIS → CONFIRMED ou rejeite-a explicitamente. Mantenha UNKNOWN visível — gaps dirigem corrective actions detective.

## Forma da entrada

| Time (UTC or stated TZ) | Marker | Entry | Source / evidence | Author role |
| --- | --- | --- | --- | --- |
| | FACT / HYPOTHESIS / CONFIRMED / UNKNOWN | | | |

Regras:

- Use um único timezone e declare-o.
- Registre tempo de detection, tempos de mitigation e tempo de resolution quando conhecidos.
- Separe “fizemos X” (FACT) de “X corrigiu porque Y” (HYPOTHESIS até evidenciado).

## O que pertence

- Alerts disparando / limpando
- Mudanças de severity
- Comandos e mudanças aplicadas (não secrets)
- Relatos de customer ou stakeholder
- Links para graphs, logs, deploys, diffs de config
- Decisões e por quê (como FACT de que a decisão foi tomada; rationale pode ser HYPOTHESIS)

## O que não pertence

- Culpa ou julgamentos pessoais
- Valores de secret ou PII desnecessário
- Reescrever a história para parecer limpa — acrescente correções como novas entradas FACT

## Opção leve

Incidentes pequenos podem usar uma lista curta de bullets com os mesmos marcadores. Incidentes grandes precisam de tabela ou doc dedicado.

## Documentos relacionados

- [incident-management.md](incident-management.md)
- [root-cause-analysis.md](root-cause-analysis.md)
- [post-incident-review.md](post-incident-review.md)
- [standards.md](standards.md)
