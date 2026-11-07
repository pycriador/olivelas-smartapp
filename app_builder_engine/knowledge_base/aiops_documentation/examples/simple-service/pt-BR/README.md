# Exemplo: Serviço Simples (Ficcional)

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

Um serviço pequeno de request/response (metodologia de arquitetura) com:

- visão geral do projeto;
- overview de arquitetura (contexto, sistema, componentes, dependências);
- diagrama opcional de system-context;
- um componente;
- um contrato no estilo HTTP (apenas ilustrativo; HTTP não é exigido pelo padrão);
- um runbook;
- um ADR.

## Como Ler

Comece em [docs/project-overview.md](docs/project-overview.md).

## Estrutura

```text
simple-service/
├── README.md
└── docs/
    ├── project-overview.md
    ├── architecture/
    │   ├── overview.md
    │   └── system-context.md
    ├── application/
    │   └── notification-api.md
    ├── contracts/
    │   └── send-notification.md
    ├── operations/
    │   └── rb-high-error-rate.md
    └── decisions/
        └── adr-001-sync-request-response.md
```
