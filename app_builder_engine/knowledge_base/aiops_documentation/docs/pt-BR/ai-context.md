# Contexto de IA

> Language: pt-BR | [English](../en/ai-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

**Ponto de entrada primário de IA** deste Documentation Standard. Agentes e humanos que preparam prompts de IA devem começar aqui e seguir os links — não carregue o corpus inteiro às cegas.

Esta página é intencionalmente curta. Os detalhes vivem nos documentos linkados.

## Começar

1. Leia este arquivo.
2. Aplique [ai-navigation.md](ai-navigation.md).
3. Carregue apenas a profundidade exigida pela pergunta ([progressive-context.md](progressive-context.md)).
4. Obedeça [ai-task-boundaries.md](ai-task-boundaries.md) e [ai-context-safety.md](ai-context-safety.md).

## Cadeia do modelo

```text
Context → Knowledge → Relationships → Evidence → Constraints → Actions
```

Veja [ai-ready-model.md](ai-ready-model.md).

## Hierarquia de níveis (0–6)

| Level | Focus | Load when |
| --- | --- | --- |
| **0** | Esta entrada + regras de navegação/segurança | Sempre para trabalho de IA em docs |
| **1** | Contexto do projeto/sistema e glossários | “What is this system?” |
| **2** | Arquitetura e boundaries | Structure, components, dependencies |
| **3** | Contratos e interfaces | APIs, events, compatibility |
| **4** | Operações e reliability | Run, fail, recover |
| **5** | Segurança | Assets, threats, controls, secrets *references* |
| **6** | Evidência, drift, debt, history | Validation, contradictions, change impact |

Não pule para narrativa de Level 6 sem escopo dos Levels 0–1.

## Ponteiros de regras centrais

| Need | Document |
| --- | --- |
| Answer questions | [ai-answering-rules.md](ai-answering-rules.md) |
| Change docs/code with doc impact | [ai-change-rules.md](ai-change-rules.md), [ai-documentation-workflow.md](ai-documentation-workflow.md) |
| Classify claims | [evidence-model.md](evidence-model.md) |
| Avoid secrets | [ai-context-safety.md](ai-context-safety.md) |
| Existing AI writing rules | [ai-documentation.md](ai-documentation.md) |
| Ligar Cursor / Claude Code | [ai-agent-entry.md](ai-agent-entry.md) |

## Não objetivos

Nenhuma especificação de RAG, embeddings, vector DB, MCP, search engine ou chatbot nesta página.

## Documentos relacionados

- [progressive-context.md](progressive-context.md)
- [ai-prompt-context.md](ai-prompt-context.md)
- [ai-agent-entry.md](ai-agent-entry.md)
- [manifest.yaml](manifest.yaml)
