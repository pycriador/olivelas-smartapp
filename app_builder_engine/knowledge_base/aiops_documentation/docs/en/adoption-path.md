---
title: "Adoption path"
status: "REVIEW"
owner: "documentation-standard"
created: "2026-08-10"
updated: "2026-08-13"
review_date: "2026-11-10"
version: "1.0"
---

# Adoption path

> Language: EN | [Português (pt-BR)](../pt-BR/adoption-path.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

**Documentation maturity** guide for projects adopting this standard. You do not need every category on day one.

This document is **framework methodology**. Concrete examples (including fullstack monolith) are illustrative and do **not** define a required stack.

## Principles

- Prefer evidence over premature complete inventories.
- Mark `Unknown` / `Not Applicable` instead of omitting.
- Technology stack belongs to the project; the standard is technology-agnostic.
- `ACCEPTED` status requires human review.

## Day 0 — Documentation MVP

Goal: a visitor understands what the system is and where to start.

| Artifact | Template / example |
| --- | --- |
| `project-overview.md` | [templates/project-overview.md](templates/project-overview.md) |
| `architecture/overview.md` or `system-context.md` | [templates/architecture-overview.md](templates/architecture-overview.md), [templates/system-context.md](templates/system-context.md) |
| One contract for the main public boundary | [templates/contract.md](templates/contract.md) |
| Docs index / README with a reading trail | See [examples/adoption-scaffold/](../../examples/adoption-scaffold/), [examples/simple-service/](../../examples/simple-service/), or [examples/suggested-document-platform/](../../examples/suggested-document-platform/) |
| Optional `AGENTS.md` / `CLAUDE.md` pointing at `ai-context.md` | [templates/agents-entry.md](templates/agents-entry.md), [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) |

Expected output: scope, non-goals, one context diagram, one verifiable interface.

## Day 30 — Operate and protect the basics

| Artifact | Notes |
| --- | --- |
| Main components (`application/` or `components/`) | Module level, not class catalogs |
| Minimal `security/overview` | Observable authn/authz; threat model may stay Unknown |
| `operations/service-profile.md` | **Owner and on-call filled or `Unknown`** — see template |
| 1–2 runbooks for real failures | Health/DB, auth bootstrap, critical dependency |
| `operations/observability.md` | Honest signals; org platform (e.g. Datadog at Olivelas) is optional to the standard |

## Day 90 — Reliability, security, and AI-ready

| Artifact | Notes |
| --- | --- |
| SLIs/SLOs or `Not Defined` with owner | Do not invent numbers |
| Minimal threat model | Assets → threats → controls |
| ADRs for material decisions | [templates/adr.md](templates/adr.md) |
| `ai-context.md` + `manifest.yaml` | [ai-ready-checklist.md](ai-ready-checklist.md) |
| Lightweight deploy view | [templates/deployment.md](templates/deployment.md) |
| Optional CI starter | [examples/adopter-ci-starter/](../../examples/adopter-ci-starter/) |
| Optional agent packaging | [ai-agent-entry.md](ai-agent-entry.md), [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) |

## Monolith + Frontend shape

If UI and API live in one repository, use [architecture-by-project-type.md](architecture-by-project-type.md) and the illustrative examples — **example stack ≠ standard**:

- [fullstack-monolith](../../examples/fullstack-monolith/) — FE+API+DB spreadsheet-shaped fiction
- [suggested-document-platform](../../examples/suggested-document-platform/) — document intelligence / BFF / workers fiction

Empty Day 0 tree: [adoption-scaffold](../../examples/adoption-scaffold/).

## Migrating from flat docs

If the repository already has many loose Markdown files: [flat-docs-migration.md](flat-docs-migration.md).

## What this guide is not

- Not a stack mandate (Flask, React, Kotlin, etc.).
- Not documentation for a specific Olivelas product.
- Not a replacement for `documentation-checklist.md` or the standard’s own quality gates.
- Not the definitive “only way” to adopt the framework — maturity is progressive.

## Related documents

- [documentation-checklist.md](documentation-checklist.md)
- [quality-model.md](quality-model.md)
- [architecture-by-project-type.md](architecture-by-project-type.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [language.md](language.md) — including optional partial bilingual policy for adopters
- [examples/adopter-ci-starter/](../../examples/adopter-ci-starter/) — optional CI
- [examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) — optional agent entry files
- [ai-agent-entry.md](ai-agent-entry.md) — how to wire Cursor / Claude Code
