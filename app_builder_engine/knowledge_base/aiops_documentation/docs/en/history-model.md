# History Model

> Language: EN | [Português (pt-BR)](../pt-BR/history-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How documentation represents time and succession.

## States

| State | Meaning |
| --- | --- |
| **Current** | Describes the system as it is now; eligible as SoT when ACCEPTED/Authoritative |
| **Historical** | True for a past period; not current SoT |
| **Deprecated** | No longer recommended; replacement identified or explicitly absent |
| **Superseded** | Replaced by a specific successor document/decision |

Lifecycle tokens `DEPRECATED` / `ARCHIVED` often align with Deprecated/Historical document states ([deprecation.md](deprecation.md), [archive-policy.md](archive-policy.md)).

## Rules

1. Label time scope when mixing Current and Historical claims.
2. Superseded docs keep stable ids; use `replaced_by` / `supersedes` relationships.
3. Historical Confirmed claims stay Confirmed *for that time* — do not rewrite history silently.
4. AI must not use Deprecated/Superseded as current behavior unless asked for history.

## Related Documents

- [lifecycle.md](lifecycle.md)
- [authority-levels.md](authority-levels.md)
- [document-relationships.md](document-relationships.md)
