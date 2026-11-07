---
id: REF-AIOPS-TEAM-001
title: "AIOps — Team"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# AIOps — Team

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-team/README.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

> Prefer a plain-language explanation? See the [Guide](README-guide.md).

Documentation hub for the **AIOps team** in the Confluence [AIOps](https://loftbr.atlassian.net/wiki/spaces/AIOps/folder/6086460456) space. Coexists with the documentation framework methodology in this repository.

## Three-level model

| Level | Location | Purpose |
| --- | --- | --- |
| **1 — Team** | [`aiops-team/`](README.md) (this folder) | Who we are, responsibilities, cross-cutting standards |
| **2 — Application / solution** | [`../aiops-apps/`](../aiops-apps/README.md) | Goal, architecture, and integrations per product |
| **3 — Repository** | `README.md` and `docs/` in each GitHub repo | How to run, code, APIs, tests, local troubleshooting |

Model details: [documentation-model.md](documentation-model.md).

Confluence publish: profile `documentacao-inicial.pt-BR.yaml` (parent `6086460456`). On-demand sync: [`docs-sync/aiops-config/hub-registry.yaml`](../../../docs-sync/aiops-config/hub-registry.yaml).

---

## Folder map

| Document | Content |
| --- | --- |
| [who-we-are.md](who-we-are.md) | Who we are — squad charter |
| [responsibilities.md](responsibilities.md) | Team responsibilities and boundaries |
| [applications.md](applications.md) | Application catalog → level 2 |
| [stacks.md](stacks.md) | Stacks in use (summary + pointers) |
| [ways-of-working.md](ways-of-working.md) | Ways of working — rituals and flows |
| [technical-standards.md](technical-standards.md) | Technical standards and methodology links |
| [security.md](security.md) | Cross-cutting AIOps security |
| [observability.md](observability.md) | Observability — Datadog and practices |
| [troubleshooting.md](troubleshooting.md) | Cross-cutting troubleshooting |
| [documentation-model.md](documentation-model.md) | Three-level documentation model |

---

## Related packs

| Pack | Path | Confluence (parent) |
| --- | --- | --- |
| Apps (level 2) | [../aiops-apps/](../aiops-apps/README.md) | [AIOps - Stack](https://loftbr.atlassian.net/wiki/spaces/AIOps/pages/6091309071) |
| Loft infra | [../loft-infra/](../loft-infra/README.md) | [Infra Loft](https://loftbr.atlassian.net/wiki/spaces/AIOps/pages/6090358809) |
| Observability | [../loft-observability/](../loft-observability/README.md) | (included in Infra Loft pack) |
