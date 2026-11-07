# Arquitetura

> Language: pt-BR | [English](../../en/architecture/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Categoria para documentação de arquitetura em projetos em adoção, mais ponteiros para a metodologia definida por este padrão.

## Objetivo

Descrever a estrutura e o comportamento arquitetural do sistema: fronteiras, componentes, comunicação, fluxo de dados, domínios de falha, fronteiras de confiança e trade-offs.

## Orientação

- Documente o **estado atual** primeiro.
- Linke decisões a ADRs em `docs/decisions/`.
- Mantenha propostas rotuladas como Proposed; nunca as apresente como arquitetura existente.
- Prefira diagramas quando esclarecerem relacionamentos.
- Use progressive disclosure — projetos pequenos não precisam de todo tipo de documento ou diagrama.

## Metodologia (Documentation Standard)

| Documento | Propósito |
| --- | --- |
| [../architecture-model.md](../architecture-model.md) | Níveis de documentação (Context → Implementation) e profundidade de audiência (Levels 1–4) |
| [../system-boundaries.md](../system-boundaries.md) | In/out of scope; o que o sistema não controla |
| [../component-relationships.md](../component-relationships.md) | Tipos de relacionamento e direção de dependência rotulada |
| [../architecture-diagrams.md](../architecture-diagrams.md) | Padrões e tipos de diagrama |
| [../diagram-selection.md](../diagram-selection.md) | Qual diagrama responde a qual pergunta |
| [../mermaid-standards.md](../mermaid-standards.md) | Nomenclatura, direção e complexidade Mermaid |
| [../failure-domains.md](../failure-domains.md) | Blast radius, isolamento, recovery |
| [../trust-boundaries.md](../trust-boundaries.md) | Arestas de confiança arquiteturais |
| [../architecture-traceability.md](../architecture-traceability.md) | Links Requirement → … → Implementation |
| [../architecture-vs-implementation.md](../architecture-vs-implementation.md) | Arquitetura vs design vs implementação |
| [../architecture-by-project-type.md](../architecture-by-project-type.md) | Orientação por forma de projeto (não requisitos) |
| [../architecture-checklist.md](../architecture-checklist.md) | Checklist de qualidade |
| [../architecture-review.md](../architecture-review.md) | Quando/quem/o quê/como revisar; status do ciclo de vida |
| [../architecture-drift.md](../architecture-drift.md) | Documentado ≠ real; registrar e tratar |
| [../architecture-debt.md](../architecture-debt.md) | Arquitetura debt vs technical e documentation debt |

## Conteúdos sugeridos do projeto

| Documento | Propósito |
| --- | --- |
| `overview.md` (ou architecture overview) | Visão geral de arquitetura do sistema |
| Docs de arquitetura de componentes | Visões mais profundas quando necessário |
| Diagramas | Mermaid ou outros diagramas baseados em texto |

## Templates

Use [../templates/architecture.md](../templates/architecture.md) e templates de arquitetura relacionados em [../templates/](../templates/) conforme forem adotados pelo projeto.

## Templates relacionados

- [../templates/component.md](../templates/component.md)
- [../templates/diagram.md](../templates/diagram.md)
- [../templates/adr.md](../templates/adr.md)
- [../templates/review-record.md](../templates/review-record.md)
