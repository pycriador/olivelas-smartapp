# Documentation Dependencies

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-dependencies.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Dependencies **between documents**: when document A cannot stay correct without document B.

## Why They Matter

- Drive review order and change impact
- Prevent orphan ACCEPTED pages that contradict hubs
- Help AI load the minimum necessary set

## Declaring Dependencies

Prefer an explicit section or metadata:

```yaml
related:
  - id: CONTRACT-001
    predicate: depends_on
  - id: ADR-012
    predicate: constrained_by
```

Or a table:

| Document | Depends on | Reason |
| --- | --- | --- |
| `ARCH-001` | `ADR-012` | Constraint source |
| `RB-014` | `OPS-alerts` | Alert names and thresholds |

## Rules

1. A `depends_on` edge implies B should be consulted before accepting material changes to A.
2. Circular documentation dependencies should be rare; break with a clear SoT doc.
3. Weak “see also” links are `references`, not `depends_on`.

## Related Documents

- [document-relationships.md](document-relationships.md)
- [change-impact.md](change-impact.md)
- [review-policy.md](review-policy.md)
