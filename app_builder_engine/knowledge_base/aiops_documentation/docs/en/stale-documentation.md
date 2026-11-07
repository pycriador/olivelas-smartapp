# Stale Documentation

> Language: EN | [Português (pt-BR)](../pt-BR/stale-documentation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Stale documentation looks current but no longer matches the system. It is more dangerous than a missing page because readers and AI agents trust it.

## Age Is a Signal, Not Proof

An old `updated` date suggests risk; it does not prove the content is wrong. A recently touched doc can still be stale if the wrong sections were edited.

Always validate against evidence (code, config, contracts, runtime behavior), not against the calendar alone.

## Signals of Staleness

| Signal | Why it matters |
| --- | --- |
| Document contradicts code or config | Direct inaccuracy |
| Contract docs lag schema or consumers | Integration risk |
| Runbook steps fail or skip real tooling | Operational risk |
| Diagrams show removed components | Misleading mental model |
| Owner team no longer exists | Maintenance gap |
| Incidents reveal "docs were wrong" | Confirmed staleness |
| Dependencies renamed/replaced with no doc update | Hidden coupling |
| Status still `ACCEPTED` after large unreviewed change | Process gap |
| Multiple docs disagree with no canonical link | Conflict debt |
| Only AI-generated content with no evidence trail | Trust gap |

## How to Identify

1. Compare critical claims to authoritative sources.
2. Walk one operational path (deploy, failure, integrate) using the doc as the only guide.
3. Ask whether a new engineer or agent would make a wrong decision from this page.
4. Check related docs for divergence after a known change.
5. Use review triggers in [review-policy.md](review-policy.md) as a checklist after releases.

## How to Treat

| Situation | Action |
| --- | --- |
| Small factual drift | Fix immediately; update `updated`; review as needed |
| Material drift on `ACCEPTED` doc | Move to `REVIEW`, correct, re-accept ([lifecycle.md](lifecycle.md)) |
| Cannot fix now | Register [documentation debt](documentation-debt.md) with impact and owner |
| Superseded | [Deprecate](deprecation.md) with replacement link |
| No operational value | [Archive](archive-policy.md) |
| Unclear ownership | Assign [owner](ownership.md) before calling the doc governed |

Do **not** invent statuses like `STALE`, `OLD`, or `OUTDATED`. Keep the five lifecycle tokens and express staleness through review, debt, deprecation, or archive.

## Link to Debt and Review

- Staleness without a fix plan → documentation debt item.
- Staleness with active correction → change-driven or periodic review.
- Recurring staleness in a category → revisit ownership and [change-policy.md](change-policy.md) adherence.

## Related Documents

- [documentation-debt.md](documentation-debt.md)
- [review-policy.md](review-policy.md)
- [lifecycle.md](lifecycle.md)
- [change-policy.md](change-policy.md)
- [quality-model.md](quality-model.md)
