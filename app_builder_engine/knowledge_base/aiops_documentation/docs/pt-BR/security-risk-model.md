# Modelo de Risk de Segurança

> Language: pt-BR | [English](../en/security-risk-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção registram **security risk** de forma consistente e agnóstica de tecnologia.

Uma matriz numérica Likelihood × Impact é **opcional**. Projetos podem usar escalas qualitativas, severity ligada a criticality ou uma narrativa leve. Declare o modelo que o projeto realmente usa; marque regras de scoring **Not Defined** quando nenhuma existir.

Não invente scores de residual risk ou decisões de acceptance que ninguém tomou.

## Propósito

Conectar threats e vulnerabilities a decisões:

```text
Threat (+ Vulnerability) → Risk → Accept / Mitigate / Transfer / Avoid → Residual risk
```

## Dimensões centrais

| Dimension | Meaning |
| --- | --- |
| **Likelihood** | Quão plausível é o cenário sob as assumptions declaradas |
| **Impact** | Harm se o cenário ocorrer (confidentiality, integrity, availability, privacy, trust, cost — conforme aplicável) |
| **Severity** | Seriedade geral usada para priorização (pode combinar likelihood e impact, ou seguir rubric do projeto) |
| **Confidence** | Quão certos estamos da assessment (alinhe a Confirmed / Inferred / Unknown / Proposed) |
| **Residual risk** | Risk remanescente após os controls atuais |

Opcional: inherent risk (antes dos controls) vs residual (depois). Use só se o projeto achar a distinção útil.

## Likelihood × Impact opcional

Escalas qualitativas de exemplo (adapte ou substitua):

| Likelihood | Example meaning |
| --- | --- |
| Low | Plausível só com condições incomuns |
| Medium | Plausível sob assumptions normais de operação |
| High | Esperado sem controls adicionais |

| Impact | Example meaning |
| --- | --- |
| Low | Harm limitado e recuperável |
| Medium | Harm material a users, dados ou operações |
| High | Harm severo; major incident ou falha de trust |

Se o projeto multiplicar ou mapear para um grid de severity, documente esse grid uma vez. Se não, use severity narrativa.

## Registro sugerido de risk

| Campo | Significado |
| --- | --- |
| **ID** | Id curto e estável |
| **Risk statement** | Conciso “if X then Y” |
| **Related threat / asset** | Links |
| **Likelihood** | Conforme escala do projeto ou Not Defined |
| **Impact** | Conforme escala do projeto ou Not Defined |
| **Severity** | Conforme rubric do projeto |
| **Confidence** | Confirmed / Inferred / Unknown / Proposed |
| **Controls** | Controls atuais (links) |
| **Residual risk** | Após controls |
| **Decision** | accept / mitigate / transfer / avoid / Not Defined |
| **Owner** | Quem owns a decisão ou mitigation |

## Inventário sugerido

| ID | Risk | Likelihood | Impact | Severity | Confidence | Residual | Decision | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

## Integração com Operações e Arquitetura

| Concern | Link |
| --- | --- |
| Criticality do service | [criticality.md](criticality.md) |
| Impact de falha | [failure-modes.md](failure-modes.md), [incident-severity.md](incident-severity.md) |
| Error budget / trade-offs de reliability | [error-budget.md](error-budget.md) — não equacione burn de reliability com acceptance de segurança |
| Arquitetura debt / security debt | Destaque quando risk é aceito devido a lacunas conhecidas |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Top risks narrativos com owners e notas de residual |
| Medium | Inventário com severity e decisions |
| Large | Escalas explícitas, confidence, linkage a exceptions |

## Anti-Patterns

- Scores precisos sem escala definida.
- Risks “Accepted” sem owner.
- Tratar Unknown likelihood como Low.
- Afirmar transfer (ex.: “o vendor cuida”) sem boundary e nota de residual.

## Documentos relacionados

- [security-model.md](security-model.md)
- [threat-modeling.md](threat-modeling.md)
- [security-requirements.md](security-requirements.md)
- [security-controls.md](security-controls.md)
- [security-ownership.md](security-ownership.md)
