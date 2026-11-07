---
title: "Componente: worker notify-bridge (Ficcional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "CMP-NB-001"
component_id: "notify-bridge-worker"
type: "Architecture"
---

# Component

> Language: pt-BR | [English](../en/component.md)
>
> **Exemplo ficcional — não é um projeto real.**

## ID

| Field | Value |
| --- | --- |
| Component ID | CMP-NB-001 |
| Canonical name | notify-bridge-worker |
| Service ID (if distinct) | SVC-NB-001 |
| Owner | example-platform-team |

## Purpose

Consumir eventos de domínio do catálogo e entregar notificações a canais configurados com retries limitados.

## Type

| Field | Value |
| --- | --- |
| Kind | worker |
| Deployable | yes |
| Criticality | Medium (exemplo fictício) |

## Responsibilities

| Responsibility | Notes |
| --- | --- |
| Consumir `CatalogItemUpdated` | Via CONTRACT-NB-EVT-001 |
| Entregar notificações outbound | Adaptadores de canal (email/webhook fictícios) |
| Dead-letter de entregas falhas | Após max retries (CLAIM-NB-001) |

## Non-Responsibilities

| Non-responsibility | Owner / elsewhere |
| --- | --- |
| Autorar conteúdo do catálogo | catalog-service |
| UI de preferências do usuário | Fora de escopo / Unknown |

## Technology

| Concern | Choice | Classification |
| --- | --- | --- |
| Language / runtime | Go (exemplo) | Confirmed (exemplo) |
| Framework | — | Not Applicable |
| Datastore | Nenhum para o corpo da mensagem | Confirmed (exemplo) |
| Other | Consumidor de message broker | Confirmed (exemplo) |

## Inputs

| Input | Source | Format / contract |
| --- | --- | --- |
| CatalogItemUpdated | catalog-service | CONTRACT-NB-EVT-001 |

## Outputs

| Output | Destination | Format / contract |
| --- | --- | --- |
| Entrega de notificação | Adaptador de canal | Interno; schema Unknown para payloads do adaptador |

## Dependencies

| Dependency | ID | Purpose | Required | Direction | Classification |
| --- | --- | --- | --- | --- | --- |
| Event broker | external | Consumir eventos | yes | inbound | Confirmed (exemplo) |
| Channel webhook | external | Callback HTTP | no | outbound | Inferred (exemplo) |

## Interfaces

| Interface | Type | Contract ID / document | Authn / Authz notes |
| --- | --- | --- | --- |
| CatalogItemUpdated | event | CONTRACT-NB-EVT-001 | ACL do broker — detalhes Unknown |
| Webhook outbound | API | Not Documented | Nome do secret: `NOTIFY_BRIDGE_WEBHOOK_TOKEN` (fonte: secret store — valor `[REDACTED]`) |

## Data

| Concern | Summary | Classification |
| --- | --- | --- |
| Owned data | Contadores de tentativa (efêmeros) | Confirmed (exemplo) |
| Read data | Campos do payload para roteamento | Confirmed (exemplo) |
| Written data | Registros de DLQ | Inferred (exemplo) |
| Retention / lifecycle | Retenção de DLQ Unknown — ver GAP-NB-001 | Unknown |
| Classification / sensitivity | Pode incluir identificadores de destinatário — tratar como Internal | Confirmed (exemplo) |

## Configuration

| Name | Purpose | Source | Required | Secret |
| --- | --- | --- | --- | --- |
| `NOTIFY_BRIDGE_MAX_ATTEMPTS` | Max de retries de entrega | env | yes | no |
| `NOTIFY_BRIDGE_WEBHOOK_TOKEN` | Credencial do webhook outbound | secret store | yes | yes |

## Security

| Topic | Summary |
| --- | --- |
| Trust boundary involvement | Cruza da rede do broker para provedores de canal |
| Authentication | ACL do broker; token de webhook outbound |
| Authorization | Unknown além da ACL do broker |
| Sensitive data handling | Não logar payloads completos com PII |
| Secrets (references only) | `NOTIFY_BRIDGE_WEBHOOK_TOKEN` |
| Risks | Vazamento de token via logs — mitigado por política de redação (exemplo) |
| Linked security docs | Nenhum neste conjunto de amostras |

## Observability

| Signal | Status | Notes |
| --- | --- | --- |
| Logging | Partial | Logs de resultado de entrega; sem valores secretos |
| Metrics | Implemented | `notify_bridge_delivery_attempts` (nome fictício) |
| Tracing | Not Documented | — |

## Failure Handling

| Failure | Detection | Response | Classification |
| --- | --- | --- | --- |
| Erro retentável do canal | Classe de erro do adaptador | Retry até 3 | Confirmed |
| Retries esgotados | Contador de tentativas | DLQ | Confirmed |
| Destinatário inválido | Erro permanente | Sem retry | Confirmed |

## Operations

| Topic | Notes |
| --- | --- |
| Deployment | Deploy rolling do worker (exemplo) |
| Scaling | Concorrência do consumidor Unknown |
| Health checks | Apenas liveness do processo |
| Migration / rollback | Rollback padrão de deploy |
| Runbooks | Not Documented nesta amostra |
| On-call / escalation | example-platform-team |
| SLIs / SLOs | Unknown / Not Applicable para a amostra |

## Related Documents

| Relation | Document ID | Path |
| --- | --- | --- |
| architecture | ARCH-NB-001 | ../document-metadata/ |
| claim | CLAIM-NB-001 | ../claim/ |
| gap | GAP-NB-001 | ../knowledge-gap/ |
| contradiction | CONTRA-NB-001 | ../contradiction/ |
