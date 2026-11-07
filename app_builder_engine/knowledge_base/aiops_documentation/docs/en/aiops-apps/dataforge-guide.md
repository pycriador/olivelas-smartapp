---
id: REF-AIOPS-APPS-012
title: "DataForge — Plain-language guide"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-31"
review_date: "2026-11-30"
---

# DataForge, in plain language

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/dataforge-guia.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

> Looking for the full technical detail (architecture, integrations, evidence)? See the [technical specification](dataforge.md).

## What it is

DataForge is the internal platform where Loft squads organize **data projects**: they upload files, compare and reconcile information, and look up data dictionaries. It's also where administrators manage the service accounts used by automated integrations.

## Who it's for

Internal squads that need to cross-check or validate data between systems use DataForge for that day to day. Administrators use the same platform to manage service access. It's a **corporate internal** tool — not aimed at Loft's external customers.

## Why it matters

If DataForge goes down, the project and data-reconciliation flows of squads that depend on it get blocked until the platform is back. There's no formal, documented service-level agreement today — in practice, whoever was reconciling data at that moment gets stuck.

## How it works, in short

Behind a web interface, DataForge has a visual part (what you see in the browser) and a back-end part that processes data and talks to the database where everything is stored. It also connects to internal Loft tooling for authentication, monitoring, and secrets — none of that needs to be understood to use the product, only to keep it running.

## Want to go deeper?

- Full architecture, stack, and integrations: [dataforge.md](dataforge.md)
- How the repository works internally: [technical README on GitHub](https://github.com/loft-br/aiops-dataforge/blob/main/README.md)
- Catalog of all team applications: [../aiops-team/applications.md](../aiops-team/applications.md)
