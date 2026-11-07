---
title: "Deployment view"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "TPL-DEPLOY-001"
type: "template"
---

# Visão de deploy

> Language: pt-BR | [English](../../en/templates/deployment.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Visão leve de implantação (arc42 §7 opcional). Agnóstica de tecnologia: não assuma cloud, orchestrator ou pipeline específicos. Stacks concretas são do projeto — nunca do padrão. -->

## Propósito

<!-- Como e onde este sistema é implantado em alto nível. -->

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Unidades implantáveis e ambientes | Runbooks detalhados de incidentes (link para ops) |

## Unidades implantáveis

| Unidade | Artefato | Runtime | Classification |
| --- | --- | --- | --- |
| | image / binary / bundle / other | | Confirmed / Inferred / Unknown / Proposed |

## Ambientes

| Ambiente | Propósito | URL / identificador (sem secrets) | Classification |
| --- | --- | --- | --- |
| | | | |

## Pipeline de mudança

| Estágio | O que acontece | Evidence |
| --- | --- | --- |
| Build | | |
| Test | | |
| Deploy | | |

<!-- Sem colar secrets de CI. Preferir `${{ secrets.* }}` / Vault como padrão organizacional, não inventar valores. -->

## Configuração e secrets

| Tipo | Onde vive | Notas |
| --- | --- | --- |
| Config não secreta | | |
| Secrets | | Never inline in docs |

## Health / readiness no deploy

| Check | Path ou sinal | Notes |
| --- | --- | --- |
| | | |

## Rollback / forward-fix

| Estratégia | Status | Notes |
| --- | --- | --- |
| | Implemented / Partial / Unknown / N/A | |

## Relacionados

- Service profile / runbooks
- Observability
- Architecture overview
