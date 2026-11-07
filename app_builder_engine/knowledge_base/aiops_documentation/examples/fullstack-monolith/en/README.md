# Example: Fullstack Monolith (Fictional) — SheetLedger

> Language: EN | [Português (pt-BR)](../pt-BR/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> **Fictional / illustrative example.** It does not describe a real official project, service, environment, or stack.
>
> The technology stack below is **only an illustrative suggestion** inspired by an isolated reference project.
> It is **not** the framework standard, **not** the definitive adoption guide, and **not** a replacement for the methodologies under `docs/`.
>
> The Engineering Documentation Standard remains **technology-agnostic**.


## Fictional name

**SheetLedger** — fictional workspace for governed spreadsheet ingestion, transformation, and delivery, with web UI and API in one repository.

## What this example implements (detailed)

This documentation package shows end-to-end how an adopter can structure docs for an FE+API+DB monolith:

1. **project-overview** — purpose, scope, non-goals, components, dependencies, glossary.
2. **architecture/overview + system-context** — system boundary, actors, trust boundaries, illustrative dual-schema data ownership.
3. **application/** — components: `frontend-app`, `backend-api`, `project-pipeline`, `storage-and-files`, `data-ops`, `catalog-and-people`, `sandbox-live`.
4. **contracts/** — REST (OpenAPI stub), File (CSV/XLSX), Integration (object storage), auth tokens / service accounts, canonical ingest.
5. **security/** — authn/authz overview + pointer to illustrative RBAC.
6. **operations/** — service-profile (owner/on-call must be filled or `Unknown`), honest observability, 2 runbooks.
7. **decisions/** — ADR for Live/Sandbox modes.
8. **ai-context + knowledge-gaps** — AI-ready entry and explicit gaps.
9. **Suggested stack card** — **non-normative** technology table (see overview).

## How to read

Start at [docs/project-overview.md](docs/project-overview.md).

## Related (standard methodology)

- [adoption-path.md](../../../docs/en/adoption-path.md)
- [flat-docs-migration.md](../../../docs/en/flat-docs-migration.md)
- [templates/deployment.md](../../../docs/en/templates/deployment.md)
