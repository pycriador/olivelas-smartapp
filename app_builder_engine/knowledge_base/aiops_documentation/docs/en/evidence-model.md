# Evidence Model

> Language: EN | [Português (pt-BR)](../pt-BR/evidence-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How claims are classified by evidence strength. Aligns with [standards.md](standards.md) Information Classification and extends it with **Deprecated** for claims that were once treated as current but no longer hold.

## Classifications

| Classification | Meaning | AI treatment |
| --- | --- | --- |
| **Confirmed** | Verified against an authoritative source | May state as current fact; cite evidence |
| **Inferred** | Deduced from evidence, not explicitly stated | State as inference; **never** treat as Confirmed |
| **Proposed** | Suggestion or future / desired state | Never present as current behavior |
| **Unknown** | Not identified; evidence missing | Do not invent; list as gap |
| **Deprecated** | Claim previously documented but withdrawn or superseded | Do not use as current SoT; point to replacement |

Token mapping for external tools that use uppercase enums:

| External token | This standard |
| --- | --- |
| `CONFIRMED` | Confirmed |
| `INFERRED` | Inferred |
| `UNKNOWN` | Unknown |
| `PROPOSED` | Proposed |
| `DEPRECATED` | Deprecated |

## Hard Rules

1. **Never treat Inferred as Confirmed.**
2. Default uncertain new content to **Unknown**, not Confirmed.
3. Never present **Proposed** as current state.
4. Prefer **Confirmed** for operational and security claims before document `ACCEPTED`.
5. **Deprecated** claims remain in history with pointers; do not silently delete without [history-model.md](history-model.md) guidance.
6. Classification ≠ lifecycle status ≠ confidence ([confidence-model.md](confidence-model.md)).

## Inline Forms

```markdown
- Retry limit is 3. <!-- Classification: Confirmed -->
- Ordering appears FIFO per partition. <!-- Classification: Inferred -->
- Multi-region failover: Unknown.
- Move to event sourcing. <!-- Classification: Proposed -->
- Legacy sync webhook path. <!-- Classification: Deprecated -->
```

Section-level:

```markdown
## Failure Handling

Classification: Inferred
```

## Relationship to Security / Ops Evidence

Domain evidence practices remain valid:

- [security-evidence.md](security-evidence.md)
- Incident timeline tags in [incident-timeline.md](incident-timeline.md)

## Related Documents

- [claims.md](claims.md)
- [evidence-references.md](evidence-references.md)
- [ai-answering-rules.md](ai-answering-rules.md)
- [standards.md](standards.md)
