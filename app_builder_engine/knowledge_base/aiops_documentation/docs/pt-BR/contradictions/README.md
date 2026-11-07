---
title: "Registro de Contradições"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
---

# Registro de Contradições

> Language: pt-BR | [English (EN)](../../en/contradictions/README.md)
>
> Documentation Standard v1.0

Armazene registros de contradição aqui. Use [../templates/contradiction.md](../templates/contradiction.md).

## Tokens de status

`OPEN` | `INVESTIGATING` | `RESOLVED` | `ACCEPTED`

`ACCEPTED` significa que a contradição é reconhecida com uma estratégia explícita de resolução (não que ambas as afirmações sejam verdadeiras).

## Automação

Conflitos objetivos (IDs duplicados, entradas conflitantes de manifest, refs quebradas) são detectados pelo linter. Contradições semânticas permanecem com revisão humana ([../contradiction-model.md](../contradiction-model.md)).

## Exemplo

Amostra fictícia: [../../../examples/governance/contradiction.md](../../../examples/governance/contradiction.md)
