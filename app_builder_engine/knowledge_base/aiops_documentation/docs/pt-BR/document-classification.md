---
title: "Classificação de Documento (Controle)"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Classificação de Documento (Controle)

> Language: pt-BR | [English (EN)](../en/document-classification.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

A classificação de controle determina com que rigor um documento é governado. Distinta da classificação de claim (`Confirmed` / `Inferred` / …) e da classificação de dados de segurança.

| Classe | Significado | Nível de controle |
| --- | --- | --- |
| **Informational** | Contexto útil; não é SoT | Low |
| **Operational** | Usado para operar ou recuperar | High |
| **Authoritative** | Fonte de verdade de um domínio | Highest |
| **Segurança-Sensitive** | Conteúdo relevante para segurança (ainda sem segredos) | Highest |
| **Historical** | Estado passado; não é atual | Medium (rotular claramente) |
| **Deprecated** | Substituído; não usar como primário | Medium |

## Regras

1. Mudanças Authoritative e Segurança-Sensitive exigem review conforme [documentation-change-policy.md](documentation-change-policy.md).
2. Historical/Deprecated devem permanecer distinguíveis ([history-model.md](history-model.md)).
3. A classificação pode aparecer em `tags` de metadados ou na prosa; a autoridade usa o campo `authority`.

## Documentos Relacionados

- [authority-levels.md](authority-levels.md)
- [source-of-truth.md](source-of-truth.md)
