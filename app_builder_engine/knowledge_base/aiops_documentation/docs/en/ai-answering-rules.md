# AI Answering Rules

> Language: EN | [Português (pt-BR)](../pt-BR/ai-answering-rules.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Rules for answering questions from documentation and evidence.

## General Rules

1. Answer only within identified scope.
2. Prefer Confirmed claims with citations.
3. Label Inferred explicitly; never present as Confirmed.
4. Say Unknown when evidence is missing.
5. Keep Proposed clearly future/desired.
6. State confidence when material ([confidence-model.md](confidence-model.md)).
7. Prefer linking canonical docs over copying large sections.
8. Resolve conflicts via [source-of-truth.md](source-of-truth.md) / [contradiction-model.md](contradiction-model.md).
9. Never expose secrets; use `[REDACTED]` ([ai-context-safety.md](ai-context-safety.md)).
10. Separate facts, inferences, assumptions, and recommendations.

## AI Evidence Rules

1. Every Confirmed statement in an answer should be traceable to an evidence reference.
2. Inferred statements must name the signals used (paths, docs) when possible.
3. Absence of evidence → Unknown, not negative proof — unless a thorough scoped search was performed and is described.
4. Do not launder Inferred into Confirmed by verbose wording.
5. Deprecated claims may be mentioned only as historical, with replacement pointers.
6. Evidence older than the project’s freshness expectations lowers confidence; say so.
7. Security and operational action guidance requires Confirmed procedure sources (accepted runbooks/controls) — otherwise refuse or escalate.
8. When evidence conflicts, present the contradiction; do not average into false certainty.

## Answer Shape (Recommended)

```text
Answer
Evidence / citations
Classification & confidence
Gaps / Unknowns
Recommended next docs (optional)
```

## Related Documents

- [evidence-model.md](evidence-model.md)
- [claims.md](claims.md)
- [ai-documentation.md](ai-documentation.md)
