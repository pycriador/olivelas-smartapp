---
id: REF-AIOPS-TEAM-001
title: "AIOps — Time"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# AIOps — Time

> Language: pt-BR | [English (EN)](../../en/aiops-team/README.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

> Prefere uma explicação em linguagem simples? Veja o [Guia](README-guia.md).

Hub de documentação do **time AIOps** no espaço Confluence [AIOps](https://loftbr.atlassian.net/wiki/spaces/AIOps/folder/6086460456). Coexiste com a metodologia do framework de documentação neste repositório.

## Modelo em três níveis

| Nível | Onde vive | Propósito |
| --- | --- | --- |
| **1 — Time** | [`aiops-team/`](README.md) (esta pasta) | Quem somos, responsabilidades, padrões transversais |
| **2 — Aplicação / solução** | [`../aiops-apps/`](../aiops-apps/README.md) | Objetivo, arquitetura e integrações por produto |
| **3 — Repositório** | `README.md` e `docs/` em cada repo GitHub | Como executar, código, APIs, testes, troubleshooting local |

Detalhes do modelo: [documentation-model.md](documentation-model.md).

Publicação Confluence: perfil `documentacao-inicial.pt-BR.yaml` (parent `6086460456`). Sync sob demanda: [`docs-sync/aiops-config/hub-registry.yaml`](../../../docs-sync/aiops-config/hub-registry.yaml).

---

## Mapa desta pasta

| Documento | Conteúdo |
| --- | --- |
| [who-we-are.md](who-we-are.md) | Quem somos — charter da squad |
| [responsibilities.md](responsibilities.md) | Responsabilidades e limites do time |
| [applications.md](applications.md) | Catálogo de aplicações → nível 2 |
| [stacks.md](stacks.md) | Stacks utilizadas (resumo + pointers) |
| [ways-of-working.md](ways-of-working.md) | Forma de trabalho — rituais e fluxos |
| [technical-standards.md](technical-standards.md) | Padrões técnicos e links para metodologia |
| [security.md](security.md) | Segurança transversal AIOps |
| [observability.md](observability.md) | Observabilidade — Datadog e práticas |
| [troubleshooting.md](troubleshooting.md) | Troubleshooting transversal |
| [documentation-model.md](documentation-model.md) | Modelo de documentação em 3 níveis |

---

## Packs relacionados

| Pack | Caminho | Confluence (parent) |
| --- | --- | --- |
| Apps (nível 2) | [../aiops-apps/](../aiops-apps/README.md) | [AIOps - Stack](https://loftbr.atlassian.net/wiki/spaces/AIOps/pages/6091309071) |
| Infra Loft | [../loft-infra/](../loft-infra/README.md) | [Infra Loft](https://loftbr.atlassian.net/wiki/spaces/AIOps/pages/6090358809) |
| Observabilidade | [../loft-observability/](../loft-observability/README.md) | (incluído no pack Infra Loft) |
