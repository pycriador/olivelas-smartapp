---
title: "Sequence"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
# sequence_id: "stable-name"
---

# Sequência

> Language: pt-BR | [English](../../en/templates/sequence.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Interações ordenadas para uma operação ou cenário significativo. Prefira diagramas de sequência Mermaid quando esclarecerem o timing. Apenas estado atual, salvo se rotulado Proposed. -->

## Propósito

<!-- Qual cenário esta sequência documenta e quando se aplica. -->

## Atores e componentes

| Participante | Tipo | Papel |
| --- | --- | --- |
| | actor / origin / component / external | |

## Pré-condições

| Condição | Notas |
| --- | --- |
| | |

## Passos

| Passo | De | Para | Interação | Notas |
| --- | --- | --- | --- | --- |
| 1 | | | call / response / event / other | |

## Calls

| Call | De | Para | Contrato | Timeout |
| --- | --- | --- | --- | --- |
| | | | | |

## Responses

| Response | De | Para | Significado |
| --- | --- | --- | --- |
| | | | |

## Events

| Event | Publisher | Consumer | Contrato |
| --- | --- | --- | --- |
| | | | |

<!-- Marque Not Applicable se a sequência não tiver eventos. -->

## Timeouts

| Interação | Timeout | Em timeout |
| --- | --- | --- |
| | | |

## Errors

| Error | Detecção | Tratamento | Classificação |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown |

## Retries

| Interação | Política | Limite | Notas |
| --- | --- | --- | --- |
| | | | |

<!-- Marque Not Applicable se não existir comportamento de retry. -->

## Resultado

| Outcome | Condição | Efeito observável |
| --- | --- | --- |
| Success | | |
| Failure | | |
| Partial / other | | |

## Diagrama de sequência

```mermaid
sequenceDiagram
  participant Actor as Ator
  participant Origin as Origem
  participant Component as Componente
  Actor->>Origin: request
  Origin->>Component: call
  Component-->>Origin: response
  Origin-->>Actor: result
```

<!-- Recomendado quando timing e ordenação importam. Rotule caminhos de erro, timeout e retry quando forem arquiteturalmente relevantes. -->

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Data flow | |
| Contratos | |
| Components | |
| ADRs | |
