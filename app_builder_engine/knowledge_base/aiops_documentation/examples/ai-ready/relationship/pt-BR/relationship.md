---
title: "Relacionamento: ARCH-NB-001 documents CONTRACT-NB-EVT-001 (Ficcional)"
status: "ACCEPTED"
owner: "example-platform-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
id: "REL-NB-001"
type: "Reference"
---

# Document Relationship

> Language: pt-BR | [English](../en/relationship.md)
>
> **Exemplo ficcional — não é um projeto real.**

## ID

| Field | Value |
| --- | --- |
| Relationship ID | REL-NB-001 |
| Status | Active |

## Endpoints

| Role | Document ID | Path / title |
| --- | --- | --- |
| From | ARCH-NB-001 | Overview de Arquitetura do Notify-Bridge |
| To | CONTRACT-NB-EVT-001 | Contrato de evento CatalogItemUpdated (fictício) |

## Relationship

| Field | Value |
| --- | --- |
| Type | documents |
| Direction | Directed |
| Strength | Required |
| Classification | Confirmed |

## Rationale

O overview de arquitetura afirma que o notify-bridge consome `CatalogItemUpdated` conforme CONTRACT-NB-EVT-001. O link é explícito para a navegação de IA não depender só de prosa.

## Impact Notes

| Change on From | Expected effect on To |
| --- | --- |
| Remover descrição do consumidor | Revisar se o contrato ainda tem consumidor documentado |
| Mudar retry / DLQ | Pode exigir docs de ops; schema do contrato inalterado salvo mudança de payload |

## Related Documents

| Document | Path |
| --- | --- |
| Claim (retries) | ../claim/ |
| Component | ../component/ |
