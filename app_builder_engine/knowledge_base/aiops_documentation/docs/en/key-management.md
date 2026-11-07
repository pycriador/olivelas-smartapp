# Key Management

> Language: EN | [Português (pt-BR)](../pt-BR/key-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Conceptual guidance for documenting **cryptographic key custody and lifecycle**.

## Hard Rule

**Never store real keys, key material, passphrases, or private certificates in documentation.** Refer by key name, purpose, or manager reference only.

## Purpose

Answer:

> Which keys exist (by name), what they protect, who can use or administer them, and how they are rotated or retired?

## Conceptual Lifecycle

```text
Generation → Storage → Distribution → Use → Rotation → Revocation → Retirement
```

| Stage | Document |
| --- | --- |
| **Generation** | Who/what may create keys; environment |
| **Storage** | Named key store or platform service — not the material |
| **Distribution** | How runtimes obtain use permission |
| **Use** | Encrypt/decrypt/sign/verify purposes; least privilege |
| **Rotation** | Cadence or event triggers — or **Not Defined** |
| **Revocation** | Compromise process — link [secret-exposure.md](secret-exposure.md) when applicable |
| **Retirement** | When a key name is decommissioned |

## Suggested Inventory

| Key name / id | Purpose | Protects | Store (name) | Users | Admins | Rotation | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | Not Defined if unknown | |

## Relationship to Secrets

Many keys are secrets. Use [secrets-management.md](secrets-management.md) for generic credential handling; use this document when cryptographic purpose and decrypt authority matter. Public keys may be documented more openly when they are intentionally public.

## Integration

| Area | Link |
| --- | --- |
| Encryption use | [encryption.md](encryption.md) |
| Privileged key admin | [privileged-access.md](privileged-access.md) |
| Authn that depends on keys | [authentication.md](authentication.md) |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Name keys that protect Confidential data + who administers |
| Medium | Lifecycle notes and rotation status |
| Large | Separate app keys vs platform keys; compromise path |

## Anti-Patterns

- Pasting PEM private keys “for the team.”
- Documenting key ceremony fiction that did not happen.
- Shared admin for all keys with no owner.
- Claiming HSM/KMS properties that are Unknown.

## Related Documents

- [encryption.md](encryption.md)
- [secrets-management.md](secrets-management.md)
- [secret-exposure.md](secret-exposure.md)
- [privileged-access.md](privileged-access.md)
- [security-controls.md](security-controls.md)
