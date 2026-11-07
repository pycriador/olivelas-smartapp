---
title: "System context — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "ARCH-NS-CTX-001"
type: "architecture"
---

# System context

> Language: EN | [Português](../../../pt-BR/docs/architecture/system-context.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** example — fictional product **Northstar Document Platform**.

## Purpose

Describe actors, external systems, and trust boundaries for the illustrative Northstar system.

## Actors

| Actor | Need | Classification |
| --- | --- | --- |
| Group operator (PT-BR UI) | Upload/analysis, chat with sources | Confirmed (within example) |
| Group / global admin | RBAC, schedules, model catalog, knowledge ops | Confirmed (within example) |
| Slack user | DM the bot → same chat pipeline | Confirmed (within example) |
| External integrator | `/external/*` with scoped tokens | Confirmed (within example) |
| Engineer / AI agent | Docs in this example tree | Confirmed (within example) |

## External systems

| System | Interaction | Classification |
| --- | --- | --- |
| External LLM provider | Analysis + chat completions | Proposed (example only) |
| Cloud drive | Folder sync/fetch | Proposed (example only) |
| Slack API (Socket Mode) | Events + replies | Proposed (example only) |
| Vault / secret store | Secrets at `secrets/path/example` | Proposed (example only) |
| Identity IdP | Optional SSO | Unknown |

## Context diagram

```mermaid
C4Context
    title Northstar Document Platform (fictional) — system context
    Person(user, "Group operator", "Browser UI")
    Person(admin, "Admin", "RBAC / schedules")
    Person(slackUser, "Slack user", "DM bot")
    Person(ext, "External client", "Token API")
    System(ns, "Northstar Document Platform", "SSR BFF + Flask + workers")
    System_Ext(llm, "LLM provider", "Completions")
    System_Ext(drive, "Cloud drive", "Files")
    System_Ext(slack, "Slack", "Socket Mode")
    System_Ext(vault, "Vault", "secrets/path/example")
    SystemDb(pg, "PostgreSQL", "app + knowledge")

    Rel(user, ns, "HTTPS")
    Rel(admin, ns, "HTTPS")
    Rel(slackUser, slack, "DM")
    Rel(slack, ns, "Socket Mode")
    Rel(ext, ns, "HTTPS + token")
    Rel(ns, llm, "API")
    Rel(ns, drive, "API")
    Rel(ns, vault, "Read secrets")
    Rel(ns, pg, "SQL")
```

## Trust boundaries

| Boundary | Inside | Outside | Classification |
| --- | --- | --- | --- |
| Browser ↔ BFF | Session cookie / auth header | Untrusted browser | Confirmed (within example) |
| BFF ↔ API | Private network or cluster DNS | Optional public internet | Inferred |
| API ↔ LLM / Drive | Credentials only on server | Vendor networks | Confirmed (within example) |
| Worker ↔ Slack | App token / socket | Slack cloud | Proposed (example only) |

## Related

- [overview.md](overview.md)
- [../security/overview.md](../security/overview.md)
