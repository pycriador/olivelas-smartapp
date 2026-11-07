---
title: "BFF / camada de apresentação na borda"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "TPL-BFF-001"
type: "application"
---

# BFF / camada de apresentação na borda

> Language: pt-BR | [English (EN)](../../en/templates/bff.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Documenta um frontend voltado ao browser ou BFF na trust boundary à frente de APIs privadas. SSR é opcional — descreva o que o projeto realmente faz. -->

## Purpose

<!-- Why this layer exists (public UI, API aggregation, same-origin proxy, SSR, …). -->

## Responsibilities

| In | Out |
| --- | --- |
| Serve UI / render / hydrate | Business rules owned by API |
| Proxy or call backend APIs | Direct database / secret access |

## Trust boundary

```mermaid
flowchart LR
    Browser["Browser"] --> Edge["BFF / SSR / static edge"]
    Edge --> API["Private API"]
```

| Boundary | Notes | Classification |
| --- | --- | --- |
| Internet → edge | TLS, public hostname | |
| Edge → API | Private network / proxy target | |

## Configuration (names only)

| Variable / setting | Where | Purpose | Classification |
| --- | --- | --- | --- |
| | build / runtime | | |

## Auth posture

<!-- Where tokens live — evidenced only. Never document secret values. -->

## Related

- Architecture overview / system context
- Security overview
- HTTP contracts
- ADR if SSR vs CSR was a material decision
