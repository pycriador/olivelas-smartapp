---
title: "Claim"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "CLAIM-XXX"
type: "Evidence"
---

# Claim

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/claim.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Record a single technical assertion with evidence and classification. Prefer one claim per record when the statement is material for AI or review.

Policy: [claims.md](../claims.md), [evidence-model.md](../evidence-model.md).

## ID

| Field | Value |
| --- | --- |
| Claim ID | CLAIM-XXX |
| Document / scope | <!-- parent doc id or path --> |
| Owner | |

## Statement

<!-- One precise assertion. Current state only unless Classification is Proposed. -->

## Classification

| Field | Value |
| --- | --- |
| Classification | Confirmed / Inferred / Unknown / Proposed / Deprecated |
| Confidence | High / Medium / Low / Unknown |
| Authority of sources | Authoritative / Verified / Informational / Reference / Historical / Draft / Unknown |

<!-- Never treat Inferred as Confirmed. Deprecated means the claim is no longer current. -->

## Evidence

| Source | Kind | Path / ID | Notes |
| --- | --- | --- |
| | code / config / test / contract / ADR / runtime / doc / other | | |

## Scope

| Field | Value |
| --- | --- |
| System / component | |
| Applies when | |
| Does not apply when | |
| Time scope | Current / Historical / Unknown |

## Related

| Relation | Target ID / path |
| --- | --- |
| supports / contradicts / depends_on / supersedes / related_to | |

## Notes

<!-- Gaps, alternative interpretations, follow-ups. Do not invent facts. -->
