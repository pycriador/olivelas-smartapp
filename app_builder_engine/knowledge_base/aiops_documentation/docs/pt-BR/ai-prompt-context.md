# Contexto de prompt da IA

> Language: pt-BR | [English](../en/ai-prompt-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como montar **contexto de prompt** a partir da documentação para uma tarefa de IA — como prática de documentação, não como pipeline de RAG productizado.

## Receita do context pack

| Slot | Source | Notes |
| --- | --- | --- |
| 1 | [ai-context.md](ai-context.md) | Always |
| 2 | Task boundaries + safety | [ai-task-boundaries.md](ai-task-boundaries.md), [ai-context-safety.md](ai-context-safety.md) |
| 3 | Scoped overview | Context/Arquitetura Level 1–2 |
| 4 | Task-specific docs | Contract / Ops / Segurança as needed |
| 5 | Evidence excerpts | Paths cited, not entire repos dumped |
| 6 | Gaps / contradictions | Known unknowns |

## Regras de montagem

1. Prefira packs pequenos de alta autoridade a dumps grandes de baixa autoridade.
2. Respeite limites de contexto em [chunking-guidelines.md](chunking-guidelines.md).
3. Inclua metadados (id, status, updated, classification defaults) quando disponíveis.
4. Exclua secrets, credenciais e PII desnecessária.
5. Exclua Deprecated/Archived a menos que a tarefa seja histórica.
6. Declare o que **não** foi carregado quando for material para a confidence.

## Anti-padrões

- Colar a árvore inteira de `docs/`
- Misturar docs de roadmap Proposed como se fossem SoT ACCEPTED
- Omitir regras de segurança para “economizar tokens”

## Documentos relacionados

- [progressive-context.md](progressive-context.md)
- [search-readiness.md](search-readiness.md)
- [chunking-guidelines.md](chunking-guidelines.md)
- [ai-agent-entry.md](ai-agent-entry.md)

