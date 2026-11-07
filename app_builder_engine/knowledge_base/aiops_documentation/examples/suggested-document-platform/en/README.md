# Example: Suggested Document Platform (Fictional) — Northstar

> Language: EN | [Português](../pt-BR/README.md)
>
> Status: ACCEPTED · Owner: example-team · Updated: 2026-08-10
>
> Documentation Standard v1.0

## Critical framing (read first)

This package is a **SUGGESTED / ILLUSTRATIVE** stack inspired by patterns from an **isolated reference project** (document intelligence / RAG / SSR BFF / Flask / Slack worker / scheduler / PostgreSQL).

This is **NOT**:

- the AIOps Documentation Standard
- the definitive guide on how to use the framework
- a Loft platform mandate

Technology choices (React SSR, Flask, external LLM provider, Slack Socket Mode, optional vector search, Vault, Helm-style values) are **example-only**. The Engineering Documentation Standard remains **technology-agnostic**.

**Fictional product:** **Northstar Document Platform**. Use placeholders such as `https://docs.example.com` and `secrets/path/example` — never real organization hostnames or real vault paths.

## Suggested illustrative stack (**NOT STANDARD**)

| Layer | Illustrative choice |
| --- | --- |
| Frontend | React + Node SSR BFF |
| API | Flask + SQLAlchemy |
| DB | PostgreSQL dual schema app + knowledge |
| Workers | Slack Socket Mode + internal scheduler (same API image) |
| AI | External LLM provider (illustrative) |
| Search | FTS + optional vector |
| Secrets | Env/Vault; encrypted group secrets at rest |
| Deploy | Container + Helm-style values (org-specific) |

## What this example covers

1. **project-overview** — purpose, scope, non-goals, components, stack card
2. **architecture/** — overview, system context, data model
3. **application/** — SSR BFF, Flask API, document analysis, Slack bridge, scheduler, knowledge platform
4. **contracts/** — HTTP API and external API sketches
5. **operations/** — feature flags, local-dev, deploy-k8s, hybrid search runbook
6. **security/** + **observability/** — honest overviews with Confirmed/Inferred/Unknown
7. **decisions/** — ADR-001 SSR BFF, ADR-002 Slack Socket worker
8. **infrastructure/deployment.md** — container + values sketch
9. **ai-context** — AI-ready entry for agents

## How to read

Start at [docs/project-overview.md](docs/project-overview.md).

## Related (standard methodology)

- [adoption-path.md](../../../docs/en/adoption-path.md)
- [flat-docs-migration.md](../../../docs/en/flat-docs-migration.md)
- [templates/](../../../docs/en/templates/)
