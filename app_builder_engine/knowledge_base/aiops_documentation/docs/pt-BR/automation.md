---
title: "Automação da Documentação"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Automação da Documentação

> Language: pt-BR | [English (EN)](../en/automation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Arquitetura conceitual de automação para validação documental no repositório.

```text
Documentation → Parser → Rules → Validation → Report → Quality Gate
```

## Princípios

1. Prefira regras objetivas e automatizáveis.
2. Local e CI usam a **mesma** ferramenta e config.
3. Não chame serviços externos por padrão.
4. Nunca execute conteúdo arbitrário de documentos.
5. Saídas geradas são claramente marcadas ([generated-policy.md](generated-policy.md)).

## Categorias de validação

| Categoria | Exemplos |
| --- | --- |
| Structure | Seções obrigatórias quando templates as declaram |
| Metadata | Enums de status, owner, authority |
| Links | Alvos relativos Markdown quebrados |
| References | Paths de manifest, alvos de relacionamento |
| Manifest | Entradas ausentes/duplicadas |
| Relationships | Existência de source/target |
| Consistência | Unicidade de ID por árvore de idioma |
| Segurança | Scan de padrões de secret (sem logar valores) |
| Frescor | Datas obsoletas → WARNING |
| Ownership | Authoritative sem owner → ERROR |
| Prontidão para IA | `ai-context.md` presente |

## Implementação neste repositório

| Peça | Local |
| --- | --- |
| Linter | [../../scripts/docs_lint.py](../../scripts/docs_lint.py) |
| Config | [../validation-config.yaml](../validation-config.yaml) |
| Registro de regras | [validation-rules.md](validation-rules.md) |
| Comandos | [automation-commands.md](automation-commands.md) |
| Segurança | [automation-security.md](automation-security.md) |

## Documentos relacionados

- [quality-gates.md](quality-gates.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
