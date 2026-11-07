# Secrets Management

> Language: EN | [Português (pt-BR)](../pt-BR/secrets-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document the handling of **secrets** — credentials, API keys, private keys, tokens, passwords, and similar material.

## Hard Rule

**Never store secret values in documentation.** Not in Markdown, diagrams, examples, tickets pasted into docs, or screenshots.

Document at most:

- secret **name** or configuration key;
- **purpose**;
- **source** (e.g. environment variable, secret manager reference, vault path *name*);
- **rotation owner** and cadence if known;
- whether it is **required**.

Prefer placeholders such as `<API_KEY>` or `$API_KEY` in examples. See [standards.md](standards.md).

## What Counts as a Secret (Examples)

| Kind | Notes |
| --- | --- |
| Passwords, API keys, tokens | Always secrets |
| Private keys, client secrets | Always secrets |
| Connection strings with embedded credentials | Secrets — prefer separate credential references |
| Webhook signing secrets | Secrets |
| Encryption keys / key material | Secrets — see [key-management.md](key-management.md) |

Public identifiers, non-sensitive config flags, and public keys are usually not secrets; classify carefully.

## Suggested Inventory

| Name | Purpose | Source | Required | Rotation | Owner | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | | yes / no | Not Defined if unknown | | |

<!-- Never record secret values. -->

## Lifecycle Guidance

| Stage | Document |
| --- | --- |
| **Creation** | Who may create; where it is stored (system name) |
| **Distribution** | How runtimes obtain the secret (reference pattern) |
| **Use** | Which components may read it — [least-privilege.md](least-privilege.md) |
| **Rotation** | Cadence or event-driven triggers — or Not Defined |
| **Revocation** | How compromise is handled — link [secret-exposure.md](secret-exposure.md) |
| **Retirement** | When a name is removed from use |

## Integration

| Area | Link |
| --- | --- |
| Authn mechanisms that present secrets | [authentication.md](authentication.md) |
| Exposure response | [secret-exposure.md](secret-exposure.md) |
| Logging | [secure-logging.md](secure-logging.md) — secrets must not appear in logs |
| Contracts | Reference auth schemes without embedding credentials — [contract-model.md](contract-model.md) |
| Operations config | Name env vars / mounts; never values |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Inventory of required secret *names* + “never commit secrets” rule |
| Medium | Sources, owners, rotation notes |
| Large | Privileged access to secret stores; exposure run linkage |

## Anti-Patterns

- “Example” values that are real.
- Committing `.env` contents into docs.
- Documenting vault paths that include embedded tokens.
- Assuming a secret manager exists when the project still uses local files — document reality.

## Related Documents

- [secret-exposure.md](secret-exposure.md)
- [key-management.md](key-management.md)
- [secure-logging.md](secure-logging.md)
- [privileged-access.md](privileged-access.md)
- [security-requirements.md](security-requirements.md)
- [standards.md](standards.md)
