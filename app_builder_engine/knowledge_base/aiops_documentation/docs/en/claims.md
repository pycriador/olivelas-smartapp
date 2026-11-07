# Claims

> Language: EN | [Português (pt-BR)](../pt-BR/claims.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


A **claim** is an atomic statement about the system that can be classified, evidenced, and challenged.

## Anatomy of a Claim

| Element | Meaning |
| --- | --- |
| **Statement** | Single, testable assertion |
| **Classification** | Confirmed / Inferred / Proposed / Unknown / Deprecated |
| **Evidence** | Reference(s) supporting the statement |
| **Confidence** | High / Medium / Low / Unknown ([confidence-model.md](confidence-model.md)) |
| **Scope** | Environment, version, time window when relevant |
| **Owner** | Who can confirm or refute |

## Good vs Bad Claims

| Prefer | Avoid |
| --- | --- |
| `checkout-api` exposes `POST /payments` (Confirmed, OpenAPI path) | “The API works fine” |
| Retry limit is 3 (Confirmed, config key) | “We usually retry” |
| Failover strategy: Unknown | Invented multi-region story |
| Event sourcing is Proposed | Presenting roadmap as current |

## Claim Lifecycle

```text
Asserted → Evidenced → Classified → Reviewed → (Deprecated | Superseded | Retained)
```

Material claim changes on `ACCEPTED` docs follow [change-policy.md](change-policy.md) and may move the document to `REVIEW`.

## Contradictory Claims

When two claims conflict, follow [contradiction-model.md](contradiction-model.md). Do not silently drop one side.

## AI Obligations

- Extract claims rather than paraphrasing entire pages into ungrounded prose.
- Refuse to upgrade classification without new evidence.
- Surface Unknown claims instead of filling gaps.

## Related Documents

- [evidence-model.md](evidence-model.md)
- [evidence-references.md](evidence-references.md)
- [confidence-model.md](confidence-model.md)
- [contradiction-model.md](contradiction-model.md)
