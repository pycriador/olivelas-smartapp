---
title: "ADR-001 — Live/Sandbox modes (Fictional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# ADR-001 — Live / Sandbox

> Language: pt-BR | [English](../../../en/docs/decisions/adr-001-live-sandbox.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
>
> **Exemplo ficcional / Fictional example.**

## Status
Accepted (within fictional example) — document lifecycle permanece `DRAFT`.

## Contexto
A UI precisa permitir exploração/demo sem depender do banco, e operação real contra a API.

## Decisão
Manter dois modos no cliente:
- **Live** — API + persistência
- **Sandbox** — estado local com seed/mock

## Consequências
| Positiva | Negativa |
| --- | --- |
| Demos offline rápidas | Risco de divergência Live vs Sandbox |
| Onboarding visual | Testes de RBAC real exigem Live |

## Alternativas
| Alternativa | Notas | Classification |
| --- | --- | --- |
| Apenas Live | Mais simples; perde demos | Inferred |
| Feature flags server-side | Não no exemplo | Unknown |

## Relacionados
[../application/sandbox-live.md](../application/sandbox-live.md)

