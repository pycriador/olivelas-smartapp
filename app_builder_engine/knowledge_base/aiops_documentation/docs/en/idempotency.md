# Idempotency

> Language: EN | [Português (pt-BR)](../pt-BR/idempotency.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document whether repeating an operation under a contract is safe and what "safe" means for this boundary.

Do **not** assume every operation is idempotent. Do **not** invent an idempotency key when none exists.

## Questions the Contract Must Answer

| Question | Why it matters |
| --- | --- |
| Is the operation idempotent? | yes / no / partial / Unknown |
| What identifier guarantees idempotency? | Key, natural key, request hash, none |
| For how long? | Retention window of the idempotency record |
| What happens on duplicates? | Same success result, conflict, ignored, Unknown |
| How should the consumer handle reprocessing? | Safe retry steps, dedupe expectations |

## Documentation Form

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes / no / partial / Unknown | |
| Idempotency key / strategy | … | |
| Retention window | … | |
| Duplicate behavior | … | |
| Consumer guidance | … | |

## When Guarantees Are Unknown

If the team cannot confirm idempotency from evidence (code, tests, platform behavior), document:

> **Idempotency not guaranteed.**

Do not imply safety via vague wording ("should be fine to retry"). Pair with [retry-policy.md](retry-policy.md): if idempotency is not guaranteed, retries may create duplicate side effects — say so.

## Partial Idempotency

Some operations are idempotent for a subset of outcomes (for example create-or-return on unique key, but not for "append" effects). Document the partial case explicitly rather than a blanket "yes".

## Related Documents

- [retry-policy.md](retry-policy.md)
- [delivery-semantics.md](delivery-semantics.md)
- [contract-validation.md](contract-validation.md)
- [message-contracts.md](message-contracts.md)
