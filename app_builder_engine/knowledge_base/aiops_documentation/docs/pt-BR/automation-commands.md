---
title: "Comandos de Automação"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Comandos de Automação

> Language: pt-BR | [English (EN)](../en/automation-commands.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Todos os comandos compartilham [../validation-config.yaml](../validation-config.yaml) e [../../scripts/docs_lint.py](../../scripts/docs_lint.py).

Códigos de saída: `0` PASS, `1` VALIDATION FAILURE, `2` TOOL ERROR.

| Comando | Propósito | Efeitos colaterais | CI |
| --- | --- | --- | --- |
| `docs:lint` / `docs:validate` | Validação completa | Nenhum | Sim |
| `docs:check-links` | Somente checagem de links | Nenhum | Opcional |
| `docs:check-manifest` | Somente checagem de manifest | Nenhum | Opcional |
| `docs:health` | Validação + grava relatório de saúde | Grava reports | Opcional |
| `docs:report` | Health + índice de manifest | Grava generated/ | Opcional |
| `docs:index` | Somente índice de manifest | Grava generated/ | Opcional |

### Shell

```bash
python3 scripts/docs_lint.py lint
python3 scripts/docs_lint.py validate
python3 scripts/docs_lint.py check-links
python3 scripts/docs_lint.py check-manifest
python3 scripts/docs_lint.py health
python3 scripts/docs_lint.py report
```

Aliases Make (opcional): veja o `Makefile` do repositório.

### Campos do contrato

Cada comando:

- **Input**: árvore do repo + config
- **Output**: findings no stdout; reports para health/report
- **Exit code**: conforme acima
- **Side effects**: apenas `health`, `report`, `index` gravam arquivos em `docs/*/reports` e `docs/*/generated`
