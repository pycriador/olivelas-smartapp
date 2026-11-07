---
title: "Change Impact Matrix"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Change Impact Matrix

> Language: EN | [Português (pt-BR)](../pt-BR/change-impact-matrix.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

| Change type | Required validation | Required review | Also evaluate |
| --- | --- | --- | --- |
| Architecture change | Structural lint; architecture checklist | Architecture | Contracts, Operations, Security, ADRs |
| API / contract change | Lint; contract checklist | Technical / contract owner | Consumers, Security, Ops, Tests |
| Operational change | Lint; ops readiness | Operational | Runbooks, Alerts, Recovery |
| Security change | Lint; security checklist | Security | Threats, Controls, Contracts, Ops |
| AI-context / manifest change | Lint; AI readiness rules | Maintainer + domain as needed | Navigation, evidence, relationships |
| Editorial only | Lint | Optional | — |

Integrate with [change-policy.md](change-policy.md) and [change-impact.md](change-impact.md).
