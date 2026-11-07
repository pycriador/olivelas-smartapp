# Contract Change Management

> Language: EN | [Português (pt-BR)](../pt-BR/contract-change-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to evaluate a proposed change to a technical contract before it lands.

Any material contract change should evaluate these **nine points**:

## Nine Evaluation Points

| # | Point | Question |
| --- | --- | --- |
| 1 | **Existing consumers** | Who consumes today? What assumptions do they encode? |
| 2 | **Existing producers** | Who produces today? Can they emit/accept the new shape? |
| 3 | **Compatibility** | Backward / forward / breaking? ([contract-compatibility.md](contract-compatibility.md)) |
| 4 | **Impact** | Blast radius: runtime failure, silent semantic drift, ops load |
| 5 | **Versioning** | Same version, minor bump, or new major/contract id? ([contract-versioning.md](contract-versioning.md)) |
| 6 | **Migration** | How do participants move? Dual-run? Feature flag? Cutover date? |
| 7 | **Documentation** | Contract doc, architecture links, runbooks, examples updated? |
| 8 | **Tests** | Producer/consumer/schema/compatibility checks updated? ([contract-testing.md](contract-testing.md)) |
| 9 | **Deprecation** | Is the old behavior deprecated with a window and `replaced_by`? |

Skip a point only when clearly Not Applicable — and say why.

## Lightweight Process

1. Describe the intended change and classify it (additive / removal / semantic / …).
2. Walk the nine points; record Unknowns.
3. Involve owners per [contract-ownership.md](contract-ownership.md).
4. Apply lifecycle: material `ACCEPTED` contracts go `ACCEPTED → REVIEW → ACCEPTED` ([contract-lifecycle.md](contract-lifecycle.md)).
5. For breaking changes, follow [breaking-changes.md](breaking-changes.md).

## What Change Management Is Not

- Not a mandatory heavyweight CAB for every typo.
- Not a substitute for honest classification of Unknown impact.
- Not permission to change the contract silently in code without updating the canonical doc.

## Related Documents

- [breaking-changes.md](breaking-changes.md)
- [contract-compatibility.md](contract-compatibility.md)
- [contract-versioning.md](contract-versioning.md)
- [change-policy.md](change-policy.md)
- [contract-ownership.md](contract-ownership.md)
