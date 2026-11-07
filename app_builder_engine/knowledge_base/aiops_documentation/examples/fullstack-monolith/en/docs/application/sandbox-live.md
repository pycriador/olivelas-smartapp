---
title: "Component — sandbox-live (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# sandbox-live

> Language: EN | [Português (pt-BR)](../../../pt-BR/docs/application/sandbox-live.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Fictional example.** Illustrative stack ≠ framework standard.

## Purpose

Document the boundary between Live (API+DB) and Sandbox (browser state).

## Responsibilities

| Aspect | Live | Sandbox | Classification |
| --- | --- | --- | --- |
| Persistence | API + DB | Local store | Confirmed (within example) |
| Selection | Illustrative session/local key | same | Confirmed (within example) |
| Use | Production-like | Demo/UX | Confirmed (within example) |

## Notes

Decision: [../decisions/adr-001-live-sandbox.md](../decisions/adr-001-live-sandbox.md). Sandbox does not replace staging for real RBAC.

## Out of this component

Sibling components are named in [../project-overview.md](../project-overview.md) and not re-documented here.

## Classification reminder

Claims marked Confirmed apply **within this fictional example** only. Technology choices remain Proposed (example only) unless stated otherwise.
