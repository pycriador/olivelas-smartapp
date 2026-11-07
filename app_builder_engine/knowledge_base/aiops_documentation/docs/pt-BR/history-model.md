# Modelo de histórico

> Language: pt-BR | [English](../en/history-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como a documentação representa tempo e sucessão.

## Estados

| State | Meaning |
| --- | --- |
| **Current** | Descreve o sistema como é agora; elegível como SoT quando ACCEPTED/Authoritative |
| **Historical** | Verdadeiro para um período passado; não é SoT atual |
| **Deprecated** | Não mais recomendado; substituição identificada ou explicitamente ausente |
| **Superseded** | Substituído por um documento/decisão sucessor específico |

Tokens de ciclo de vida `DEPRECATED` / `ARCHIVED` frequentemente alinham com estados Deprecated/Historical do documento ([deprecation.md](deprecation.md), [archive-policy.md](archive-policy.md)).

## Regras

1. Rotule o escopo temporal ao misturar claims Current e Historical.
2. Docs supersedidos mantêm ids estáveis; use relacionamentos `replaced_by` / `supersedes`.
3. Claims Historical Confirmed permanecem Confirmed *para aquele tempo* — não reescreva o histórico silenciosamente.
4. A IA não deve usar Deprecated/Superseded como comportamento atual a menos que histórico seja pedido.

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [authority-levels.md](authority-levels.md)
- [document-relationships.md](document-relationships.md)

