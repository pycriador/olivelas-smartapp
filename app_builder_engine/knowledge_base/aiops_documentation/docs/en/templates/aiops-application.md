---
title: "Application Name — AIOps application doc"
status: "DRAFT"
owner: "aiops"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
---

# Application Name

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/aiops-application.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

**As-is** documentation for [loft-br/REPO_NAME](https://github.com/loft-br/REPO_NAME) in the AIOps catalog — **level 2**. Level 3 technical detail lives in the app repository README.

## Goal

<!-- One paragraph: what the product delivers. -->

## Context

<!-- Business/technical context. Classify claims: Confirmed / Inferred / Unknown. -->

## Users / areas

| User / area | Need |
| --- | --- |
| | |

## Impact

<!-- What breaks or degrades if unavailable. Do not invent SLOs. -->

## Architecture overview

<!-- Short diagram or pointer to overview.md section. -->

Repo: [loft-br/REPO_NAME](https://github.com/loft-br/REPO_NAME).

```text
<!-- Optional ASCII diagram -->
```

Layout detail: [overview.md](../aiops-apps/overview.md#app-slug).

## Main integrations

| Integration | Role |
| --- | --- |
| PostgreSQL (RDS) | |
| Kong corp | |
| Vault | |
| Datadog | |

## Stack (summary)

| Layer | Technology |
| --- | --- |
| Frontend | |
| Backend | |
| Deploy | |

Matrices: [frontend-stack.md](../aiops-apps/frontend-stack.md) · [backend-stack.md](../aiops-apps/backend-stack.md).

## Level 3 — technical documentation (repository)

Repo: [loft-br/REPO_NAME](https://github.com/loft-br/REPO_NAME).

| Topic | Link |
| --- | --- |
| README (how to run) | [README](https://github.com/loft-br/REPO_NAME/blob/main/README.md) |
| Backend | [backend/README](https://github.com/loft-br/REPO_NAME/blob/main/backend/README.md) |
| Docs folder | [docs/](https://github.com/loft-br/REPO_NAME/tree/main/docs) |

## Deploy (Loft pattern)

| Field | Value |
| --- | --- |
| Namespace k8s | |
| Corp URL | |
| Workflows | `.github/workflows/` |
| Vault path | |

Infra: [loft-infra/overview.md](../loft-infra/overview.md).

## Security (summary)

Pointer: [security.md](../aiops-apps/security.md).

## Related

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [routes.md](../aiops-apps/routes.md)
