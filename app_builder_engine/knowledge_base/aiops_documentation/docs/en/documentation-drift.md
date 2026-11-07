# Documentation Drift

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


**Documentation drift** is the gap between what documents claim and what is true in the authoritative sources those documents are supposed to reflect.

```text
Documented knowledge
        ≠
Authoritative reality (code, config, contract, runtime, control)
```

## Documentation Drift vs Domain Drift

| Kind | Meaning | Canonical doc |
| --- | --- | --- |
| **Documentation drift** | Docs wrong/missing relative to reality (general) | This document + [stale-documentation.md](stale-documentation.md) |
| **Architecture drift** | Documented architecture ≠ actual architecture | [architecture-drift.md](architecture-drift.md) |
| **Contract drift** | Documented contract ≠ actual interface | [contract-drift.md](contract-drift.md) |
| **Operational drift** | Ops docs ≠ actual operations | [operational-drift.md](operational-drift.md) |
| **Security drift** | Security docs ≠ actual security posture/controls | [security-drift.md](security-drift.md) |

Domain drift documents specialize detection and treatment. Documentation drift is the umbrella: any doc↔reality gap, including cross-cutting indexes, registries, and AI context pages.

## Relationship to Stale Documentation

[stale-documentation.md](stale-documentation.md) describes **signals and treatment** when docs look current but are not. Drift is the **structural mismatch** being signaled. Age alone does not prove drift.

## How to Treat

1. Classify impact (cosmetic vs operational/security).
2. Point to evidence.
3. Fix docs, or move to `REVIEW`, or register [documentation-debt.md](documentation-debt.md).
4. If the *system* is wrong relative to an accepted decision, also consider architecture/security/contract debt — not only doc edits.
5. Never “resolve” drift by writing a desired future state as Confirmed current.

## AI Rules

- When detecting possible drift, label claims Inferred/Unknown until verified.
- Link the matching domain drift doc when the mismatch is architectural, contractual, operational, or security-specific.
- Do not invent automation requirements for drift detection in this standard version.

## Related Documents

- [stale-documentation.md](stale-documentation.md)
- [architecture-drift.md](architecture-drift.md)
- [contract-drift.md](contract-drift.md)
- [operational-drift.md](operational-drift.md)
- [security-drift.md](security-drift.md)
- [documentation-freshness.md](documentation-freshness.md)
- [contradiction-model.md](contradiction-model.md)
