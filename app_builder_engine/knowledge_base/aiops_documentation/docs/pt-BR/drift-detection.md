---
title: "Detecção de Drift Documental"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Detecção de Drift Documental

> Language: pt-BR | [English (EN)](../en/drift-detection.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Drift significa estado documentado ≠ estado do repositório/sistema.

```text
Documentation ≠ Repository State
```

Distinto de [security-drift.md](security-drift.md) e drifts de domínio ([architecture-drift.md](architecture-drift.md), [documentation-drift.md](documentation-drift.md)).

## Sinais automatizáveis

| Sinal | Detecção |
| --- | --- |
| Arquivo referenciado ausente | Checagens de link / manifest |
| Path obsoleto no manifest | DOC-MAN-004 |
| Path relativo quebrado | DOC-LINK-001 |
| Exceção expirada ainda aberta | DOC-EXC-001 |
| Data de revisão obsoleta | DOC-FRESH-001 (WARNING) |

## Sinais humanos

| Sinal | Tratamento |
| --- | --- |
| Componente removido mas ainda descrito | Contradição / dívida |
| Comportamento de endpoint mudou | Revisão de contrato |
| Time owner renomeado | Atualização de ownership |
| Passos de runbook incorretos | Revisão de ops após incidente |

A automação lembra; humanos decidem as atualizações.
