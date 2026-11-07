---
title: "Security Asset: AST-001 catalog pricing tiers (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
asset_id: "AST-001"
---

# Security Asset: AST-001 catalog pricing tiers

> Language: EN | [Português (pt-BR)](../pt-BR/asset.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Asset ID: AST-001
>
> **Fictional example — not a real project.**

## Summary

Internal pricing-tier labels and relative rank values used by catalog-service for browse and admin preview. Not public marketing copy.

## Identity

| Field | Value |
| --- | --- |
| Asset ID | AST-001 |
| Name | Catalog pricing tiers |
| Type | data |
| Owner | example-team |
| Classification | Internal |

## Description

| Field | Value |
| --- | --- |
| Why it matters | Disclosure of tier ranks could reveal commercial strategy before public release |
| Where it lives | catalog-service datastore (logical name: catalog-store); admin preview cache |
| Related components | catalog-api, catalog-admin-api, edge-gateway |
| Related data flows | Admin write → catalog-store; Public read returns only Public fields |

## Threats and Controls

| Linked threat | Linked risk | Linked controls |
| --- | --- | --- |
| THR-001 | RISK-001 | CTRL-001 |

## Evidence and Monitoring

| Field | Value |
| --- | --- |
| Detection / monitoring | Access denials on admin routes; anomalous bulk read volume on public edge |
| Evidence refs | Config name: `CATALOG_ADMIN_AUTH_MODE` (source: secret store — value not documented) |
| Classification of claims | Confirmed (example) |

## Related Documentation

| Document | Path |
| --- | --- |
| Threat | ../threat/ |
| Risk | ../risk/ |
| Control | ../control/ |
