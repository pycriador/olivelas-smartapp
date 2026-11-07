---
title: "Modelo de Ownership da Documentação"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Modelo de Ownership da Documentação

> Language: pt-BR | [English (EN)](../en/documentation-ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Estende [ownership.md](ownership.md) com papéis de governança sobre quem pode propor, manter e aprovar documentação.

## Papéis

| Papel | Responsabilidade |
| --- | --- |
| **Owner** | Responsável pela precisão e atualidade do conteúdo |
| **Reviewer** | Revisa precisão técnica / operacional / de segurança |
| **Maintainer** | Responsável pela estrutura, padrões e tooling da documentação |
| **Contributor** | Propõe mudanças (humano ou agente de IA sob direção humana) |

Os papéis podem ser exercidos pelo mesmo time. Prefira IDs duráveis de time/papel a nomes pessoais nos metadados.

## Expectativas

| Classe de documento | Owner | Reviewer |
| --- | --- | --- |
| Authoritative | Obrigatório | Obrigatório para mudança material |
| Operational | Obrigatório | Revisão operacional |
| Segurança-Sensitive | Obrigatório | Revisão de segurança |
| Informational | Recomendado | Opcional |
| Historical / Deprecated | Último owner conhecido retido | Opcional |

## Ownership desconhecido

Não invente owners. Registre Unknown e abra um knowledge gap ou item de dívida de ownership.

## Documentos relacionados

- [ownership.md](ownership.md)
- [ownership-matrix.md](ownership-matrix.md)
- [governance-roles.md](governance-roles.md)
