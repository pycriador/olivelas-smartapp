---
title: "Segurança da Automação"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Segurança da Automação

> Language: pt-BR | [English (EN)](../en/automation-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Requisitos

- Scripts usam apenas stdlib; sem execução de código arbitrário a partir de Markdown.
- Não imprima valores de secrets — apenas id da regra e localização.
- Não envie documentação a serviços externos sem autorização.
- Tokens de CI: menor privilégio; sem secrets em docs ou logs.
- Valide paths para impedir traversal fora da raiz do repositório.
- Evite interpolação shell de conteúdo de documentos.

## Tratamento de secrets

Se DOC-SEC-001 disparar: trate como comprometido até provar placeholder — rotacione credenciais reais antes de limpar histórico ([práticas de secure-handling](secrets-management.md)).

## Integrações externas

Integrações futuras opcionais (issue tracker, chat, plataforma de IA, portal) **não** são exigidas por este padrão.
