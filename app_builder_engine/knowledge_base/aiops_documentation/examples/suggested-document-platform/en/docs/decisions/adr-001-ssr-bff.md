---
title: "ADR-001 SSR BFF — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "ADR-NS-001"
type: "adr"
---

# ADR-001: SSR BFF in front of the API

> Language: EN | [Português](../../../pt-BR/docs/decisions/adr-001-ssr-bff.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** decision record — **NOT** a platform mandate.

## Context

Northstar needs a web UI and must keep LLM, Drive, and database credentials out of the browser. A pure SPA talking to a public API is possible, but pushes CORS, cookie, and secret-boundary complexity to the edge.

## Decision

Use a **Node SSR BFF** that renders React and proxies `/api` (and `/external` when needed) to Flask.

## Consequences

| Positive | Negative |
| --- | --- |
| Single public origin (`https://docs.example.com`) | Extra runtime to operate |
| Secrets stay in server processes | SSR/auth edge cases |
| Clear trust boundary | Not required by the documentation standard |

## Alternatives considered

| Alternative | Why not (in this example) |
| --- | --- |
| SPA + public API only | Weaker secret/origin story |
| Server-rendered only (no React) | UI richness goals in the fiction |

**Classification:** Proposed (example only).

## Related

- [../application/ssr-bff.md](../application/ssr-bff.md)
- [../architecture/overview.md](../architecture/overview.md)
