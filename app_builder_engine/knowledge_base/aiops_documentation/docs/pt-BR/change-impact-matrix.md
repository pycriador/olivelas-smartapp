---
title: "Matriz de Impacto de Mudanças"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Matriz de Impacto de Mudanças

> Language: pt-BR | [English (EN)](../en/change-impact-matrix.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

| Tipo de mudança | Validação obrigatória | Revisão obrigatória | Também avaliar |
| --- | --- | --- | --- |
| Mudança de arquitetura | Lint estrutural; checklist de arquitetura | Arquitetura | Contratos, Operações, Segurança, ADRs |
| Mudança de API / contrato | Lint; checklist de contrato | Technical / contract owner | Consumers, Segurança, Ops, Tests |
| Mudança operacional | Lint; ops readiness | Operational | Runbooks, Alerts, Recovery |
| Mudança de segurança | Lint; checklist de segurança | Segurança | Threats, Controls, Contratos, Ops |
| Mudança de AI-context / manifest | Lint; regras de AI readiness | Maintainer + domínio conforme necessário | Navigation, evidence, relationships |
| Somente editorial | Lint | Opcional | — |

Integre com [change-policy.md](change-policy.md) e [change-impact.md](change-impact.md).
