# Privacy

> Language: EN | [Português (pt-BR)](../pt-BR/privacy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **privacy-relevant handling of personal or sensitive data** without assuming a specific law, regulation, or certification.

This standard does **not** declare GDPR, LGPD, CCPA, or any other regime as applicable. If the project has binding privacy obligations, document them from an authoritative internal source and link that source — do not invent legal analysis here.

## Purpose

Answer, in engineering terms:

> What personal or sensitive data do we handle, for what purpose, who can access it, and what privacy-related controls exist?

## What to Document

| Topic | Guidance |
| --- | --- |
| **Data categories** | Types of personal/sensitive data — link [security-classification.md](security-classification.md), [security-assets.md](security-assets.md) |
| **Purposes** | Why the system processes them (product/engineering purpose, not legal basis unless provided) |
| **Access** | Who/what may access — [authorization.md](authorization.md), [least-privilege.md](least-privilege.md) |
| **Sharing** | Downstream systems and processors at the boundary |
| **Retention / deletion** | [data-retention.md](data-retention.md) — **Not Defined** when unknown |
| **Transparency to users** | Only if the project owns user-facing notices — else Not Applicable |
| **Privacy contacts** | Role/team if defined — else Not Defined |

## Suggested Inventory

| Data category | Purpose | Access | Sharing | Retention | Controls | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Relationship to Security and Contracts

| Concern | Link |
| --- | --- |
| Lifecycle protection | [data-security.md](data-security.md) |
| Field-level exposure on interfaces | [contract-model.md](contract-model.md) |
| Logs and traces | [secure-logging.md](secure-logging.md) |
| Encryption | [encryption.md](encryption.md) |

Privacy and security overlap but are not identical: a system can encrypt data and still process it for unexpected purposes. Document both purpose and protection.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | List personal data categories (or “none identified”) + access summary |
| Medium | Sharing and retention pointers |
| Large | Purpose inventory + control links; explicit Not Defined legal topics |

## Anti-Patterns

- Pasting legal articles as if they were project requirements.
- Claiming certification or compliance not established by the project.
- Embedding real personal data in examples.
- Silent analytics pipelines that copy personal data without appearing in the inventory.

## Related Documents

- [data-security.md](data-security.md)
- [data-retention.md](data-retention.md)
- [security-classification.md](security-classification.md)
- [secure-logging.md](secure-logging.md)
- [security-ownership.md](security-ownership.md)
