# Documentation Freshness

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-freshness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Freshness describes whether documentation still reflects the **current** system within an acceptable review window.

Age is a **signal**, not proof of staleness ([stale-documentation.md](stale-documentation.md)).

## Signals

| Signal | Interpretation |
| --- | --- |
| Old `updated` / `review_date` | Higher risk; verify critical claims |
| Recent edit on wrong sections | May still be stale |
| Evidence `collected_on` far in past | Re-verify Confirmed claims |
| Code changed with no doc PR | Freshness risk / possible drift |
| Incident: “docs were wrong” | Confirmed staleness |

## Freshness States (Descriptive)

| State | Meaning |
| --- | --- |
| **Fresh** | Reviewed against evidence within policy window |
| **Aging** | Approaching review; no known contradiction |
| **Stale-suspect** | Signals present; not yet proven wrong |
| **Stale** | Proven mismatch → treat via drift/debt/lifecycle |

Do **not** add lifecycle tokens like `STALE`. Use `REVIEW`, debt, deprecation, or archive.

## AI Rules

- Prefer documents with newer verified evidence when conflicts exist.
- Do not assert Fresh without checking SoT.
- Cite `updated` / evidence dates when confidence depends on them.

## Related Documents

- [stale-documentation.md](stale-documentation.md)
- [review-policy.md](review-policy.md)
- [documentation-drift.md](documentation-drift.md)
