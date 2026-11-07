# Contract Security

> Language: EN | [Português (pt-BR)](../pt-BR/contract-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **security expectations at technical contract boundaries** — without duplicating schemas, error catalogs, or full contract prose.

Canonical interface rules live in contract documents ([contract-model.md](contract-model.md), [contracts/README.md](contracts/README.md)). This methodology defines what security topics belong on those contracts and how security docs should cross-reference them.

## Topics to Cover (When Applicable)

| Topic | Question | Notes |
| --- | --- | --- |
| **Authentication** | How is the caller/principal established? | Mechanism summary; no assumed OAuth/JWT |
| **Authorization** | What is the principal allowed to do via this contract? | Link roles/policies; mark Unknown if unclear |
| **Sensitive data** | Which fields/classes are sensitive? | Classification; never sample real secrets/PII |
| **Encryption** | What is protected in transit / at rest for this interface? | Or **Not Defined** / N/A |
| **Validation** | What input/output validation is required for safety? | Link schema validation — do not paste full schemas |
| **Abuse considerations** | How can the interface be misused? | Threat notes at the boundary |
| **Rate limits / quotas** | Are abuse or capacity limits part of the contract? | Document only if Defined; else Unknown / N/A |

Mark sections **Not Applicable** when the contract type does not need them. Do not assume HTTP.

## Cross-Reference Rules

| Do | Do not |
| --- | --- |
| Put authn/authz/sensitive-field rules on the **canonical contract** | Copy the entire contract into security docs |
| Link contracts from [security-architecture.md](security-architecture.md) and threat models | Invent endpoints, tokens, or permissions |
| Align abuse/rate-limit notes with [timing-contract.md](timing-contract.md) / capacity when relevant | Invent rate limits to look “complete” |
| Classify claims Confirmed / Inferred / Unknown / Proposed | Present Proposed security rules as current |

## Contract Doc Placement

Prefer a **Security** (or equivalent) section on [templates/contract.md](templates/contract.md). Deep identity design stays in [identity.md](identity.md) / [authentication.md](authentication.md) / [authorization.md](authorization.md) with links from the contract.

## Relationship to Testing and Incidents

| Concern | Link |
| --- | --- |
| Verify authz behavior | [security-testing.md](security-testing.md) |
| Boundary abuse in production | [security-monitoring.md](security-monitoring.md), [security-incidents.md](security-incidents.md) |
| Missing security rules on a live boundary | [contract-debt.md](contract-debt.md) and/or [security-debt.md](security-debt.md) |

## Related Documents

- [contract-model.md](contract-model.md)
- [api-contracts.md](api-contracts.md)
- [event-contracts.md](event-contracts.md)
- [message-contracts.md](message-contracts.md)
- [file-contracts.md](file-contracts.md)
- [security-requirements.md](security-requirements.md)
- [data-security.md](data-security.md)
- [encryption.md](encryption.md)
