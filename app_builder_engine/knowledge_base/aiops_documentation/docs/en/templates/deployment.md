---
title: "Deployment view"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "TPL-DEPLOY-001"
type: "template"
---

# Deployment view

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/deployment.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Lightweight deployment view (optional arc42 §7). Technology-agnostic: do not assume a specific cloud, orchestrator, or pipeline. Concrete stacks belong to the project — never to the standard. -->

## Purpose

<!-- How and where this system is deployed at a high level. -->

## Scope

| In scope | Out of scope |
| --- | --- |
| Deployable units and environments | Detailed incident runbooks (link to ops) |

## Deployable units

| Unit | Artifact | Runtime | Classification |
| --- | --- | --- | --- |
| | image / binary / bundle / other | | Confirmed / Inferred / Unknown / Proposed |

## Environments

| Environment | Purpose | URL / identifier (no secrets) | Classification |
| --- | --- | --- | --- |
| | | | |

## Change pipeline

| Stage | What happens | Evidence |
| --- | --- | --- |
| Build | | |
| Test | | |
| Deploy | | |

<!-- Do not paste CI secrets. Prefer `${{ secrets.* }}` / Vault as organizational practice — never invent values. -->

## Configuration and secrets

| Type | Where it lives | Notes |
| --- | --- | --- |
| Non-secret config | | |
| Secrets | | Never inline in docs |

## Health / readiness in deploy

| Check | Path or signal | Notes |
| --- | --- | --- |
| | | |

## Rollback / forward-fix

| Strategy | Status | Notes |
| --- | --- | --- |
| | Implemented / Partial / Unknown / N/A | |

## Related

- Service profile / runbooks
- Observability
- Architecture overview
