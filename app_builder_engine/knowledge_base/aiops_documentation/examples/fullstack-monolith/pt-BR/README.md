# Exemplo: Monólito Fullstack (Ficcional) — SheetLedger

> Language: pt-BR | [English](../en/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> **Exemplo ficcional / ilustrativo.** Não descreve um projeto, serviço, ambiente ou stack oficiais reais.
>
> A stack tecnológica abaixo é **apenas uma sugestão ilustrativa** inspirada em um projeto isolado de referência.
> **Não** é o padrão do framework, **não** é o guia definitivo de adoção e **não** substitui as metodologias em `docs/`.
>
> O Padrão de Documentação de Engenharia permanece **agnóstico de tecnologia**.


## Nome ficcional

**SheetLedger** — workspace ficcional para ingestão, transformação e entrega governada de planilhas, com UI web e API no mesmo repositório.

## O que este exemplo implementa (detalhado)

Este pacote documental demonstra, ponta a ponta, como um adotante pode estruturar docs para um monólito FE+API+DB:

1. **project-overview** — propósito, escopo, não-objetivos, componentes, dependências, glossário.
2. **architecture/overview + system-context** — fronteira do sistema, atores, trust boundaries, dual-schema de dados (ilustrativo).
3. **application/** — componentes: `frontend-app`, `backend-api`, `project-pipeline`, `storage-and-files`, `data-ops`, `catalog-and-people`, `sandbox-live`.
4. **contracts/** — REST (com OpenAPI stub), File (CSV/XLSX), Integration (object storage), Auth tokens / service accounts, canonical ingest.
5. **security/** — overview de authn/authz + ponte para RBAC ilustrativo.
6. **operations/** — service-profile (com owner/on-call exigindo Unknown se vazio), observability honesta, 2 runbooks.
7. **decisions/** — ADR de modos Live/Sandbox.
8. **ai-context + knowledge-gaps** — entrada AI-ready e gaps explícitos.
9. **Stack card sugerida** — tabela tecnológica **não normativa** (ver overview).

## Como ler

Comece em [docs/project-overview.md](docs/project-overview.md).

## Estrutura

```text
fullstack-monolith/
├── README.md
├── en/docs/...
└── pt-BR/docs/
    ├── project-overview.md
    ├── ai-context.md
    ├── knowledge-gaps.md
    ├── architecture/
    ├── application/
    ├── contracts/
    ├── security/
    ├── operations/
    └── decisions/
```

## Relacionados (metodologia do padrão)

- [adoption-path.md](../../../docs/pt-BR/adoption-path.md)
- [flat-docs-migration.md](../../../docs/pt-BR/flat-docs-migration.md)
- [templates/deployment.md](../../../docs/pt-BR/templates/deployment.md)
