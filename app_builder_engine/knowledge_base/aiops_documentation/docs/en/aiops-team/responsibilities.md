---
id: REF-AIOPS-TEAM-004
title: "AIOps — Responsibilities"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Responsibilities

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/responsibilities.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Responsibilities of the **AIOps team** for products, platform, and documentation. Per-component detail follows [component.md](../templates/component.md).

## Responsibilities (Confirmed / Inferred)

| Area | Responsibility | Classification |
| --- | --- | --- |
| AIOps products | Develop, operate, and evolve apps listed in [applications.md](applications.md) | **Inferred** (evidence: `loft-br/aiops-*` repos) |
| Loft publish path | GitHub Actions workflows, k8s-apps manifests, Kong, DNS, Vault for `ai-ops` namespace | **Confirmed** — [../loft-infra/overview.md](../loft-infra/overview.md) |
| Observability | Datadog instrumentation, structured logs, dashboards and alerts for AIOps services | **Confirmed** — [../loft-observability/README.md](../loft-observability/README.md) |
| As-is documentation | Maintain `aiops-team`, `aiops-apps`, `loft-infra`, `loft-observability` packs in this repo | **Confirmed** |
| App security | AuthN/Z, Vault secrets, headers and CORS per [../aiops-apps/security.md](../aiops-apps/security.md) | **Confirmed** |

## Out of scope (non-responsibilities)

| Area | Rationale |
| --- | --- |
| Loft legacy PHP platform | Different stack — not in cataloged AIOps repos |
| Shared AWS/EKS platform | Maintained by platform (`loft-infra-cloud`); AIOps consumes via k8s-apps |
| Org-wide documentation methodology | This repo **defines** the standard; adoption is each squad's responsibility |

## Per-app matrix

Fine-grained product ownership: **Unknown** until human input. Product links: [applications.md](applications.md).

## Related

- [who-we-are.md](who-we-are.md)
- [technical-standards.md](technical-standards.md)
- [../ownership.md](../ownership.md)
