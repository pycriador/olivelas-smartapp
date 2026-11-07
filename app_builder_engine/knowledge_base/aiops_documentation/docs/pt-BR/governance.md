---
title: "Governança da Documentação"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Governança da Documentação

> Language: pt-BR | [English (EN)](../en/governance.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

A governança torna a qualidade da documentação **exigível**, não apenas recomendada.

```text
Standards → Ownership → Lifecycle → Validation → Quality Gates → Exceptions → Audit → Health
```

## Perguntas que a governança responde

| Pergunta | Onde |
| --- | --- |
| Quem pode alterar a documentação? | [documentation-ownership.md](documentation-ownership.md), [governance-roles.md](governance-roles.md) |
| Quem pode aprovar? | [documentation-change-policy.md](documentation-change-policy.md), [review-policy.md](review-policy.md) |
| Quais documentos exigem revisão? | [document-classification.md](document-classification.md), [change-classification.md](change-classification.md) |
| Quais documentos são autoritativos? | [source-of-truth.md](source-of-truth.md), [authority-levels.md](authority-levels.md) |
| Quais mudanças exigem validação? | [quality-gates.md](quality-gates.md), [automation.md](automation.md) |
| O que pode ser automatizado? | [automation.md](automation.md), [validation-rules.md](validation-rules.md) |
| O que exige aprovação humana? | Matriz neste documento + [documentation-change-policy.md](documentation-change-policy.md) |
| Como as exceções são registradas? | [exceptions.md](exceptions.md) |
| Como documentos deprecados são tratados? | [deprecation.md](deprecation.md), [history-model.md](history-model.md) |
| Como conflitos são tratados? | [contradiction-model.md](contradiction-model.md), [contradictions/](contradictions/) |

## Validação automática vs revisão humana

| Tipo | Responsabilidade |
| --- | --- |
| **Machine validation** | Regras objetivas: metadados, IDs, links, sincronização de manifest, exceções expiradas, tokens estruturais de claim |
| **Human review** | Correção semântica: verdade arquitetural, adequação de segurança, segurança operacional, força da evidência, resolução de contradições |

A automação não deve alterar silenciosamente conhecimento Authoritative.

## Workflow oficial

```text
Change → Classify → Identify Impact → Update Documentation → Run Automation
→ Resolve Errors → Review → Approve → Merge → Generate Reports
```

## Responsabilidade automática vs humana

| Atividade | Automação | Humano |
| --- | --- | --- |
| Validação de metadados | Sim | Opcional |
| Validação de links | Sim | Não |
| IDs duplicados | Sim | Não |
| Validação de manifest | Sim | Opcional |
| Consistência semântica | Parcial | Sim |
| Correção de arquitetura | Não | Sim |
| Correção de segurança | Parcial | Sim |
| Atribuição de ownership | Parcial | Sim |
| Validade de evidência | Parcial | Sim |
| Frescor da documentação | Parcial | Sim |
| Resolução de contradições | Não | Sim |
| Aprovação de exceção | Não | Sim |
| Aceite de conteúdo gerado por IA | Parcial | Sim |

## Limites da governança

A automação **não** deve:

- autoaprovar mudanças Critical;
- inventar evidência;
- modificar silenciosamente documentos Authoritative;
- remover histórico;
- ocultar erros;
- excluir exceções sem registro;
- ignorar achados de segurança;
- substituir ownership humano.

## Documentos relacionados

- [principles.md](principles.md) (princípios GV-*)
- [ownership.md](ownership.md)
- [change-policy.md](change-policy.md)
- [automation.md](automation.md)
- [quality-gates.md](quality-gates.md)
- [governance-auditability.md](governance-auditability.md)
