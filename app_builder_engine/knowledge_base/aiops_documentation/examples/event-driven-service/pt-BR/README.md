# Exemplo: Serviço Orientado a Eventos (Ficcional)

> Language: pt-BR | [English](../en/README.md)
>
> **Este é um exemplo ficcional** para demonstrar o padrão de documentação.
>
> Não descreve um projeto, serviço ou ambiente real.
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## O Que Este Exemplo Demonstra

Um serviço orientado a eventos (metodologia de arquitetura) com:

- visão geral do projeto;
- arquitetura com producers, consumers, eventos e limites assíncronos;
- diagrama de sequência para inventory adjust;
- diagrama de estados para apply da projeção;
- um componente worker;
- um contrato de evento (não HTTP);
- um documento de integração;
- um guia de troubleshooting;
- um ADR.

## Como Ler

Comece em [docs/project-overview.md](docs/project-overview.md).

## Estrutura

```text
event-driven-service/
├── README.md
└── docs/
    ├── project-overview.md
    ├── architecture/
    │   ├── overview.md
    │   ├── sequence-inventory-adjust.md
    │   └── state-projection.md
    ├── application/
    │   ├── inventory-projector.md
    │   └── integration-inventory-adjusted.md
    ├── contracts/
    │   └── inventory-adjusted.md
    ├── operations/
    │   └── troubleshooting.md
    └── decisions/
        └── adr-001-async-projection.md
```
