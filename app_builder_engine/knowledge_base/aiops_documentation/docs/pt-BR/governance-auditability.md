---
title: "Auditabilidade de Governança"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Auditabilidade de Governança

> Language: pt-BR | [English (EN)](../en/governance-auditability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Rastreabilidade para **eventos de governança da documentação**. Distinta da auditabilidade de segurança ([auditability.md](auditability.md)) e da auditoria de mudanças de IA ([ai-auditability.md](ai-auditability.md)).

## Eventos auditáveis

- documentação criada / modificada / deprecada;
- validação executada / falhou;
- exceção criada / aprovada / expirada;
- documento autoritativo alterado;
- política de governança ou validation-config alterada;
- relatórios gerados produzidos.

## Mecanismos

| Evento | Mecanismo |
| --- | --- |
| Mudança de conteúdo | Histórico Git + PR |
| Proposta de mudança de docs | [templates/documentation-change.md](templates/documentation-change.md) |
| Mudança assistida por IA | [templates/ai-change-record.md](templates/ai-change-record.md) |
| Exceção | [exceptions/](exceptions/) |
| Validação | Logs de CI + [reports/](reports/) |

Reutilize templates de change-record existentes; não invente um repositório paralelo de auditoria.
