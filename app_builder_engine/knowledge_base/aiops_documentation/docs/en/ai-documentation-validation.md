# AI Documentation Validation

> Language: EN | [Português (pt-BR)](../pt-BR/ai-documentation-validation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Validation checks for AI-ready documentation quality. Findings use severities **ERROR**, **WARNING**, and **INFO**.

## ERROR (must fix before ACCEPTED)

| Code | Check |
| --- | --- |
| E-SECRET | Secret value or credential material present |
| E-STATUS | AI/unapproved self-ACCEPT or illegal status token |
| E-INVENT | Invented component/service/control/owner presented as Confirmed |
| E-CLASS | Inferred/Proposed presented as Confirmed current |
| E-SOT | Contradicts Authoritative SoT without contradiction record |
| E-ID | Missing/duplicate document id when required |
| E-LINK | Critical broken link to SoT dependency |

## WARNING (should fix or track as debt)

| Code | Check |
| --- | --- |
| W-META | Missing recommended metadata |
| W-EVID | Confirmed claim weakly cited |
| W-FRESH | Stale-suspect dates on critical docs |
| W-GRAPH | Missing relationship to obvious dependency doc |
| W-COV | In-scope unit undocumented |
| W-GAP | Assumed items not labeled |
| W-DRIFT | Drift signals not linked to debt/drift docs |

## INFO (advisory)

| Code | Check |
| --- | --- |
| I-STYLE | Style-guide nits |
| I-CHUNK | Overlong section that may need split |
| I-DUP | Duplicative prose that could link instead |
| I-HIST | Historical doc mixed into current context pack |

## Process

1. Run checks after generation or material edit.
2. Block merge on ERROR for governed docs.
3. Convert WARNING to debt if deferred.
4. Record validation notes for [ai-auditability.md](ai-auditability.md).

## Related Documents

- [ai-review.md](ai-review.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [documentation-health.md](documentation-health.md)
