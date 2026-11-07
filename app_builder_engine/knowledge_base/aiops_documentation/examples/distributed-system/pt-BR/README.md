# Exemplo: Sistema Distribuído (Ficcional)

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

Um sistema multi-serviço no estilo de fulfillment de pedidos (metodologia de arquitetura) com:

- visão geral do projeto atravessando limites de serviço;
- overview de arquitetura (limite do sistema, serviços, domínios de confiança/falha);
- documentação de fluxo de dados;
- dois componentes de aplicação resumidos;
- um contrato de evento assíncrono;
- um ADR para fulfillment assíncrono.

## Como Ler

Comece em [docs/project-overview.md](docs/project-overview.md).

## Estrutura

```text
distributed-system/
├── README.md
└── docs/
    ├── project-overview.md
    ├── architecture/
    │   ├── overview.md
    │   └── data-flow.md
    ├── application/
    │   ├── order-api.md
    │   └── fulfillment-worker.md
    ├── contracts/
    │   └── order-accepted.md
    └── decisions/
        └── adr-001-async-fulfillment.md
```
