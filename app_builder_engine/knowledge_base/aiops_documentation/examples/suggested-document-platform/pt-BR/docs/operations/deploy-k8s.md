---
title: "Deploy Kubernetes — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "OPS-NS-K8S-001"
type: "operations"
---

# Deploy (Kubernetes / estilo Helm) — ilustrativo

> Idioma: pt-BR | [English](../../../en/docs/operations/deploy-k8s.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGERIDO / ILUSTRATIVO** — values estilo Helm são **específicos da org** e **não** são mandato Olivelas.

## Workloads

| Workload | Image | Role | Classification |
| --- | --- | --- | --- |
| `northstar-web` | web image | SSR BFF | Proposed (example only) |
| `northstar-api` | api image | HTTP API | Proposed (example only) |
| `northstar-slack` | api image | Socket Mode | Proposed (example only) |
| `northstar-scheduler` | api image | Jobs | Proposed (example only) |

## Esboço de values (não normativo)

```yaml
# illustrative only — not a real chart
web:
  replicas: 2
  publicUrl: https://docs.example.com
api:
  replicas: 3
  secretsPath: secrets/path/example
workers:
  slack:
    enabled: false
  scheduler:
    enabled: false
```

## Segredos

| Source | Guidance | Classification |
| --- | --- | --- |
| Vault / sealed secrets | Mount or inject; path placeholder `secrets/path/example` | Proposed (example only) |
| Inline literals in git | Forbidden | Confirmed (within example) |

## Relacionados

- [../infrastructure/deployment.md](../infrastructure/deployment.md)
- [../security/overview.md](../security/overview.md)
