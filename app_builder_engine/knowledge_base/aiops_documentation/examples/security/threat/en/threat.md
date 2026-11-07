---
title: "Threat: THR-001 bulk catalog enumeration (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
threat_id: "THR-001"
---

# Threat: THR-001 bulk catalog enumeration

> Language: EN | [Português (pt-BR)](../pt-BR/threat.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Threat ID: THR-001
>
> **Fictional example — not a real project.**

## Summary

An external actor scripts high-volume lookups against the public catalog edge to infer Internal pricing-tier patterns from response shapes or timing.

## Identity

| Field | Value |
| --- | --- |
| Threat ID | THR-001 |
| Name | Bulk catalog enumeration via public edge |
| Actor category | external |
| Status | Mitigated |

## Target

| Field | Value |
| --- | --- |
| Asset(s) affected | AST-001 |
| Trust boundary / surface | Public Internet → edge-gateway → catalog-api (Exposed) |
| Entry path | Public catalog lookup interface (generic path name: `/v1/catalog/items`) |

## Scenario

| Field | Value |
| --- | --- |
| How it could occur | Automated clients issue many distinct lookup requests and correlate responses |
| Preconditions | Public read path reachable; rate limits weak or absent; Internal fields leak into Public responses |
| Impact if realized | Inference of Internal pricing strategy; possible abuse of capacity |
| Classification | Inferred (example) |

## Risk and Mitigation

| Field | Value |
| --- | --- |
| Linked risk | RISK-001 |
| Linked requirements | REQ-SEC-001 (admin writes); public-read rate policy (example) |
| Linked controls | CTRL-001; edge rate limiting (name: `EDGE_LOOKUP_RATE_LIMIT`) |
| Residual notes | Public browse remains open by design; residual inference risk Accepted Risk for Public fields only |

## Related Documentation

| Document | Path |
| --- | --- |
| Asset | ../asset/ |
| Risk | ../risk/ |
| Control | ../control/ |
| Incident | ../incident/ |
