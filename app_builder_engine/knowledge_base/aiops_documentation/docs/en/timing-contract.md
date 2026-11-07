# Timing Contract

> Language: EN | [Português (pt-BR)](../pt-BR/timing-contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document time-related expectations on a contract boundary. Distinguish three different concepts that are often conflated.

## Three Distinct Concepts

| Concept | Meaning |
| --- | --- |
| **Timeout** | Maximum time a party waits for a response or acknowledgement before aborting the wait |
| **Business deadline** | Time by which a business outcome must be achieved (SLA, regulatory, user promise) |
| **Processing duration** | How long the work typically or maximally takes to execute |

```text
Timeout              ≠   Business Deadline   ≠   Processing Duration
(wait limit)             (outcome due)           (work length)
```

A short processing duration can still miss a business deadline if the work starts late. A timeout can fire while processing continues asynchronously.

## What to Document When Applicable

| Topic | Guidance |
| --- | --- |
| Client / consumer timeout | How long the caller waits |
| Provider / producer timeout | Server-side or worker wait limits |
| Expected latency | Typical or p-level latency if known; mark Unknown otherwise |
| Business deadline | External due time and what "late" means |
| Processing duration | Expected/max processing time |
| Asynchronous completion | How completion is signaled |
| Polling | Interval, backoff, stop conditions |
| Callback | When and how callback is expected; timeout on callback channel |
| Expiry | When tokens, offers, reservations, or messages expire |

## Suggested Table

| Timing aspect | Value | Classification |
| --- | --- | --- |
| Consumer timeout | … | |
| Provider timeout | … | |
| Expected latency | … | |
| Business deadline | … | |
| Processing duration | … | |
| Polling / callback / expiry | … | |
| Not Applicable | … | |

## Guidance

- Do not invent numeric timeouts without evidence.
- Relate timeouts to [retry-policy.md](retry-policy.md) (retrying after timeout may duplicate work).
- For async contracts, document how the consumer learns success/failure after the initial accept.

## Related Documents

- [retry-policy.md](retry-policy.md)
- [delivery-semantics.md](delivery-semantics.md)
- [idempotency.md](idempotency.md)
- [api-contracts.md](api-contracts.md)
