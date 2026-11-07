# Secure Logging

> Language: EN | [Português (pt-BR)](../pt-BR/secure-logging.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **logging and diagnostic output** so that observability does not become a secret or privacy leak.

Integrates with [observability-model.md](observability-model.md) and [monitoring.md](monitoring.md). Security docs state constraints; ops docs describe signals and tooling.

## Hard Rules

1. **Do not log secret values** (passwords, tokens, API keys, private keys, raw session secrets).
2. **Do not log unnecessary PII or sensitive personal data.** Prefer identifiers that are already public to the authorized operator, redaction, hashing, or omission.
3. **Do not paste production log lines that contain secrets or PII into documentation.**

When in doubt, omit. Mark redaction behavior **Unknown** if not verified.

## What to Document

| Topic | Guidance |
| --- | --- |
| **Allowed fields** | Safe operational fields for diagnosis |
| **Forbidden / redacted fields** | Secrets, payment data, credentials, sensitive attributes |
| **Correlation ids** | Prefer stable request/trace ids over personal keys |
| **Access to logs** | Who may read — [authorization.md](authorization.md), [least-privilege.md](least-privilege.md) |
| **Retention** | Log retention — or **Not Defined** — [data-retention.md](data-retention.md) |
| **Security-relevant events** | What must be logged for [auditability.md](auditability.md) |

## Suggested Inventory

| Event / log class | Purpose | Allowed fields | Redacted / forbidden | Retention | Access | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Relationship to Auth and Incidents

| Concern | Link |
| --- | --- |
| Authn failures / privilege use | [authentication.md](authentication.md), [privileged-access.md](privileged-access.md) |
| Secret exposure via logs | [secret-exposure.md](secret-exposure.md) |
| Incident evidence | [incident-timeline.md](incident-timeline.md) — still no secrets/PII in durable docs |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Explicit “no secrets/PII in logs” rule + main redaction notes |
| Medium | Inventory for auth and data-access events |
| Large | Retention, access control to log stores, cross-system correlation rules |

## Anti-Patterns

- Logging full request bodies “for debugging” on Confidential APIs.
- Trace attributes that carry tokens.
- Documenting sample log lines from production with real emails, CPF/CNPJ, or credentials.
- Equating “we have logs” with auditability without attributable events.

## Related Documents

- [auditability.md](auditability.md)
- [observability-model.md](observability-model.md)
- [privacy.md](privacy.md)
- [secrets-management.md](secrets-management.md)
- [data-retention.md](data-retention.md)
- [standards.md](standards.md)
