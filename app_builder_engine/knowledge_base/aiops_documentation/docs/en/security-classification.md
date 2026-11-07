# Security Classification

> Language: EN | [Português (pt-BR)](../pt-BR/security-classification.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects label **information and assets by sensitivity** so handling rules can be consistent.

Classification is a **project-chosen model**. The labels below are a common **example**, not a mandatory taxonomy. If the project already uses another model (e.g. fewer tiers, domain-specific labels, or a company-wide scheme), document **that** model and map examples only when helpful.

Do not invent regulatory categories or certifications. Prefer **Not Defined** when the project has not chosen a scheme.

## Example Model (Optional)

| Label | Meaning (example) | Typical handling implications (example) |
| --- | --- | --- |
| **Public** | Intended for unrestricted disclosure | May appear in public docs and marketing |
| **Internal** | For people inside the organization under normal access | Default for most operational docs; not for public paste |
| **Confidential** | Limited audience; unauthorized disclosure causes material harm | Need-to-know; stricter access and logging |
| **Restricted** | Highest sensitivity within the project’s model | Tightest access, strongest controls, careful retention |

Projects may rename, merge, or split tiers. State the authoritative list once and reuse it in asset and data docs.

## What to Classify

| Subject | Guidance |
| --- | --- |
| Data at rest / in use | Primary use of classification — see [data-security.md](data-security.md) |
| Interfaces and payloads | Link fields/classes to contracts — see [contract-model.md](contract-model.md) |
| Documentation itself | Avoid putting Restricted content in broadly readable docs |
| Logs and traces | Derive from data class — see [secure-logging.md](secure-logging.md) |
| Secrets and keys | Treat as at least Confidential/Restricted by default; never store values |

## Suggested Recording Form

| Asset / data set | Classification | Owner | Handling summary | Retention | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | Not Defined if unknown | Confirmed / Inferred / Unknown |

## Relationship to Other Concepts

| Concept | Relationship |
| --- | --- |
| Asset catalog | Classification is a field on assets — [security-assets.md](security-assets.md) |
| Trust boundaries | Higher sensitivity often implies stronger crossing controls — [trust-boundaries.md](trust-boundaries.md) |
| Requirements | Classification drives confidentiality/privacy requirements — [security-requirements.md](security-requirements.md) |
| Certainty labels | Confirmed/Inferred/Unknown/Proposed are about *evidence quality*, not data sensitivity — [standards.md](standards.md) |

Do not confuse **information classification** (sensitivity) with **statement certainty** (Confirmed/Inferred/…).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Name the model (or “Not Defined”) and classify the most sensitive data the system touches |
| Medium | Inventory of data classes with owners |
| Large | Consistent labels across assets, contracts, logs, and retention docs |

## Anti-Patterns

- Using four example tiers without defining what they mean for *this* project.
- Marking everything Restricted to avoid thinking.
- Putting secret values or raw PII into docs “because the doc is Confidential.”
- Claiming a legal category without an authoritative source.

## Related Documents

- [security-model.md](security-model.md)
- [security-assets.md](security-assets.md)
- [data-security.md](data-security.md)
- [privacy.md](privacy.md)
- [data-retention.md](data-retention.md)
- [secure-logging.md](secure-logging.md)
- [standards.md](standards.md)
