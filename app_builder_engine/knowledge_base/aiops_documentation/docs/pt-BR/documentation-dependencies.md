# Dependências de documentação

> Language: pt-BR | [English](../en/documentation-dependencies.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Dependências **entre documentos**: quando o documento A não pode permanecer correto sem o documento B.

## Por que importam

- Impulsionam ordem de revisão e impacto de mudança
- Evitam páginas ACCEPTED órfãs que contradizem hubs
- Ajudam a IA a carregar o conjunto mínimo necessário

## Declarando dependências

Prefira uma seção explícita ou metadados:

```yaml
related:
  - id: CONTRACT-001
    predicate: depends_on
  - id: ADR-012
    predicate: constrained_by
```

Ou uma tabela:

| Document | Depends on | Reason |
| --- | --- | --- |
| `ARCH-001` | `ADR-012` | Constraint source |
| `RB-014` | `OPS-alerts` | Alert names and thresholds |

## Regras

1. Uma aresta `depends_on` implica que B deve ser consultado antes de aceitar mudanças materiais em A.
2. Dependências circulares de documentação devem ser raras; quebre com um doc SoT claro.
3. Links fracos de “see also” são `references`, não `depends_on`.

## Documentos relacionados

- [document-relationships.md](document-relationships.md)
- [change-impact.md](change-impact.md)
- [review-policy.md](review-policy.md)

