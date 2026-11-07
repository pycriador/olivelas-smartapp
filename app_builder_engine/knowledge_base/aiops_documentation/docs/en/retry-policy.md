# Retry Policy

> Language: EN | [Português (pt-BR)](../pt-BR/retry-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document retry behavior for a contract. This standard does **not** prescribe a single retry strategy. The contract must record the strategy **actually adopted** (or mark Unknown / Not Applicable).

## What to Document

| Topic | Question |
| --- | --- |
| Allowed | Is retry permitted for this interaction? |
| When to retry | Which failures are retryable? |
| When not to retry | Which failures must not be retried? |
| Count | Maximum attempts (including or excluding the first — state which) |
| Backoff | Fixed, linear, exponential, jitter — as actually used |
| Limit | Time budget, max delay, circuit breakers if any |
| After failure | What happens when retries are exhausted? |

## When Retry Is Appropriate

Typically for **transient** failures: temporary unavailability, timeouts that are known to be safe to repeat, overloaded dependencies that recover.

Retry only when:

- the failure is classified as retryable in the contract; and
- the operation's [idempotency](idempotency.md) story is understood (or the risk of duplicate side effects is accepted and documented).

## When Not to Retry

Do not retry (or document "must not retry") for:

- permanent validation / malformed input errors;
- authorization failures that will not change without a new credential or grant;
- business rule rejections that are not transient;
- unknown errors when duplicate side effects are harmful and idempotency is not guaranteed.

If unsure, write **Unknown** and avoid claiming a safe retry policy.

## Suggested Documentation Table

| Topic | Value | Classification |
| --- | --- | --- |
| Retry allowed | yes / no / conditional | |
| Retryable conditions | … | |
| Non-retryable conditions | … | |
| Max attempts | … | |
| Backoff | … | |
| Exhaustion behavior | fail / dead-letter / alert / … | |
| Not Applicable | reason if N/A | |

## Coordination with Other Contract Aspects

- **Idempotency** — retries amplify duplicates; document both together.
- **Timeouts** — [timing-contract.md](timing-contract.md); retries interact with client and server time budgets.
- **Delivery semantics** — at-least-once systems often imply consumer-side retry or redelivery.
- **Errors** — each error should state retryability when consumers need it.

## Related Documents

- [idempotency.md](idempotency.md)
- [timing-contract.md](timing-contract.md)
- [delivery-semantics.md](delivery-semantics.md)
- [contract-model.md](contract-model.md)
