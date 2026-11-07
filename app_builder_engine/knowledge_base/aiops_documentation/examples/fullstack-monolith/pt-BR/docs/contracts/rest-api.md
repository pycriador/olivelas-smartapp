---
title: "Contract — rest-api (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
contract_type: "API"
---

# rest-api

> Language: pt-BR | [English](../../../en/docs/contracts/rest-api.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional.** Não é contrato de produção. Stack ilustrativa ≠ padrão.

## Propósito
Contrato HTTP síncrono entre clientes (frontend Live, M2M) e `backend-api`.

## Escopo
| No escopo | Fora do escopo |
| --- | --- |
| Recursos sob `/api` e `/api/v1` | Eventos assíncronos / filas (N/A) |
| Envelope `{ ok, data\|error }` | GraphQL |

## Participantes
| Participante | Papel | Classification |
| --- | --- | --- |
| frontend-app / M2M | consumer | Confirmed (within example) |
| backend-api | producer | Confirmed (within example) |

## Versionamento
Caminhos canônicos `/api/v1/...`, alias `/api/...`, rewrite ilustrativo `/api/v1` → `/api`.

## Spec
Stub: [openapi.yaml](openapi.yaml) — **não** é schema de produção real.

## Autenticação
JWT usuário, API token, service-account JWT — ver contratos de auth irmãos.

## Rate limit / audit
Rate limit ilustrativo; audit de negócio vs logs técnicos separados.

