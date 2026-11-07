---
title: "Security Risk: RISK-001 pricing-tier exposure (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
risk_id: "RISK-001"
---

# Security Risk: RISK-001 pricing-tier exposure

> Language: EN | [Português (pt-BR)](../pt-BR/risk.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Risk ID: RISK-001
>
> **Fictional example — not a real project.**

## Summary

THR-001 acting on AST-001 may expose Internal pricing-tier ranks through response leakage or admin-path bypass.

## Identity

| Field | Value |
| --- | --- |
| Risk ID | RISK-001 |
| Name | Exposure of Internal catalog pricing tiers |
| Status | Mitigating |
| Owner | example-team |

## Factors

| Field | Value |
| --- | --- |
| Linked asset(s) | AST-001 |
| Linked threat(s) | THR-001 |
| Linked vulnerability | VULN-001 |
| Likelihood | Medium (project scale, example) |
| Impact | Medium — commercial confidentiality, not customer PII |
| Severity | Medium |
| Confidence | Medium |
| Residual risk | Low after CTRL-001 and field filtering; public-read inference Accepted Risk |

## Treatment

| Field | Value |
| --- | --- |
| Treatment | Mitigate |
| Linked controls | CTRL-001 |
| Linked exceptions | EXC-001 |
| Linked debt | None documented (example) |
| Classification | Confirmed (example) |

## Related Documentation

| Document | Path |
| --- | --- |
| Asset | ../asset/ |
| Threat | ../threat/ |
| Control | ../control/ |
| Exception | ../exception/ |
