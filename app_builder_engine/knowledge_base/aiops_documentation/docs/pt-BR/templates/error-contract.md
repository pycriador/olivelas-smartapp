---
title: "Contrato de Erros"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
# contract_id: "domain-capability-errors@version"
# related_contract: "path-or-id-of-primary-contract"
---

# Contrato de Erros

> Language: pt-BR | [English (EN)](../../en/templates/error-contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Catálogo de erros agnóstico de tecnologia para um contrato ou família de contratos. **Não** assuma códigos de status HTTP, envelopes REST ou qualquer transporte específico. Marque linhas como **Not Applicable** ou **Unknown** quando faltar evidência. Nunca invente códigos de erro ou garantias de retry.

## Propósito

<!-- A qual contrato ou interface este catálogo de erros pertence, e por que um documento dedicado de erros é necessário. -->

## Contrato relacionado

| Campo | Valor |
| --- | --- |
| Contrato primário | <!-- path or contract_id --> |
| Producer | |
| Consumer(s) | |

## Resumo de erros

| Erro | Condição | Retryable | Ação do consumer |
| --- | --- | --- | --- |
| | | yes / no / Unknown | |
| | | | |
| | | | |

## Catálogo de erros

Documente cada erro por completo. Duplique o bloco conforme necessário.

### Erro — <!-- short name or code -->

| Campo | Valor | Classificação |
| --- | --- | --- |
| Condição | <!-- when this error occurs --> | Confirmed / Inferred / Unknown |
| Identificação | <!-- how the consumer detects it (code, type, flag, exception name, etc.) --> | Confirmed / Inferred / Unknown |
| Code | <!-- machine-readable identifier if any; Not Applicable if none --> | Confirmed / Inferred / Unknown / Not Applicable |
| Message | <!-- stable human-readable message pattern if any; no secrets/PII --> | Confirmed / Inferred / Unknown / Not Applicable |
| Category | <!-- e.g. validation / authn / authz / not-found / conflict / unavailable / internal / business / other --> | Confirmed / Inferred / Unknown |
| Retryability | yes / no / conditional / Unknown | Confirmed / Inferred / Unknown |
| Impacto | <!-- effect on the operation and downstream state --> | Confirmed / Inferred / Unknown |
| Ação esperada | <!-- what the consumer should do --> | Confirmed / Inferred / Unknown |

#### Notas

<!-- Optional: payload shape, correlation fields, escalation path. -->

```text
<!-- representative error example without secrets or sensitive data -->
```

### Erro — <!-- short name or code -->

| Campo | Valor | Classificação |
| --- | --- | --- |
| Condição | | Confirmed / Inferred / Unknown |
| Identificação | | Confirmed / Inferred / Unknown |
| Code | | Confirmed / Inferred / Unknown / Not Applicable |
| Message | | Confirmed / Inferred / Unknown / Not Applicable |
| Category | | Confirmed / Inferred / Unknown |
| Retryability | yes / no / conditional / Unknown | Confirmed / Inferred / Unknown |
| Impacto | | Confirmed / Inferred / Unknown |
| Ação esperada | | Confirmed / Inferred / Unknown |

## Orientação transversal de retry

| Tópico | Valor | Classificação |
| --- | --- | --- |
| Categorias retryable padrão | | Confirmed / Inferred / Unknown / Not Applicable |
| Categorias non-retryable padrão | | |
| Max attempts / backoff | <!-- link to primary contract if defined there --> | |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Contrato primário | |
| Integração | |
| Runbook / troubleshooting | |
| ADR | |
