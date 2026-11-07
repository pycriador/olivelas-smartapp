---
title: "AI Task Context: pergunta de retry do notify-bridge (Ficcional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "AITASK-NB-001"
type: "Context"
---

# AI Task Context

> Language: pt-BR | [English](../en/ai-task-context.md)
>
> **Exemplo ficcional — não é um projeto real.**

Monta um **pacote de contexto de prompt** para uma tarefa de IA escopada. Prática documental apenas — não é produto RAG.

Política: [ai-prompt-context.md](../../../docs/pt-BR/ai-prompt-context.md), [progressive-context.md](../../../docs/pt-BR/progressive-context.md), [ai-context.md](../../../docs/pt-BR/ai-context.md).

## Task

| Field | Value |
| --- | --- |
| Task ID | AITASK-NB-001 |
| Question | Quantas vezes o notify-bridge retenta uma entrega falha antes da DLQ? |
| Task type | Answer / Analysis |
| Allowed actions | Ler docs; citar evidência; reportar gaps/contradições |
| Not allowed | Inventar configs; expor secrets; definir ACCEPTED |

## Scope

| Field | Value |
| --- | --- |
| System | notify-bridge (fictício) |
| Environment | Exemplo / não produção |
| Timeframe | Current |
| Depth target | Evidence (parar quando o claim for respondido) |

## Context Pack

| Slot | Document ID / path | Why included |
| --- | --- | --- |
| 1 | `docs/pt-BR/ai-context.md` | Entrada primária de IA |
| 2 | `docs/pt-BR/ai-task-boundaries.md` + `ai-context-safety.md` | Limites + segurança |
| 3 | ARCH-NB-001 | Overview do sistema |
| 4 | CMP-NB-001 | Comportamento do componente |
| 5 | CLAIM-NB-001 | Claim Confirmado de retry + evidência |
| 6 | CONTRA-NB-001 + GAP-NB-001 | Conflito aberto + retenção Unknown |

## Explicitly Not Loaded

| Item | Reason |
| --- | --- |
| Árvore completa `docs/` | Progressive context — desnecessário |
| Valores do secret store | Segurança — apenas nomes |
| Corpo da nota ops legada | Carregada só como ponteiro de contradição |

## Expected Answer Shape

1. Afirmar **3** retries com classificação Confirmed e citações à evidência de CLAIM-NB-001.
2. Mencionar contradição aberta CONTRA-NB-001 (legado “5 retries”).
3. Dizer que retenção da DLQ é Unknown (GAP-NB-001).
4. Não inventar settings de broker nem valores secretos.

## Audit

| Field | Value |
| --- | --- |
| Assembled by | human (exemplo) |
| Assembled on | 2026-08-07 |
| Reviewer | example-platform-team |
