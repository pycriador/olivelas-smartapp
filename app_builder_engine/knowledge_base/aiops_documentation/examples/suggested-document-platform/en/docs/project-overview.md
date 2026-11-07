---
title: "Northstar Document Platform (Fictional) — Project overview"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "PROJ-NS-001"
type: "project-overview"
---

# Northstar Document Platform (Fictional)

> Language: EN | [Português](../../pt-BR/docs/project-overview.md)
>
> Status: ACCEPTED · Owner: example-team · Updated: 2026-08-10
>
> Documentation Standard v1.0

## Critical framing

This document belongs to a **SUGGESTED / ILLUSTRATIVE** example inspired by patterns from an **isolated reference project** (document intelligence / RAG / SSR BFF / Flask / Slack worker / scheduler / PostgreSQL).

It is **NOT** the AIOps Documentation Standard, **NOT** the definitive guide on how to use the framework, and **NOT** a Loft platform mandate. The technology choices below are **example-only**.

**Fictional product:** Northstar Document Platform. Placeholders only (`https://docs.example.com`, `secrets/path/example`).

## Purpose

Fictional enterprise platform for **document ingestion, LLM-assisted analysis, conversational retrieval with citations (RAG)**, and the same capabilities exposed to browsers, Slack, and scoped external API clients — without putting secrets or database access in the frontend.

## Problem

Teams need to ingest documents (PDF/Office), analyze them with an external LLM, answer questions with citations, sync folders on a schedule, and bridge chat into Slack — with RBAC, encrypted group secrets, and auditability.

## Scope

| In scope | Notes | Classification |
| --- | --- | --- |
| React SSR BFF + Flask API | Browser never holds LLM/DB secrets | Confirmed (within example) |
| PostgreSQL dual schema `app` + `knowledge` | Operational vs RAG | Confirmed (within example) |
| Multi-group RBAC, agents, chat | Tenant-like isolation | Confirmed (within example) |
| Knowledge platform (ingest, search, prompts) | RAG subsystem | Confirmed (within example) |
| Slack Socket Mode worker | Same API image | Confirmed (within example) |
| Internal scheduler | Drive→analysis→knowledge (illustrative) | Confirmed (within example) |
| External API tokens | Scoped machine clients | Confirmed (within example) |

## Non-goals

| Non-goal | Reason |
| --- | --- |
| Mandating this stack for the standard | The standard is technology-agnostic |
| Browser → PostgreSQL / Drive / LLM directly | Secrets stay on the server |
| Real production URLs, vault paths, or SLOs | Fiction; Unknown |
| OS/K8s CronJobs as the only scheduler | The example uses an in-app worker |

## Suggested stack (ILLUSTRATIVE — **NOT STANDARD**)

| Layer | Illustrative choice | Classification |
| --- | --- | --- |
| Frontend | React + Node SSR BFF | Proposed (example only) |
| API | Flask + SQLAlchemy | Proposed (example only) |
| DB | PostgreSQL dual schema app + knowledge | Proposed (example only) |
| Workers | Slack Socket Mode + internal scheduler (same image) | Proposed (example only) |
| AI | External LLM provider (illustrative) | Proposed (example only) |
| Search | FTS + optional vector | Proposed (example only) |
| Secrets | Env/Vault; encrypted group secrets at rest | Proposed (example only) |
| Deploy | Container + Helm-style values (org-specific) | Proposed (example only) |

> If your project uses another stack: **ignore this table** and document the real stack with correct Classification.

## Public URLs (placeholders)

| Component | URL |
| --- | --- |
| Frontend | `https://docs.example.com` |
| API | `https://api.docs.example.com` |
| API health | `https://api.docs.example.com/api/health` |

## Architecture

- Overview: [architecture/overview.md](architecture/overview.md)
- Context: [architecture/system-context.md](architecture/system-context.md)
- Data: [architecture/data-model.md](architecture/data-model.md)

## Components

| Component | Responsibility | Doc |
| --- | --- | --- |
| ssr-bff | Render React, proxy `/api` and `/external` | [application/ssr-bff.md](application/ssr-bff.md) |
| flask-api | Auth, RBAC, analysis, chat, KOC, external API | [application/flask-api.md](application/flask-api.md) |
| document-analysis | Multi-format pipeline → LLM | [application/document-analysis.md](application/document-analysis.md) |
| slack-bridge | Socket Mode DM gateway | [application/slack-bridge.md](application/slack-bridge.md) |
| scheduler | In-app Drive→analysis→knowledge jobs | [application/scheduler.md](application/scheduler.md) |
| knowledge-platform | RAG ingest, search, prompts, skills | [application/knowledge-platform.md](application/knowledge-platform.md) |

## Security / Ops / AI

- [security/overview.md](security/overview.md)
- [operations/local-dev.md](operations/local-dev.md)
- [observability/overview.md](observability/overview.md)
- [ai-context.md](ai-context.md)
