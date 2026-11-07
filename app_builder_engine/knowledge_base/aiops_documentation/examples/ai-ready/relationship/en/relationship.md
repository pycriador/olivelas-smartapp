---
title: "Relationship: ARCH-NB-001 documents CONTRACT-NB-EVT-001 (Fictional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "REL-NB-001"
type: "Reference"
---

# Document Relationship

> Language: EN | [Português (pt-BR)](../pt-BR/relationship.md)
>
> **Fictional example — not a real project.**

## ID

| Field | Value |
| --- | --- |
| Relationship ID | REL-NB-001 |
| Status | Active |

## Endpoints

| Role | Document ID | Path / title |
| --- | --- | --- |
| From | ARCH-NB-001 | Notify-Bridge Architecture Overview |
| To | CONTRACT-NB-EVT-001 | CatalogItemUpdated event contract (fictional) |

## Relationship

| Field | Value |
| --- | --- |
| Type | documents |
| Direction | Directed |
| Strength | Required |
| Classification | Confirmed |

## Rationale

Architecture overview states that notify-bridge consumes `CatalogItemUpdated` as defined by CONTRACT-NB-EVT-001. The link is explicit so AI navigation does not rely on prose alone.

## Impact Notes

| Change on From | Expected effect on To |
| --- | --- |
| Remove event consumer description | Review whether contract still has a documented consumer |
| Change retry / DLQ behavior | May need ops docs; contract schema unchanged unless payload changes |

## Related Documents

| Document | Path |
| --- | --- |
| Claim (retries) | ../claim/ |
| Component | ../component/ |
