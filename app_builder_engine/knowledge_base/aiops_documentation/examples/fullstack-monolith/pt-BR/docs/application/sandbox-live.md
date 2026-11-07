---
title: "Component — sandbox-live (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# sandbox-live

> Language: pt-BR | [English](../../../en/docs/application/sandbox-live.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional.** Stack ilustrativa ≠ padrão do framework.

## Propósito

Documentar a fronteira entre Live (API+DB) e Sandbox (estado no navegador).

## Responsabilidades

| Aspecto | Live | Sandbox | Classification |
| --- | --- | --- | --- |
| Persistência | API + DB | Store local | Confirmed (within example) |
| Seleção | session/local key ilustrativa | idem | Confirmed (within example) |
| Uso | Produção-like | Demo/UX | Confirmed (within example) |

## Notas

Decisão: [../decisions/adr-001-live-sandbox.md](../decisions/adr-001-live-sandbox.md). Sandbox não substitui staging para RBAC real.

## Fora deste componente

Sibling components are named in [../project-overview.md](../project-overview.md) and not re-documented here.

## Classification reminder

Claims marked Confirmed apply **within this fictional example** only. Technology choices remain Proposed (example only) unless stated otherwise.
