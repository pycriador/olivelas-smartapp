# Validação de documentação com IA

> Language: pt-BR | [English](../en/ai-documentation-validation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Checagens de validação para qualidade de documentação AI-ready. Achados usam severidades **ERROR**, **WARNING** e **INFO**.

## ERROR (deve corrigir antes de ACCEPTED)

| Code | Check |
| --- | --- |
| E-SECRET | Valor de secret ou material de credencial presente |
| E-STATUS | Auto-ACCEPT por IA/não aprovado ou token de status ilegal |
| E-INVENT | Componente/serviço/controle/owner inventado apresentado como Confirmed |
| E-CLASS | Inferred/Proposed apresentado como Confirmed atual |
| E-SOT | Contradição com SoT Authoritative sem registro de contradição |
| E-ID | Document id ausente/duplicado quando exigido |
| E-LINK | Link crítico quebrado para dependência de SoT |

## WARNING (deve corrigir ou rastrear como debt)

| Code | Check |
| --- | --- |
| W-META | Metadados recomendados ausentes |
| W-EVID | Claim Confirmed com citação fraca |
| W-FRESH | Datas suspeitas de stale em docs críticos |
| W-GRAPH | Relacionamento ausente com doc de dependência óbvio |
| W-COV | Unidade no escopo sem documentação |
| W-GAP | Itens Assumed não rotulados |
| W-DRIFT | Sinais de drift não linkados a docs de debt/drift |

## INFO (consultivo)

| Code | Check |
| --- | --- |
| I-STYLE | Detalhes do style-guide |
| I-CHUNK | Seção longa demais que pode precisar de split |
| I-DUP | Prosa duplicativa que poderia linkar |
| I-HIST | Doc histórico misturado no context pack atual |

## Processo

1. Execute checagens após geração ou edição material.
2. Bloqueie merge em ERROR para docs governados.
3. Converta WARNING em debt se adiado.
4. Registre notas de validação para [ai-auditability.md](ai-auditability.md).

## Documentos relacionados

- [ai-review.md](ai-review.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [documentation-health.md](documentation-health.md)

