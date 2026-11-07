---
title: "Política de Mudança da Documentação (Governança)"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Política de Mudança da Documentação (Governança)

> Language: pt-BR | [English (EN)](../en/documentation-change-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Estende [change-policy.md](change-policy.md) com validação, aprovação, evidência e gatilhos de ADR para documentação governada.

## Quando a validação é obrigatória

Execute `docs:validate` (veja [automation-commands.md](automation-commands.md)) para qualquer mudança que toque:

- `docs/**`
- `examples/**` (quando projetos adotantes os usam como amostras de SoT)
- `docs/validation-config.yaml`
- `scripts/docs_lint.py`
- manifests

## Quando revisão / aprovação é obrigatória

| Gatilho | Revisão |
| --- | --- |
| Mudança de conteúdo Authoritative | Domain owner / reviewer |
| Mudança Segurança-Sensitive | Revisão de segurança |
| Mudança de procedimento operacional | Revisão de operations |
| Mudança de regra de validação / gate | Repository maintainer (+ nota de impacto) |
| Criar/aprovar exceção | Exception approver |
| Edição Authoritative proposta por IA | Aceite humano obrigatório |

## Quando evidência é obrigatória

Claims materiais que passam a Confirmed precisam de referências de evidência ([claims.md](claims.md)).

## Quando changelog / ADR é obrigatório

| Gatilho | Artefato |
| --- | --- |
| Bump de versão do padrão | [versioning.md](versioning.md) + README raiz |
| Decisão de arquitetura | ADR |
| Mudança breaking do padrão documental | Notas de migração ([migration-policy.md](migration-policy.md)) |

## Documentos relacionados

- [change-policy.md](change-policy.md)
- [change-classification.md](change-classification.md)
- [quality-gates.md](quality-gates.md)
- [templates/documentation-change.md](templates/documentation-change.md)
- [templates/ai-change-record.md](templates/ai-change-record.md)
