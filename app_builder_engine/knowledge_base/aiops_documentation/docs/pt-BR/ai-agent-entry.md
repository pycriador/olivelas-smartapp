---
title: "Arquivos de entrada de agentes de IA"
status: "DRAFT"
owner: "documentation-standard"
created: "2026-08-13"
updated: "2026-08-13"
review_date: "2026-11-13"
version: "1.0"
id: "REF-AI-ENTRY-001"
type: "Reference"
---

# Arquivos de entrada de agentes de IA

> Language: pt-BR | [English (EN)](../en/ai-agent-entry.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Como ligar Cursor, Claude Code e agentes de código semelhantes a este Documentation Standard.

Esta página é **empacotamento**: quais arquivos o agente carrega, o que cabe em cada um, e o que não vendorar. A metodologia permanece em [ai-context.md](ai-context.md), [ai-prompt-context.md](ai-prompt-context.md) e [source-of-truth.md](source-of-truth.md). Este padrão continua **sem** especificar RAG, embeddings, servidores MCP ou runtimes de agentes.

## Quando usar

- Um projeto adotou (ou está adotando) este padrão e usa um agente de código com IA.
- A saída do agente ignora convenções, inventa APIs ou trata uma spec como verdade do sistema atual.
- Você precisa de um starter para copiar: [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/).

## Hierarquia de contexto (persistente → transitório)

Carregue de cima para baixo. Não despeje a árvore `docs/` inteira em um prompt.

| Camada | Artefato | Carregar quando |
| --- | --- | --- |
| 1 | `AGENTS.md` e/ou `CLAUDE.md` | Sempre (entrada específica da ferramenta) |
| 2 | `.cursor/rules/*.mdc` (e equivalentes Claude) | Sempre ou por glob |
| 3 | Docs canônicos da tarefa | Por sessão — comece em `ai-context.md` |
| 4 | Arquivos-fonte e testes relevantes | Por tarefa |
| 5 | Saída de erro / teste / validador | Por iteração |
| 6 | Histórico da conversa | Acumula; abra sessão nova quando ficar stale |

Regras de montagem: [ai-prompt-context.md](ai-prompt-context.md). Profundidade progressiva: [progressive-context.md](progressive-context.md).

## Papel de cada arquivo

| Arquivo | Papel | O que colocar | O que não colocar |
| --- | --- | --- | --- |
| `AGENTS.md` | Entrada genérica de agente (Cursor, Codex, outros) | Stack, comandos, boundaries, ponteiro para `docs/**/ai-context.md` | Runbooks completos, texto duplicado do padrão |
| `CLAUDE.md` | Entrada do Claude Code | Mesmo grain que `AGENTS.md`; pode acrescentar comandos só do Claude | Uma segunda cópia do padrão de documentação |
| `.cursor/rules/*.mdc` | Guardrails curtos | Quality checks always-apply; ponteiros docs-first | Metodologia longa (isso pertence a `.md`) |
| `.cursor/skills/` e `.claude/skills/` | Workflows | Skills passo a passo (`document-after-change`, `grill-me`) | Fatos duráveis que deveriam viver em `docs/` |
| `docs/**/ai-context.md` | Entrada metodológica de IA | Navegação, níveis 0–6, segurança | Só nomes de arquivos específicos de ferramenta |

Templates: [templates/agents-entry.md](templates/agents-entry.md), [templates/claude-entry.md](templates/claude-entry.md).

`.md` é conhecimento durável. `.mdc` é guardrail curto. Skill é workflow. Veja a rule do projeto `docs-knowledge-in-markdown`.

## Skills e rules recomendadas (este padrão)

| Need | Use |
| --- | --- |
| Docs após mudança de código / contrato / ops / segurança | Skill `document-after-change` |
| Estressar um plano ou design antes de escrever | Skill `grill-me` |
| Quality gate antes de declarar a tarefa concluída | Rule local com os comandos reais do projeto (`make docs-validate`, `ruff`, `pytest`, …) |
| Onde ler primeiro neste corpus | Rule `docs-area-map` (este repo) ou o `ai-context.md` do adotante |

## Mapa para adotantes (plugins Loft vs este padrão)

**Não** copie um pack genérico de 20+ skills para cada repo de serviço. Prefira o plugin ou o artefato do framework que já é dono do tópico.

| Need | Use |
| --- | --- |
| Docs após mudança | Este framework: `document-after-change` |
| Documentação as-is de um módulo existente | Plugin Loft `loft-docs` / skill `as-is-module-documentation` |
| API e contratos de interface | Plugin Loft `loft-api` + [contract-model.md](contract-model.md) |
| Secrets e credenciais | Plugin Loft `loft-security` |
| CI/CD, Kubernetes, Datadog | Plugin Loft `loft-deploy` |
| Quality checks do projeto | Uma rule **local** com os comandos que de fato rodam naquele repo |
| Packs genéricos de idea-refine / TDD / frontend | Opcional em repo de aplicação; **não** fazem parte deste Documentation Standard |

## Anti-padrões

- Vendorar uma rule de “padrões de engenharia” da empresa que duplica (e fica stale vs) os plugins da org.
- Commitar andaime de execução (spec, RFC, plano de tasks) no `main` como se descrevesse o comportamento atual — [source-of-truth.md](source-of-truth.md).
- Duplicar [templates/adr.md](templates/adr.md) dentro de uma skill genérica de “documentation and ADRs”.
- Tratar `AGENTS.md` / `CLAUDE.md` como o padrão de documentação (eles são ponteiros).
- Adicionar agents, hooks ou slash commands do Cursor só porque outras ferramentas têm — só adicione quando o projeto tiver um workflow concreto. Rastreado como [dívida de documentação](documentation-debt.md) `DOC-015` neste repositório.

## Este repositório

| Artefato | Path |
| --- | --- |
| Entrada de agente | [AGENTS.md](../../AGENTS.md), [CLAUDE.md](../../CLAUDE.md) |
| Quality checks | [`.cursor/rules/docs-quality-checks.mdc`](../../.cursor/rules/docs-quality-checks.mdc) |
| Skills | [`.cursor/skills/`](../../.cursor/skills/), [`.claude/skills/`](../../.claude/skills/) |
| Pack para copiar | [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) |

## Documentos relacionados

- [ai-context.md](ai-context.md)
- [ai-prompt-context.md](ai-prompt-context.md)
- [ai-documentation-workflow.md](ai-documentation-workflow.md)
- [source-of-truth.md](source-of-truth.md)
- [adoption-path.md](adoption-path.md)
- [templates/agents-entry.md](templates/agents-entry.md)
- [templates/claude-entry.md](templates/claude-entry.md)
