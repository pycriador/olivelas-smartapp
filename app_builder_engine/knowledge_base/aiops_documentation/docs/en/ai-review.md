# AI Review

> Language: EN | [Português (pt-BR)](../pt-BR/ai-review.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How humans (and AI assistants aiding review) evaluate AI-produced documentation.

## Review Goals

- Accuracy against SoT
- Correct classifications
- Safe handling of secrets
- Graph/link integrity
- Appropriate status and ownership
- No scope invention

## Review Checklist

| Check | Fail if |
| --- | --- |
| Evidence | Confirmed without citation |
| Classification | Inferred shown as fact |
| Status | AI set ACCEPTED |
| Secrets | Values or sensitive dumps present |
| Drift | Known mismatches ignored |
| Links | Broken or vague references |
| Completeness | Required sections removed to hide gaps |
| Language | Machine tokens translated |
| Impact | Dependent docs not listed |

## Outcomes

| Outcome | Action |
| --- | --- |
| Approve | Human moves status per lifecycle |
| Request changes | Return to DRAFT with comments |
| Reject | Do not merge; keep debt/gap notes |
| Escalate | Security/ops/contract owners |

## Related Documents

- [review-policy.md](review-policy.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
- [quality-model.md](quality-model.md)
