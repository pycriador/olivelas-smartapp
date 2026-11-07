---
title: "Claim: max de retries de entrega do notify-bridge (Ficcional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "CLAIM-NB-001"
type: "Evidence"
---

# Claim

> Language: pt-BR | [English](../en/claim.md)
>
> **Exemplo ficcional — não é um projeto real.**

Registra uma única afirmação técnica com evidência e classificação.

Política: [claims.md](../../../docs/pt-BR/claims.md), [evidence-model.md](../../../docs/pt-BR/evidence-model.md).

## ID

| Field | Value |
| --- | --- |
| Claim ID | CLAIM-NB-001 |
| Document / scope | ARCH-NB-001 / CMP-NB-001 |
| Owner | example-platform-team |

## Statement

O notify-bridge retenta uma entrega de notificação outbound com falha no máximo **3** vezes com backoff exponencial antes de rotear para o caminho de dead-letter.

## Classification

| Field | Value |
| --- | --- |
| Classification | Confirmed |
| Confidence | High |
| Authority of sources | Authoritative |

## Evidence

| Source | Kind | Path / ID | Notes |
| --- | --- | --- | --- |
| Constante de retry | code | `src/notify-bridge/delivery/retry.go` (caminho fictício) | `MaxAttempts = 3` |
| Defaults do worker | config | Nome: `NOTIFY_BRIDGE_MAX_ATTEMPTS` (fonte: env — valor não é secret) | Default documentado `3` |
| Teste unitário | test | `src/notify-bridge/delivery/retry_test.go` (fictício) | Afirma parada após 3 falhas |

## Scope

| Field | Value |
| --- | --- |
| System / component | notify-bridge / CMP-NB-001 |
| Applies when | Entrega ao canal retorna falha retentável |
| Does not apply when | Rejeição permanente (ex.: destinatário inválido) — sem retry |
| Time scope | Current |

## Related

| Relation | Target ID / path |
| --- | --- |
| supports | ARCH-NB-001 |
| contradicts | CONTRA-NB-001 (conflito aberto com nota ops antiga) |
| related_to | GAP-NB-001 |

## Notes

CONTRA-NB-001 registra uma página ops antiga que ainda diz “5 retries”. Não escolher vencedor silenciosamente nas respostas até resolver.
