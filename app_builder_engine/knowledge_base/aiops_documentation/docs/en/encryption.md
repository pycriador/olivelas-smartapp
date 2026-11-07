# Encryption

> Language: EN | [Português (pt-BR)](../pt-BR/encryption.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **encryption** protections in a technology-agnostic way.

Focus on *what is protected*, *in which state*, and *where keys come from* (by reference). Do not paste key material, certificates’ private parts, or passphrases. Algorithm details are optional and only when Confirmed.

## Protection States

| State | Meaning | Document |
| --- | --- | --- |
| **In transit** | Data moving between parties | Channels, trust boundaries, whether encryption is required |
| **At rest** | Data in durable stores | Which stores encrypt, who manages keys |
| **Application-level** | Encryption enforced by the application beyond platform defaults | What fields/payloads; who can decrypt |

Platform defaults may satisfy transit/rest requirements; say so when Confirmed. Mark **Unknown** when not verified. Mark **Not Applicable** when a state does not apply.

## Suggested Record

| Field | Meaning |
| --- | --- |
| **Data / channel** | What is protected |
| **State** | Transit / rest / application-level |
| **Mechanism summary** | Conceptual (e.g. “TLS on external edge”) — avoid unverified cipher claims |
| **Key reference** | Link [key-management.md](key-management.md) by key *name/purpose* |
| **Who can decrypt** | Identities / roles |
| **Certainty** | Confirmed / Inferred / Unknown / Not Applicable |

## Suggested Inventory

| Data / channel | Transit | Rest | Application-level | Key reference | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Integration

| Area | Link |
| --- | --- |
| Trust boundary crossings | [trust-boundaries.md](trust-boundaries.md) |
| Data lifecycle | [data-security.md](data-security.md) |
| Key custody | [key-management.md](key-management.md) |
| Contracts | Note if payload is encrypted at application level vs transport only |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Transit for Exposed edges; rest for primary store (or Unknown) |
| Medium | Inventory for Confidential/Restricted data |
| Large | Application-level field encryption and decrypt authority |

## Anti-Patterns

- Claiming “everything is encrypted” without stores/channels listed.
- Publishing private keys or sample JWTs that contain secrets.
- Specifying algorithms from marketing pages without Confirmed evidence.
- Treating encryption as a substitute for authorization.

## Related Documents

- [key-management.md](key-management.md)
- [data-security.md](data-security.md)
- [secrets-management.md](secrets-management.md)
- [security-controls.md](security-controls.md)
- [trust-boundaries.md](trust-boundaries.md)
