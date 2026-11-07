# Identity

> Language: EN | [Português (pt-BR)](../pt-BR/identity.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **identities** and keep **authentication** distinct from **authorization**.

## Core Distinction

| Concept | Question | Concern |
| --- | --- | --- |
| **Authentication** | Who are you? (or: which identity is this?) | Establishing and verifying an identity |
| **Authorization** | What are you allowed to do? | Permitting or denying actions on resources |

Never document “auth” as a single blob that mixes both. If a mechanism does both, describe each concern separately — see [authentication.md](authentication.md) and [authorization.md](authorization.md).

## Identity Types (Examples)

| Type | Meaning |
| --- | --- |
| **Human user** | Person interacting with the system |
| **Service / workload identity** | Non-human runtime identity |
| **Operator / admin identity** | Privileged human or break-glass path |
| **Pipeline / automation identity** | CI/CD or job identity that can change systems |
| **External client identity** | Partner or third-party client |

Use project names. Mark **Not Applicable** when a type does not exist.

## What to Document

| Topic | Guidance |
| --- | --- |
| Identity sources | Where identities come from (directory, issuer, local store) — by name, not secrets |
| Lifecycle | Join / move / leave / revoke expectations when known |
| Mapping to authn | How an identity is proven at each entry — [authentication.md](authentication.md) |
| Mapping to authz | How identity attributes/roles/permissions are decided — [authorization.md](authorization.md) |
| Privilege | Elevated identities — [privileged-access.md](privileged-access.md), [least-privilege.md](least-privilege.md) |
| Contracts | Which identity is required on an interface — [contract-model.md](contract-model.md) |

## Suggested Inventory

| Identity type | Used where | Authn mechanism (summary) | Authz model (summary) | Owner | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Trust Boundaries

Identity strength often changes at [trust-boundaries.md](trust-boundaries.md). Document when an inner zone trusts an outer proof, and what controls re-validate or re-authorize on crossing.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Human vs service identities; clear authn vs authz for the main API |
| Medium | Operator and pipeline identities included |
| Large | Lifecycle, revocation, and contract-level identity requirements |

## Anti-Patterns

- Treating network location as identity without stating the assumption.
- “Authenticated users can do everything” with no authorization doc.
- Sharing a single long-lived identity across many unrelated workloads without noting risk.
- Storing credentials or personal data samples in identity docs.

## Related Documents

- [authentication.md](authentication.md)
- [authorization.md](authorization.md)
- [least-privilege.md](least-privilege.md)
- [privileged-access.md](privileged-access.md)
- [security-requirements.md](security-requirements.md)
- [trust-boundaries.md](trust-boundaries.md)
