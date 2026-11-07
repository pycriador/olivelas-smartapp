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

> Language: EN | [Português (pt-BR)](../../pt-BR/docs/ai-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / Fictional example.**

## Recommended chain
```text
Question → Scope → Context → Knowledge → Evidence → Constraints → Answer
```

1. Read this file and the overview.
2. Scope: fictional FE+API monolith. Do not invent microservices/queues.
3. Context: [architecture/system-context.md](architecture/system-context.md).
4. Knowledge: `application/*`, `contracts/*`, `security/*`, `operations/*`.
5. Evidence: Confirmed Classification requires evidence; stack is Proposed.
6. Constraints: secrets via env only; `DRAFT` until human review; gaps in [knowledge-gaps.md](knowledge-gaps.md).

## Answering rules
- Do not invent endpoints, tables, or SLOs.
- Product/roadmap ≠ as-is.
- Normative standard lives under framework `docs/`, **not** in this example.
- This example stack is illustrative and is **not** the standard.

