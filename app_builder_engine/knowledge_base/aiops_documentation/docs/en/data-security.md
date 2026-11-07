# Data Security

> Language: EN | [Português (pt-BR)](../pt-BR/data-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document protection of data across its lifecycle.

Data security ties [security-classification.md](security-classification.md) and [security-assets.md](security-assets.md) to controls for confidentiality, integrity, and appropriate access. Link field-level rules to [contracts](contract-model.md) instead of duplicating schemas.

## Lifecycle Chain

```text
Collection → Processing → Storage → Transfer → Sharing → Retention → Deletion
```

| Stage | Question | Typical links |
| --- | --- | --- |
| **Collection** | What enters the system, from whom? | Contracts, attack surface, privacy |
| **Processing** | Who/what may transform it? | Authorization, least privilege |
| **Storage** | Where does it rest, at what class? | Encryption at rest, assets |
| **Transfer** | How does it move? | Encryption in transit, trust boundaries |
| **Sharing** | Who outside the component receives it? | Contracts, third parties |
| **Retention** | How long is it kept? | [data-retention.md](data-retention.md) — **Not Defined** when unknown |
| **Deletion** | How is it removed or made unavailable? | Retention, corrective controls |

Stages may be Not Applicable (e.g. ephemeral processors with no storage).

## Suggested Data Set Record

| Field | Meaning |
| --- | --- |
| **Data set** | Name / asset id |
| **Classification** | Per project model |
| **Owner** | Data owner |
| **Collection sources** | Interfaces / contracts |
| **Stores** | Named systems |
| **Transfers / shares** | Boundaries and consumers |
| **Controls summary** | Authz, encryption, masking — links |
| **Retention** | Link or Not Defined |
| **Deletion** | Method summary or Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Suggested Inventory

| Data set | Classification | Owner | Stores | Transfers | Retention | Deletion | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Contract Integration

| Concern | Prefer |
| --- | --- |
| Sensitive fields on the wire | Canonical contract + classification note |
| Authn/authz to access data APIs | Contract + [authentication.md](authentication.md) / [authorization.md](authorization.md) |
| Error payloads leaking data | Contract error rules + [secure-logging.md](secure-logging.md) |

## Architecture Integration

Follow data across [trust-boundaries.md](trust-boundaries.md) and component diagrams without pasting raw personal samples. Prefer categories and field names.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Main data classes, where stored, who can read/write |
| Medium | Lifecycle notes + contract links for sensitive interfaces |
| Large | Full inventory with retention/deletion and third-party shares |

## Anti-Patterns

- Embedding real PII or production payloads in examples.
- Claiming retention/deletion that is Not Defined as if Confirmed.
- Ignoring analytics replicas and backups as stores.
- Inventing legal bases or regulatory labels.

## Related Documents

- [security-classification.md](security-classification.md)
- [privacy.md](privacy.md)
- [data-retention.md](data-retention.md)
- [encryption.md](encryption.md)
- [contract-model.md](contract-model.md)
- [trust-boundaries.md](trust-boundaries.md)
