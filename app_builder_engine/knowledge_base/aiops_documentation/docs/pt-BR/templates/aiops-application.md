---
title: "Nome da aplicação — doc AIOps"
status: "DRAFT"
owner: "aiops"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
---

# Nome da aplicação

> Language: pt-BR | [English (EN)](../../en/templates/aiops-application.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Documentação **as-is** de [loft-br/REPO_NAME](https://github.com/loft-br/REPO_NAME) no catálogo AIOps — **nível 2**. Detalhe técnico nível 3 vive no README do repositório da app.

## Objetivo

<!-- Um parágrafo: o que o produto entrega. -->

## Contexto

<!-- Contexto de negócio/técnico. Classificar claims: Confirmed / Inferred / Unknown. -->

## Usuários / áreas

| Usuário / área | Necessidade |
| --- | --- |
| | |

## Impacto

<!-- O que quebra ou degrada se indisponível. Não inventar SLOs. -->

## Visão geral da arquitetura

<!-- Diagrama curto ou pointer para seção em overview.md. -->

Repo: [loft-br/REPO_NAME](https://github.com/loft-br/REPO_NAME).

```text
<!-- Diagrama ASCII opcional -->
```

Detalhe de layout: [overview.md](../aiops-apps/overview.md#app-slug).

## Principais integrações

| Integração | Papel |
| --- | --- |
| PostgreSQL (RDS) | |
| Kong corp | |
| Vault | |
| Datadog | |

## Stack (resumo)

| Camada | Tecnologia |
| --- | --- |
| Frontend | |
| Backend | |
| Deploy | |

Matrizes: [frontend-stack.md](../aiops-apps/frontend-stack.md) · [backend-stack.md](../aiops-apps/backend-stack.md).

## Nível 3 — documentação técnica (repositório)

Repo: [loft-br/REPO_NAME](https://github.com/loft-br/REPO_NAME).

| Tópico | Link |
| --- | --- |
| README (como executar) | [README](https://github.com/loft-br/REPO_NAME/blob/main/README.md) |
| Backend | [backend/README](https://github.com/loft-br/REPO_NAME/blob/main/backend/README.md) |
| Pasta docs | [docs/](https://github.com/loft-br/REPO_NAME/tree/main/docs) |

## Deploy (padrão Loft)

| Campo | Valor |
| --- | --- |
| Namespace k8s | |
| URL corp | |
| Workflows | `.github/workflows/` |
| Vault path | |

Infra: [loft-infra/overview.md](../loft-infra/overview.md).

## Segurança (resumo)

Pointer: [security.md](../aiops-apps/security.md).

## Relacionados

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [routes.md](../aiops-apps/routes.md)
