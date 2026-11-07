---
title: "AI context — SheetLedger (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# AI context

> Language: pt-BR | [English](../../en/docs/ai-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / Fictional example.**

## Cadeia recomendada
```text
Question → Scope → Context → Knowledge → Evidence → Constraints → Answer
```

1. Ler este arquivo e o overview.
2. Escopo: monólito FE+API ficcional. Não inventar microsserviços/filas.
3. Contexto: [architecture/system-context.md](architecture/system-context.md).
4. Conhecimento: `application/*`, `contracts/*`, `security/*`, `operations/*`.
5. Evidência: Classification Confirmed exige evidência; stack é Proposed.
6. Constraints: secrets só via env; status `DRAFT` até review humano; gaps em [knowledge-gaps.md](knowledge-gaps.md).

## Regras de resposta
- Não inventar endpoints, tabelas ou SLOs.
- Product/roadmap ≠ as-is.
- Padrão normativo vive em `docs/` do framework, **não** neste exemplo.
- Stack deste exemplo é ilustrativa e **não** é o padrão.

