---
title: "Infrastructure / deployment — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "INFRA-NS-001"
type: "infrastructure"
---

# Infrastructure / deployment (illustrative)

> Language: EN | [Português](../../../pt-BR/docs/infrastructure/deployment.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** — container + Helm-style values are **org-specific**, not a Loft or framework mandate.

## Purpose

Sketch how Northstar artifacts may be published: container images, optional Kubernetes workloads, and secret injection via env or Vault path placeholders.

## Artifacts

| Artifact | Contents | Classification |
| --- | --- | --- |
| Web image | Node SSR BFF + static assets | Proposed (example only) |
| API image | Flask app + worker entrypoints | Proposed (example only) |
| Values file | Replicas, URLs, feature flags, `secrets/path/example` | Proposed (example only) |

## Environments (placeholders)

| Env | Frontend | API |
| --- | --- | --- |
| local | `http://localhost:8080` | `http://localhost:5000` |
| staging | `https://docs.staging.example.com` | `https://api.docs.staging.example.com` |
| prod | `https://docs.example.com` | `https://api.docs.example.com` |

## Topology

```mermaid
flowchart TB
    Ingress["Ingress / TLS"] --> Web["northstar-web"]
    Ingress --> API["northstar-api"]
    Web --> API
    API --> PG[("PostgreSQL")]
    SW["northstar-slack"] --> API
    SCH["northstar-scheduler"] --> API
    API --> Vault["Vault secrets/path/example"]
```

## Related

- [../operations/deploy-k8s.md](../operations/deploy-k8s.md)
- [../operations/local-dev.md](../operations/local-dev.md)
- [../security/overview.md](../security/overview.md)
