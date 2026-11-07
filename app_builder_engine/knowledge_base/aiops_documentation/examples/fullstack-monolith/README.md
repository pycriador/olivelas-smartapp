# Fullstack Monolith Example / Exemplo: Monólito Fullstack

> **Fictional example** / **Exemplo ficcional** for demonstrating the Engineering Documentation Standard on a **frontend + API + database in one repository** shape.
>
> None of these documents describe a real project. / Nenhum destes documentos descreve um projeto real.
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Critical disclaimer / Aviso crítico

| Language | Message |
| --- | --- |
| EN | The stack and module names are **illustrative only**. They are **not** the documentation standard, not a Loft platform mandate, and not the only valid way to adopt this framework. |
| pt-BR | A stack e os nomes de módulos são **apenas ilustrativos**. **Não** são o padrão de documentação, nem um mandato de plataforma Loft, nem a única forma válida de adotar este framework. |

This example is inspired by patterns observed in an **isolated reference project** (corporate spreadsheet workspace). The reference project is **out of scope** of this repository and must not be treated as canonical guidance for the standard.

Este exemplo inspira-se em padrões observados em um **projeto isolado de referência** (workspace corporativo de planilhas). O projeto de referência está **fora do escopo** deste repositório e não deve ser tratado como orientação canônica do padrão.

## What it demonstrates / O que demonstra

- Monolith + Frontend documentation shape (Context → System → Components → Interfaces)
- Dual execution modes (Live API vs client Sandbox) as an architectural boundary
- REST + File + Integration contracts
- RBAC / API tokens / service accounts (illustrative)
- Minimal operations: service profile, observability honesty, runbooks
- AI-ready entry (`ai-context`, knowledge gaps)
- Suggested (non-normative) stack card for readers who want a concrete picture

## Suggested illustrative stack / Stack ilustrativa sugerida (NOT the standard)

| Layer | Illustrative choice | Notes |
| --- | --- | --- |
| Frontend | React + TanStack Start/Router/Query + Vite | One possible SPA/SSR UI |
| Backend | Flask + SQLAlchemy | One possible HTTP API |
| Database | PostgreSQL (dual schema `core` / `data`) | One possible persistence layout |
| Auth | JWT + optional API tokens + M2M service accounts | Pattern-level; not a vendor mandate |
| Object storage | Google Drive adapter (S3 as Proposed stub) | Edge integration example |
| Process model | Gunicorn + optional container / Workers deploy | Deployment is organizational |
| Observability | Health checks + audit log + local ring buffers; Datadog **optional** for Loft | Framework does not require Datadog |

**Do not** copy this table into a project as “required by aiops-documentation”. Prefer the technology-agnostic templates.

## Choose a language / Escolha um idioma

| Language | Path |
| --- | --- |
| English | [en/](en/) |
| Português (pt-BR) | [pt-BR/](pt-BR/) |

Start reading / Comece a ler:

- EN: [en/docs/project-overview.md](en/docs/project-overview.md)
- pt-BR: [pt-BR/docs/project-overview.md](pt-BR/docs/project-overview.md)

Related standard guides (normative methodology, not this example):

- [Adoption path](../../docs/en/adoption-path.md) / [Caminho de adoção](../../docs/pt-BR/adoption-path.md)
- [Flat docs migration](../../docs/en/flat-docs-migration.md) / [Migração de docs flat](../../docs/pt-BR/flat-docs-migration.md)
