# Documentation Coverage

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-coverage.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Coverage measures whether **in-scope** systems, components, services, and contracts have corresponding documentation nodes.

Coverage ≠ completeness of each page ([documentation-completeness.md](documentation-completeness.md)) and ≠ freshness ([documentation-freshness.md](documentation-freshness.md)).

## Coverage Dimensions

| Dimension | Question |
| --- | --- |
| **Component coverage** | Does each registered component have an architecture mention? |
| **Service coverage** | Does each service have ownership + ops entry points? |
| **Contract coverage** | Does each public boundary have a contract doc? |
| **Runbook coverage** | Do critical alerts/failures link to runbooks? |
| **Security coverage** | Are in-scope assets/controls documented or explicitly Unknown? |
| **Decision coverage** | Are ADR-worthy decisions recorded? |

## Scoring Guidance (Optional)

Projects may track simple ratios:

```text
coverage = documented_in_scope / in_scope_total
```

Mark denominators honestly. Do not inflate coverage by inventing components.

## Gaps

Uncovered in-scope items → [knowledge-gaps.md](knowledge-gaps.md) or [documentation-debt.md](documentation-debt.md).

## Related Documents

- [documentation-completeness.md](documentation-completeness.md)
- [component-registry.md](component-registry.md)
- [service-registry.md](service-registry.md)
