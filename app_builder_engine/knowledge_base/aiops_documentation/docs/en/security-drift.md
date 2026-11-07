# Security Drift

> Language: EN | [Português (pt-BR)](../pt-BR/security-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

**Security drift** is the gap between documented security posture and how the system is actually protected, accessed, monitored, and evidenced.

```text
Documented Security
        ≠
Actual Security
```

Related concepts: [architecture-drift.md](architecture-drift.md), [contract-drift.md](contract-drift.md), [operational-drift.md](operational-drift.md), [stale-documentation.md](stale-documentation.md).

## Signals

| Signal | Example |
| --- | --- |
| Stale trust boundary | Docs omit a new public edge |
| Phantom control | Docs claim MFA / network policy; none configured |
| Privilege drift | Service account gained roles; docs still say least privilege |
| Secret source drift | Runtime pulls from a new store; docs name the old one |
| Expired exception | Exception past expiration still relied upon |
| Monitoring drift | Security alert removed; docs still claim detection |
| Evidence drift | Control “proven” by a review years stale |
| Contract security drift | API auth changed; contract Security section not updated |

## How to Register Drift

1. **Classify impact** — cosmetic vs enables false confidence / blocks incident response / misleads AI.
2. **Record** — lightweight item with evidence:

| Field | Meaning |
| --- | --- |
| **ID** | Optional (`SEC-DRIFT-003`) |
| **Documented** | What docs claim |
| **Actual** | What exists (with evidence) |
| **Impact** | Risk if left unfixed |
| **Owner** | Who reconciles |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

3. **Treat** — update docs, fix controls/process, open vulns/exceptions, or accept risk explicitly. Do not invent a “desired security model” as current state.

## Relationship to Debt

| Finding | Often becomes |
| --- | --- |
| Docs wrong, practice correct | Documentation debt |
| Practice unsafe / control missing | [security-debt.md](security-debt.md) |
| Both diverged | Both, with clear owners |
| Interface security rules wrong | [contract-debt.md](contract-debt.md) and/or security debt |

## What This Standard Does Not Do

No required continuous verification bot in this version. Detection remains human and change/incident/review-driven.

## Related Documents

- [security-debt.md](security-debt.md)
- [security-checklist.md](security-checklist.md)
- [security-evidence.md](security-evidence.md)
- [security-readiness.md](security-readiness.md)
- [security-exceptions.md](security-exceptions.md)
- [stale-documentation.md](stale-documentation.md)
