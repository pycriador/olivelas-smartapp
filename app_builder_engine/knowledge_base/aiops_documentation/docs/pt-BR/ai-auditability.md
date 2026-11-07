# Auditabilidade da IA

> Language: pt-BR | [English](../en/ai-auditability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Tornar mudanças e respostas de documentação assistidas por IA reconstruíveis.

## O que registrar

| Item | Example |
| --- | --- |
| Task | “Update contract after field add” |
| Inputs loaded | `ai-context.md`, `CONTRACT-001`, schema path |
| Evidence used | file paths, ADR ids, dates |
| Classifications applied | Confirmed/Inferred/… |
| Outputs touched | paths + diff summary |
| Validation | ERROR/WARNING list |
| Human decisions | acceptance, deferrals |

## Regras

1. Prefira o histórico do repositório (descrições de PR, commits) como trilha de auditoria durável.
2. Não armazene secrets em notas de auditoria.
3. Linke ids de contradição/debt ao adiar.
4. Distinga mudanças de status sugeridas por IA das aceitas por humanos.

## Documentos relacionados

- [ai-documentation-workflow.md](ai-documentation-workflow.md)
- [changelog-policy.md](changelog-policy.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
