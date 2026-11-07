# Suggested Document Platform Example / Exemplo: Plataforma de Documentos Sugerida

> **SUGGESTED / ILLUSTRATIVE** stack · **NOT** the AIOps Documentation Standard · **NOT** a Loft platform mandate
>
> **Stack SUGERIDA / ILUSTRATIVA** · **NÃO** é o Padrão de Documentação AIOps · **NÃO** é mandato de plataforma Loft
>
> Status: ACCEPTED · Owner: example-team · Updated: 2026-08-10
>
> Documentation Standard v1.0

## Critical framing / Enquadramento crítico

| Language | Message |
| --- | --- |
| EN | This package is a **suggested / illustrative** documentation shape inspired by patterns from an **isolated reference project** (document intelligence / RAG / SSR BFF / Flask / Slack worker / scheduler / PostgreSQL). It is **NOT** the AIOps Documentation Standard, **NOT** the definitive guide on how to use the framework, and **NOT** a Loft platform mandate. Technology choices (React SSR, Flask, external LLM, Slack Socket Mode, optional vector search, Vault, Helm-style values) are **example-only**. |
| pt-BR | Este pacote é uma forma de documentação **sugerida / ilustrativa**, inspirada em padrões de um **projeto isolado de referência** (inteligência documental / RAG / SSR BFF / Flask / worker Slack / scheduler / PostgreSQL). **NÃO** é o Padrão de Documentação AIOps, **NÃO** é o guia definitivo de uso do framework e **NÃO** é um mandato de plataforma Loft. Escolhas de tecnologia (React SSR, Flask, LLM externo, Slack Socket Mode, busca vetorial opcional, Vault, values estilo Helm) são **apenas exemplo**. |

**Fictional product name / Nome de produto fictício:** **Northstar Document Platform**

Do **not** use real service hostnames or real vault paths. Placeholders only, e.g. `https://docs.example.com`, `secrets/path/example`.  
**Não** use hostnames reais de serviço nem paths reais de vault. Apenas placeholders, ex.: `https://docs.example.com`, `secrets/path/example`.

None of these documents describe a real project. / Nenhum destes documentos descreve um projeto real.

## What it demonstrates / O que demonstra

- Document-intelligence + RAG documentation shape (Context → System → Components → Contracts → Ops)
- SSR BFF separating browser from secrets and data stores
- Dual PostgreSQL schemas (app + knowledge) as an illustrative data ownership pattern
- Workers sharing the API image (Slack Socket Mode + internal scheduler)
- Hybrid search (FTS + optional vector) as a runbook-worthy capability
- ADRs for SSR BFF and Slack worker process model
- AI-ready entry (`ai-context`)

## Suggested illustrative stack / Stack ilustrativa sugerida (**NOT STANDARD**)

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

**Do not** copy this table into a project as “required by aiops-documentation”. Prefer the technology-agnostic templates under `docs/`.

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
