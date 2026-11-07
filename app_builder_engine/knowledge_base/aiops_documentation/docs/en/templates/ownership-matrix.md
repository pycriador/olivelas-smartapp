# Ownership Matrix

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/ownership-matrix.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Optional inventory of documentation ownership across a project.

Per-document `owner` in YAML metadata remains the source of truth. This matrix is a convenience view for teams and periodic review planning.

Copy into the adopting project (for example `docs/ownership-matrix.md`) and fill rows.

## Matrix

| Document | Owner | Reviewer | Approver | Review Cycle |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |
| | | | | |

### Field guidance

| Column | Guidance |
| --- | --- |
| Document | Path or stable title |
| Owner | Team, squad, or role (required for governed docs) |
| Reviewer | Optional; who usually reviews |
| Approver | Optional; used only if the team has a formal approval step |
| Review Cycle | Optional; change-driven by default. Record a periodic cycle only when useful (no universal frequency) |

## Notes

- Prefer durable team/role names over individuals in **Owner**.
- Leave **Review Cycle** blank when review is purely change-driven.
- Update this matrix when ownership transfers ([ownership.md](../ownership.md)).

## Related Documents

- [../ownership.md](../ownership.md)
- [../review-policy.md](../review-policy.md)
- [../lifecycle.md](../lifecycle.md)
