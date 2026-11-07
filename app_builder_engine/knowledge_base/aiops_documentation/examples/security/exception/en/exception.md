---
title: "Security Exception: EXC-001 public marketing read (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-09-07"
version: "1.0"
exception_id: "EXC-001"
---

# Security Exception: EXC-001 public marketing read

> Language: EN | [Português (pt-BR)](../pt-BR/exception.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Exception ID: EXC-001
>
> **Fictional example — not a real project.**

## Summary

Time-bounded approval to expose a Public-only catalog subset without caller authentication for a marketing microsite campaign.

## Required Fields

| Field | Value |
| --- | --- |
| Exception ID | EXC-001 |
| **Requirement** | Public-read authn default (project policy example) — waived for Public fields only; REQ-SEC-001 (admin writes) remains in force |
| **Reason** | Campaign microsite needs unauthenticated browse of Public catalog subset |
| **Risk** | RISK-001 residual inference on Public fields; no Internal fields in response |
| **Compensating control** | Edge rate limit `EDGE_LOOKUP_RATE_LIMIT`; field allowlist to Public classification only |
| **Owner** | example-team |
| **Approval** | example-security-approver (role) |
| **Expiration** | 2026-09-30 |

## Status

| Field | Value |
| --- | --- |
| Status | Approved |
| Approved on | 2026-08-01 |
| Last review | 2026-08-07 |

## Context

| Field | Value |
| --- | --- |
| Linked vulnerability / debt | None |
| Monitoring while active | Public lookup volume alerts; deny Internal field projection tests |
| Classification | Confirmed (example) |

## Closure

| Field | Value |
| --- | --- |
| Close reason | — (open until expiration) |
| Closed on | — |
| Follow-ups | Revert public-read path to default policy after campaign |

## Related Documentation

| Document | Path |
| --- | --- |
| Requirement | ../requirement/ |
| Risk | ../risk/ |
| Control | ../control/ |
| Incident | ../incident/ |
