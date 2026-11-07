---
title: "Feature flags / superfície de configuração"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "TPL-FLAGS-001"
type: "operations"
---

# Feature flags / superfície de configuração

> Language: pt-BR | [English (EN)](../../en/templates/feature-flags.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Documente toggles de runtime que mudam comportamento sem deploy de código. Agnóstico de tecnologia: não assuma um serviço de flags de vendor. Nunca documente valores de segredo. -->

## Purpose

<!-- Why this surface exists (rollback, gradual rollout, emergency kill-switches). -->

## Scope

| In scope | Out of scope |
| --- | --- |
| Named flags / env toggles and effects | Secret values, credentials |
| Default and rollback posture | Full config management product design |

## Flag inventory

| Flag / env name | Default | Effect when enabled | Owner | Classification |
| --- | --- | --- | --- | --- |
| | | | | Confirmed / Inferred / Unknown / Proposed |

## Groups

| Group | Flags | Notes |
| --- | --- | --- |
| | | |

## Emergency rollback

| Scenario | Flags to change | Restart required? | Classification |
| --- | --- | --- | --- |
| | | | |

## Related

- Operations / service profile
- Architecture runtime view
- Contracts affected by toggles
