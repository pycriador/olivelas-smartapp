# AI Context Safety

> Language: EN | [Português (pt-BR)](../pt-BR/ai-context-safety.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Safety rules for documentation content used as AI context.

## Never Expose Secrets

Documentation and AI answers must **never** include:

- API keys, tokens, passwords, private keys
- Connection strings with embedded credentials
- Raw session cookies or bearer tokens
- Secret values from Vault/CI

Document only: secret **name**, purpose, store reference, rotation owner — per [secrets-management.md](secrets-management.md) and [secret-exposure.md](secret-exposure.md).

## Redaction Token

Use `[REDACTED]` when a value would otherwise appear:

```text
password=[REDACTED]
Authorization: Bearer [REDACTED]
```

Prefer omitting the field entirely when possible.

## Additional Safety

| Topic | Rule |
| --- | --- |
| PII | Avoid unnecessary CPF/CNPJ, bank data, personal documents in docs |
| Logs/examples | Mask sensitive fields |
| Security findings | Do not publish exploit PoCs in general docs |
| Prompts | Do not paste secrets into prompt context packs |

## AI Obligations

1. Refuse to echo secret values found in context; replace with `[REDACTED]` and warn.
2. Do not “helpfully” reconstruct likely passwords.
3. Treat accidental secret commits as security incidents — do not only edit the file.

## Related Documents

- [ai-task-boundaries.md](ai-task-boundaries.md)
- [secure-logging.md](secure-logging.md)
- [secret-exposure.md](secret-exposure.md)
