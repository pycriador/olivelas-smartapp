# Diretrizes de geração por IA

> Language: pt-BR | [English](../en/ai-generation-guidelines.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como a IA deve gerar conteúdo de documentação sob este padrão.

## Estilo

- Seguir [style-guide.md](style-guide.md) e [standards.md](standards.md)
- Inglês para artefatos de documentação fonte; manter machine tokens em inglês
- Títulos específicos; hierarquia de headings rasa
- Tabelas para inventários; listas para procedimentos

## Conteúdo

1. Fundamente toda claim não trivial em evidência ou marque Unknown.
2. Use metadados obrigatórios ([document-metadata.md](document-metadata.md)).
3. Prefira links para docs canônicos a duplicação.
4. Mantenha diagramas alinhados ao estado atual ou rotule Proposed.
5. Use vocabulários de domínio já definidos (drift, breaking changes, operational state, etc.).
6. Gere páginas Incomplete Accurate em vez de Complete Fiction.

## Checklist de estrutura

- Bloco de header language/status/standard
- Seção de propósito cedo
- Unknown/Not applicable explícitos onde vazio
- Seção Documentos relacionados com links relativos
- Sem secrets em exemplos — apenas placeholders

## Documentos relacionados

- [ai-documentation.md](ai-documentation.md)
- [ai-review.md](ai-review.md)
- [ai-documentation-anti-patterns.md](ai-documentation-anti-patterns.md)

