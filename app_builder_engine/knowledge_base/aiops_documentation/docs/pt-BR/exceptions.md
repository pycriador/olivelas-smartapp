---
title: "Exceções da Documentação"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Exceções da Documentação

> Language: pt-BR | [English (EN)](../en/exceptions.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Nenhuma regra pode ser ignorada silenciosamente. Exceções são explícitas, com owner e com prazo quando temporárias.

## Campos obrigatórios

| Campo | Significado |
| --- | --- |
| ID | ex.: `EXC-DOC-001` |
| Rule | Id da regra de validação |
| Reason | Por que é necessária |
| Scope | Paths / docs cobertos |
| Owner | Time responsável |
| Expiration | `YYYY-MM-DD` para exceções temporárias |
| Approval | Papel do aprovador |
| Status | `OPEN` / `APPROVED` / `EXPIRED` / `CLOSED` |

## Expiração

Exceções temporárias tornam-se **EXPIRED** após a data. A automação emite **DOC-EXC-001** se ainda estiverem abertas.

## Armazenamento

Coloque registros em [exceptions/](exceptions/). Use [templates/exception.md](templates/exception.md).

## Documentos relacionados

- [false-positives.md](false-positives.md)
- [validation-rules.md](validation-rules.md)
