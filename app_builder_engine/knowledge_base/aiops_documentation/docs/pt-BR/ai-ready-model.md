# Modelo de documentação AI-Ready

> Language: pt-BR | [English](../en/ai-ready-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


O modelo AI-ready define como a documentação deve ser estruturada para que humanos e agentes de IA a usem como contexto de engenharia confiável — sem inventar sistemas de retrieval, embeddings ou chatbots.

Este padrão é **somente documentação**. Não exige RAG, bancos vetoriais, servidores MCP, motores de busca ou runtimes de agentes.

## Visão geral do modelo

```text
Context → Knowledge → Relationships → Evidence → Constraints → Actions
```

Cada estágio depende do anterior. Pular um estágio produz respostas plausíveis, mas inseguras.

| Stage | Purpose | Primary docs |
| --- | --- | --- |
| **Context** | Qual sistema/problema; onde começar | [ai-context.md](ai-context.md), [progressive-context.md](progressive-context.md) |
| **Knowledge** | Fatos estáveis, inventários, docs tipados | [document-types.md](document-types.md), registries |
| **Relationships** | Como docs e componentes se conectam | [documentation-graph.md](documentation-graph.md), [document-relationships.md](document-relationships.md) |
| **Evidence** | O que sustenta cada claim | [evidence-model.md](evidence-model.md), [claims.md](claims.md) |
| **Constraints** | Authority, safety, limites de tarefa | [source-of-truth.md](source-of-truth.md), [ai-task-boundaries.md](ai-task-boundaries.md), [ai-context-safety.md](ai-context-safety.md) |
| **Actions** | Como responder, mudar, validar | [ai-answering-rules.md](ai-answering-rules.md), [ai-change-rules.md](ai-change-rules.md), [ai-documentation-workflow.md](ai-documentation-workflow.md) |

## Detalhes dos estágios

### 1. Context

Estabeleça o escopo antes de responder ou editar:

- sistema / módulo em discussão;
- audiência e profundidade ([progressive-context.md](progressive-context.md));
- documento de entrada ([ai-context.md](ai-context.md));
- gaps conhecidos ([knowledge-gaps.md](knowledge-gaps.md)).

### 2. Knowledge

Represente fatos em documentos tipados e identificáveis com metadados ([document-metadata.md](document-metadata.md), [document-identity.md](document-identity.md)). Prefira estrutura machine-readable ([machine-readable.md](machine-readable.md)).

### 3. Relationships

Linke documentos e unidades arquiteturais com vocabulário controlado. Não dependa só de prosa para “related to X”.

### 4. Evidence

Toda claim não trivial precisa de classificação e, quando Confirmed, de uma referência. Nunca promova Inferred a Confirmed sem nova evidência autoritativa.

### 5. Constraints

Respeite authority de source-of-truth, status de ciclo de vida, redação de secrets e task boundaries. Confidence não é status.

### 6. Actions

Aplique regras de resposta, mudança, geração, revisão e validação. Registre contradições e gaps em vez de suavizá-los.

## Não objetivos

Este modelo **não** define:

- pipelines de embedding ou vector stores;
- políticas de retrieval RAG;
- UX de chatbot;
- wiring de ferramentas MCP;
- requisitos de produto de busca automatizada.

Esses podem consumir docs AI-ready depois; estão fora do escopo do Documentation Standard v1.0.

## Documentos relacionados

- [ai-context.md](ai-context.md) — ponto de entrada primário de IA
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [ai-documentation.md](ai-documentation.md) — regras de geração por IA existentes 
- [principles.md](principles.md)

