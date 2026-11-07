# Confidence Model

> Language: EN | [Português (pt-BR)](../pt-BR/confidence-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Confidence expresses how strongly an agent or author trusts a **claim or summary**. It is independent of lifecycle **status** and of evidence **classification**.

## Levels

| Confidence | Meaning |
| --- | --- |
| **High** | Multiple Authoritative/Verified sources agree; evidence is current and specific |
| **Medium** | Credible evidence with minor gaps, age, or single-source dependency |
| **Low** | Weak, indirect, or partially conflicting evidence |
| **Unknown** | Confidence cannot be assessed |

## What Confidence Is Not

| Concept | Role |
| --- | --- |
| Lifecycle `status` | Document governance (`DRAFT` … `ARCHIVED`) |
| Classification | Evidence relationship (`Confirmed` … `Deprecated`) |
| Authority | Weight of the source document ([authority-levels.md](authority-levels.md)) |
| **Confidence** | Trust in *this* answer or claim given available evidence |

A claim can be **Confirmed** with **Medium** confidence if evidence is authoritative but aged. A claim can be **Inferred** with **High** confidence if many consistent signals agree — still **not** Confirmed.

## Rules

1. Do not use confidence to hide Unknown classification.
2. Do not map `ACCEPTED` status to High confidence automatically.
3. Security and operational actions that require Confirmed evidence still require Confirmed — High confidence Inferred is insufficient.
4. When confidence is Low or Unknown, say so in the answer ([ai-answering-rules.md](ai-answering-rules.md)).

## Related Documents

- [evidence-model.md](evidence-model.md)
- [claims.md](claims.md)
- [authority-levels.md](authority-levels.md)
