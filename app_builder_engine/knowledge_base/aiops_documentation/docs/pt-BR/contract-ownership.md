# Ownership de Contrato

> Language: pt-BR | [English](../en/contract-ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Quem é responsável por um contrato técnico e pelos participantes que o implementam.

Regras gerais de ownership: [ownership.md](ownership.md). Este documento as especializa para contratos.

## Papéis

| Role | Accountability |
| --- | --- |
| **Contract owner** | Qualidade do documento canônico, status de ciclo de vida, descobribilidade, facilitação do processo de mudança |
| **Producer owner** | Comportamento correto de produção/emissão relativo ao contrato |
| **Consumer owner** | Consumo/interpretação corretos relativos ao contrato |

Podem ser o mesmo time ou times diferentes. **Não assuma que só o producer é dono do contrato.**

## Responsabilidade compartilhada

Quando vários times dependem de uma fronteira:

- O **contract owner** é o autor responsável pelo acordo (frequentemente um time de plataforma ou o producer líder — mas nem sempre).
- **Producer e consumer owners** devem ser consultados em breaking changes.
- Ownership compartilhado é válido: documente co-owners ou uma nota no estilo RACI no contrato.
- Disputas sobre significado são resolvidas por review e, quando arquiteturais, ADRs — não por divergência silenciosa.

## Expectativas do processo de mudança

| Change kind | Who must be involved |
| --- | --- |
| Clarification (no behavior change) | Contract owner; notifique participantes se útil |
| Non-breaking additive | Contract owner + producer owner; informe consumers conhecidos |
| Breaking / semantic | Contract owner + producer owner + consumer owners conhecidos |
| Deprecation / archive | Contract owner; comunique a todos os participantes conhecidos |

Veja [contract-change-management.md](contract-change-management.md).

## Metadados

Registre ao menos:

| Field | Guidance |
| --- | --- |
| `owner` | Contract owner (obrigatório para contratos substantivos) |
| `producer` | Sistema/componente que produz (recomendado) |
| `consumer` | Consumer(s) primário(s) ou "multiple / see section" (recomendado quando conhecido) |

Consumers desconhecidos devem ser marcados Unknown — não inventados. Veja [standards.md](standards.md) para campos de metadados de contrato.

## Documentos relacionados

- [ownership.md](ownership.md)
- [contract-lifecycle.md](contract-lifecycle.md)
- [contract-change-management.md](contract-change-management.md)
- [breaking-changes.md](breaking-changes.md)
