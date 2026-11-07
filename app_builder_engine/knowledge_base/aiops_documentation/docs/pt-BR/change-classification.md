---
title: "Classificação de Mudanças"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Classificação de Mudanças

> Language: pt-BR | [English (EN)](../en/change-classification.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Classifique mudanças de documentação (e que impactam docs) por impacto.

| Nível | Significado | Exemplos |
| --- | --- | --- |
| **Low** | Editorial / não semântico | Typos, formatação, texto de link |
| **Medium** | Mudança de comportamento documentado | Clarificar semântica de retry, atualizar texto de meta de SLO |
| **High** | Mudança arquitetural, contratual ou operacional | Novo limite de componente, campo de contrato, passos de runbook |
| **Critical** | Impacto material em segurança, disponibilidade ou integridade | Mudança de authn/authz, tratamento de secrets, caminho de recuperação |

## Mapeamento para gates

| Nível | Validação | Revisão humana |
| --- | --- | --- |
| Low | Lint | Opcional |
| Medium | Lint + revisão direcionada | Recomendada |
| High | Lint + revisão de domínio | Obrigatória |
| Critical | Lint + security/ops conforme aplicável | Obrigatória |

Veja [change-impact-matrix.md](change-impact-matrix.md).
