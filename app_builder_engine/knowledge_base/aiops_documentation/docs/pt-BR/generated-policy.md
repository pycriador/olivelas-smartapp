---
title: "Política de Documentação Gerada"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Política de Documentação Gerada

> Language: pt-BR | [English (EN)](../en/generated-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Artefatos gerados são saídas derivadas. Eles não devem sobrescrever silenciosamente docs narrativos Authoritative.

## Exemplos permitidos de gerados

- Índice de manifest
- Relatórios de health / validação
- Relatórios de dependência / impacto derivados de metadados

## Regras

| Tópico | Política |
| --- | --- |
| Local | [generated/](generated/) e/ou [reports/](reports/) |
| Marcação | Frontmatter `generated: "true"` e banner visível |
| Fonte | Documentada (manifest, resultados de lint) |
| Gerador | `scripts/docs_lint.py` |
| Regeneração | `python3 scripts/docs_lint.py report` |
| Commitado? | Opcional; este repo committa health reports para visibilidade |
| Editável manualmente? | **Não** — altere a fonte e regenere |

## Documentos relacionados

- [automation.md](automation.md)
- [generated/README.md](generated/README.md)
