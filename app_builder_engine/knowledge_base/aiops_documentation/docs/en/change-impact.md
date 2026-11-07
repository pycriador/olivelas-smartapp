# Change Impact

> Language: EN | [Português (pt-BR)](../pt-BR/change-impact.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How to reason about which documentation (and related artifacts) must be reviewed when something changes.

## Impact Analysis Steps

1. Identify the changed artifact (code, schema, config, ADR, runbook).
2. Locate graph nodes that `describes`, `includes`, `exposes`, `operates`, or `secures` it.
3. Follow `depends_on` documentation edges ([documentation-dependencies.md](documentation-dependencies.md)).
4. List contracts, consumers, and ops/security docs in the blast radius.
5. Classify each doc action: update / review / mark Unknown / open debt / no-op.
6. Record evidence for behavioral claims after the change.

## Impact Matrix (Examples)

| Change | Likely docs to review |
| --- | --- |
| New HTTP field | Contract, schema, consumer notes, examples |
| New deployable | Architecture, component/service registries, ops ownership |
| Alert threshold | Alerting doc, runbook, SLO/error budget if linked |
| Authn mechanism | Security architecture, identity, contract security, runbooks |
| ADR acceptance | Architecture constraints, related overviews |

## AI Rules

- AI must list impacted docs before large edits ([ai-change-rules.md](ai-change-rules.md)).
- AI must not claim “no impact” when Unknown — say impact Unknown.
- Prefer Potential Breaking Change / Unknown Impact language for contracts ([breaking-changes.md](breaking-changes.md)).

## Related Documents

- [documentation-dependencies.md](documentation-dependencies.md)
- [change-policy.md](change-policy.md)
- [documentation-graph.md](documentation-graph.md)
