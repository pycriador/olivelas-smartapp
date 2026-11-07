# Segurança de Contratos

> Language: pt-BR | [English](../en/contract-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar **expectativas de segurança nas boundaries de contratos técnicos** — sem duplicar schemas, catálogos de error ou prosa completa de contract.

Regras canônicas de interface vivem em documentos de contract ([contract-model.md](contract-model.md), [contracts/README.md](contracts/README.md)). Esta metodologia define quais tópicos de segurança pertencem a esses contracts e como docs de segurança devem cross-referenciá-los.

## Tópicos a cobrir (quando aplicável)

| Topic | Question | Notes |
| --- | --- | --- |
| **Authentication** | Como o caller/principal é estabelecido? | Resumo do mecanismo; sem OAuth/JWT assumidos |
| **Authorization** | O que o principal pode fazer via este contract? | Linke roles/policies; marque Unknown se unclear |
| **Sensitive data** | Quais fields/classes são sensíveis? | Classification; nunca sample de secrets/PII reais |
| **Encryption** | O que é protegido in transit / at rest nesta interface? | Ou **Not Defined** / N/A |
| **Validation** | Qual validação de input/output é exigida para safety? | Linke schema validation — não cole schemas completos |
| **Abuse considerations** | Como a interface pode ser misused? | Notas de threat na boundary |
| **Rate limits / quotas** | Limits de abuse ou capacity fazem parte do contract? | Documente só se Defined; senão Unknown / N/A |

Marque seções **Not Applicable** quando o tipo de contract não as precisar. Não assuma HTTP.

## Regras de cross-reference

| Do | Do not |
| --- | --- |
| Coloque regras de authn/authz/sensitive-field no **contract canônico** | Copiar o contract inteiro em docs de segurança |
| Linke contracts de [security-architecture.md](security-architecture.md) e threat models | Inventar endpoints, tokens ou permissions |
| Alinhe notas de abuse/rate-limit a [timing-contract.md](timing-contract.md) / capacity quando relevante | Inventar rate limits para parecer “completo” |
| Classifique claims Confirmed / Inferred / Unknown / Proposed | Apresentar regras de segurança Proposed como current |

## Placement no doc de contract

Prefira uma seção **Segurança** (ou equivalente) em [templates/contract.md](templates/contract.md). Design profundo de identity permanece em [identity.md](identity.md) / [authentication.md](authentication.md) / [authorization.md](authorization.md) com links a partir do contract.

## Relação com Testing e Incidents

| Concern | Link |
| --- | --- |
| Verificar comportamento de authz | [security-testing.md](security-testing.md) |
| Abuse na boundary em produção | [security-monitoring.md](security-monitoring.md), [security-incidents.md](security-incidents.md) |
| Regras de segurança ausentes em uma boundary live | [contract-debt.md](contract-debt.md) e/ou [security-debt.md](security-debt.md) |

## Documentos relacionados

- [contract-model.md](contract-model.md)
- [api-contracts.md](api-contracts.md)
- [event-contracts.md](event-contracts.md)
- [message-contracts.md](message-contracts.md)
- [file-contracts.md](file-contracts.md)
- [security-requirements.md](security-requirements.md)
- [data-security.md](data-security.md)
- [encryption.md](encryption.md)
