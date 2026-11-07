# Prontidão para busca

> Language: pt-BR | [English](../en/search-readiness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Prepare a documentação para que **possa** ser indexada ou buscada depois. Este padrão **não** implementa RAG, embeddings, bancos vetoriais ou um motor de busca.

## Critérios de readiness

| Criterion | Why it helps indexing |
| --- | --- |
| Stable `id` + title | Unique keys |
| Explicit `type` + tags | Filtering |
| First-paragraph purpose | Snippets |
| Predictable headings | Section anchors |
| Tables for inventories | Structured extraction |
| Relative links | Graph crawl |
| Manifest entries | Seed URL/path list |
| Redacted secrets | Safe indexing |

## Práticas de autoria

1. Coloque fatos críticos em headings/tabelas, não só em prosa enterrada.
2. Evite pronomes ambíguos sem antecedentes em claims-chave.
3. Declare sinônimos em entradas de glossário quando necessário.
4. Mantenha um tópico primário por documento quando viável ([chunking-guidelines.md](chunking-guidelines.md)).

## Não objetivos explícitos

- Sem escolha de modelo de embedding
- Sem implementação de chunker
- Sem harness de avaliação de retrieval
- Sem política de ranking de chatbot

## Documentos relacionados

- [manifest-rules.md](manifest-rules.md)
- [machine-readable.md](machine-readable.md)
- [chunking-guidelines.md](chunking-guidelines.md)

