---
title: "Claim"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "CLAIM-XXX"
type: "Evidence"
---

# Claim

> Language: pt-BR | [English (EN)](../../en/templates/claim.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Registre uma única afirmação técnica com evidência e classificação. Prefira uma claim por registro quando a afirmação for material para IA ou revisão.

Política: [claims.md](../claims.md), [evidence-model.md](../evidence-model.md).

## ID

| Campo | Valor |
| --- | --- |
| Claim ID | CLAIM-XXX |
| Documento / escopo | <!-- parent doc id or path --> |
| Owner | |

## Afirmação

<!-- Uma asserção precisa. Somente estado atual, a menos que a Classificação seja Proposed. -->

## Classificação

| Campo | Valor |
| --- | --- |
| Classificação | Confirmed / Inferred / Unknown / Proposed / Deprecated |
| Confiança | High / Medium / Low / Unknown |
| Autoridade das fontes | Authoritative / Verified / Informational / Reference / Historical / Draft / Unknown |

<!-- Never treat Inferred as Confirmed. Deprecated means the claim is no longer current. -->

## Evidência

| Fonte | Kind | Path / ID | Notas |
| --- | --- | --- |
| | code / config / test / contract / ADR / runtime / doc / other | | |

## Escopo

| Campo | Valor |
| --- | --- |
| Sistema / componente | |
| Aplica-se quando | |
| Não se aplica quando | |
| Escopo temporal | Current / Historical / Unknown |

## Relacionados

| Relação | Target ID / path |
| --- | --- |
| supports / contradicts / depends_on / supersedes / related_to | |

## Notas

<!-- Lacunas, interpretações alternativas, follow-ups. Não invente fatos. -->
