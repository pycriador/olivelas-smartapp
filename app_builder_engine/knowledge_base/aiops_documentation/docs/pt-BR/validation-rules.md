---
title: "Registro de Regras de Validação"
status: "REVIEW"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-17"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Registro de Regras de Validação

> Language: pt-BR | [English (EN)](../en/validation-rules.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

Cada regra tem: Rule ID, Name, Description, Severity, Scope, Automatable, Exception Allowed.

| Rule ID | Nome | Severidade | Automatizável | Exceção |
| --- | --- | --- | --- | --- |
| DOC-META-001 | Docs Authoritative devem definir owner | ERROR | Yes | Yes |
| DOC-META-002 | Token de status deve ser permitido | ERROR | Yes | No |
| DOC-META-003 | Token de authority reconhecido | WARNING | Yes | Yes |
| DOC-OWN-001 | Frontmatter ACCEPTED deve ter owner | WARNING | Yes | Yes |
| DOC-ID-001 | Entrada de manifest tem id | ERROR | Yes | No |
| DOC-ID-002 | IDs duplicados na árvore de idioma / manifest | ERROR | Yes | No |
| DOC-ID-003 | Id do frontmatter corresponde ao manifest | WARNING | Yes | Yes |
| DOC-ID-004 | ID corresponde ao padrão esperado | WARNING | Yes | Yes |
| DOC-MAN-001 | Arquivo de manifest existe | ERROR | Yes | No |
| DOC-MAN-003 | Entrada de manifest tem path | ERROR | Yes | No |
| DOC-MAN-004 | Path do manifest existe no disco | ERROR | Yes | No |
| DOC-MAN-005 | Arquivo não listado no manifest | INFO | Yes | Yes |
| DOC-LINK-001 | Alvo de link Markdown interno existe | ERROR | Yes | Yes |
| DOC-LINK-002 | Link não deve escapar a raiz do repo | ERROR | Yes | No |
| DOC-LINK-003 | Sem caminhos nus `../../…/*.md` na prosa (2+ `../`) | ERROR | Yes | Yes |
| DOC-REL-001 | Source/target de relacionamento resolve | ERROR | Yes | Yes |
| DOC-FRESH-001 | Doc Authoritative pode estar obsoleto | WARNING | Yes | Yes |
| DOC-EXC-001 | Exceção após expiration ainda aberta | ERROR | Yes | No |
| DOC-AI-001 | Entrada de AI context existe | ERROR | Yes | No |
| DOC-SEC-001 | Possível material de secret | ERROR | Yes | No* |
| DOC-CLAIM-001 | Token de status de claim válido | ERROR | Yes | Yes |

\* Achados de secret exigem remediação ou redação; não “excepcione” credenciais reais — rotacione primeiro.

Use [templates/validation-rule.md](templates/validation-rule.md) para adicionar regras.

Modelo de severidade: **ERROR** bloqueia CI; **WARNING** passa com atenção; **INFO** é consultivo.
