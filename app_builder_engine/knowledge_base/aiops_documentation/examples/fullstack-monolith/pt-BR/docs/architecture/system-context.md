---
title: "System context — SheetLedger (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Contexto do sistema

> Language: pt-BR | [English](../../../en/docs/architecture/system-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional.** Stack ilustrativa ≠ padrão do framework.

## Propósito

Posicionar o SheetLedger no ecossistema: quem o usa, do que depende e o que fica fora da fronteira.

## Sistema

| Campo | Valor |
| --- | --- |
| Nome | SheetLedger (ficcional) |
| Purpose | Workspace governado de planilhas |
| Owner | example-team |
| Boundary summary | FE + API + DB; storage e HTTP na edge |

## Usuários

| Usuário | Necessidade | Interação |
| --- | --- | --- |
| Admin / GroupAdmin / Editor / Viewer | Operar UI conforme RBAC ilustrativo | Browser → frontend |
| Operador DataOps | Comparar/conciliar projetos | UI DataOps |

## Consumidores

| Consumidor | O que consomem | Contrato |
| --- | --- | --- |
| Integrações M2M | REST JSON autenticado | [../contracts/rest-api.md](../contracts/rest-api.md) |
| Frontend Live | Mesma API | REST |

## Sistemas externos

| Sistema | Papel | Direção | Classification |
| --- | --- | --- | --- |
| Object storage (Drive-like) | Binários de evidência | outbound | Confirmed (within example) |
| HTTP configurável | Fonte de import | outbound | Confirmed (within example) |
| AWS S3 | Provider | — | Proposed |

## Dependências

| Dependência | Tipo | Propósito | Classification |
| --- | --- | --- | --- |
| PostgreSQL ilustrativo | runtime | Metadados + dados tipados | Proposed (example only) |
| Processo API (ex. Gunicorn) | runtime | Serve HTTP | Proposed (example only) |
| Build frontend (ex. Vite) | build | Bundle UI | Proposed (example only) |

## Trust boundaries

| Boundary | Dentro | Fora |
| --- | --- | --- |
| Browser | Sandbox state, JWT em memória / refresh cookie | — |
| API process | Validação JWT/token, rate limit, ORM | DB, storage, HTTP |
| Storage credentials | Config criptografada ilustrativa | JSON de conta nunca enviado ao browser |

## Relacionados

- [overview.md](overview.md)
- [../application/sandbox-live.md](../application/sandbox-live.md)
- [../contracts/object-storage.md](../contracts/object-storage.md)
