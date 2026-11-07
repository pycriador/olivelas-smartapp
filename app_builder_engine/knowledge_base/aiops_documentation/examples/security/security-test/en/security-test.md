---
title: "Security Test: SECTEST-001 dependency SCA (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
test_id: "SECTEST-001"
---

# Security Test: SECTEST-001 dependency SCA

> Language: EN | [Português (pt-BR)](../pt-BR/security-test.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Test ID: SECTEST-001
>
> **Fictional example — not a real project. No tool-specific secret values.**

## Summary

Continuous software composition analysis (SCA) of catalog-service dependencies; findings enter the vulnerability process as candidates.

## Identity

| Field | Value |
| --- | --- |
| Test ID | SECTEST-001 |
| Name | catalog-service dependency SCA |
| Strategy | SCA |
| Status | Active |
| Owner | example-team |

## Scope

| Field | Value |
| --- | --- |
| In scope | Declared direct and transitive dependencies of catalog-service |
| Out of scope | Runtime host OS packages (owned elsewhere); third-party SaaS |
| Frequency | Continuous (on each change to dependency manifests) |
| Last executed | 2026-08-06 |

## Linkage

| Field | Value |
| --- | --- |
| Linked threats / controls / requirements | Supports detection of dependency weaknesses related to RISK-001 supply path; does not replace CTRL-001 |
| How findings are triaged | Open as vulnerability candidates → vulnerability process |
| Evidence location | Pipeline artifact store (logical name: `catalog-sca-reports`) — summaries only in docs |
| Classification | Confirmed (example) |

## Results (Summary Only)

| Field | Value |
| --- | --- |
| Outcome summary | Last run: no Critical open; one Medium candidate filed as VULN candidate ID pending |
| Open findings (IDs) | None confirmed as VULN-00x yet (example) |
| Exceptions created | None |

## Related Documentation

| Document | Path |
| --- | --- |
| Vulnerability | ../vulnerability/ |
| Control | ../control/ |
| Security review | ../security-review/ |
