---
title: "Segurança"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
---

# Segurança

> Language: pt-BR | [English (EN)](../../en/templates/security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Visão geral da postura de segurança de um sistema ou capacidade. Use como **documento de entrada** que liga a metodologia de segurança — não duplique aqui catálogos completos de ameaças, inventários de controles ou diagramas de arquitetura.

Índice da metodologia: [../security/README.md](../security/README.md) · Modelo: [../security-model.md](../security-model.md)

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| | |

Veja também [../security-scope.md](../security-scope.md).

## Ownership

| Papel | Owner |
| --- | --- |
| Segurança | |
| Sistema / técnico | |
| Dados | |
| Operacional / incidente | |

Veja [../security-ownership.md](../security-ownership.md).

## Ativos e classificação

| Ativo | Classificação | Owner | Notas |
| --- | --- | --- | --- |
| | | | |

Templates: [security-asset.md](security-asset.md) · Orientação: [../security-assets.md](../security-assets.md), [../security-classification.md](../security-classification.md)

## Modelo de ameaças

| Ameaça | Ativo afetado | Probabilidade | Impacto | Mitigação | Classificação |
| --- | --- | --- | --- | --- | --- |
| | | | | | Confirmed / Inferred / Unknown / Proposed |

Aprofundamento: [../threat-modeling.md](../threat-modeling.md), [threat.md](threat.md), [../attack-surface.md](../attack-surface.md)

## Riscos

| Risco | Severidade | Residual | Status | Classificação |
| --- | --- | --- | --- | --- |
| | | | open / accepted / mitigated | |

Veja [../security-risk-model.md](../security-risk-model.md), [security-risk.md](security-risk.md)

## Fronteiras de confiança

| Fronteira | Dentro | Fora | Controles |
| --- | --- | --- | --- |
| | | | |

Linke diagramas de arquitetura — não os redesenhe aqui. Veja [../trust-boundaries.md](../trust-boundaries.md), [../security-architecture.md](../security-architecture.md)

## Identidade e acesso

### Autenticação

| Ponto de entrada | Mecanismo | Classificação |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

### Autorização

| Ação / recurso | Quem tem permissão | Mecanismo | Classificação |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown / Not Applicable |

Veja [../identity.md](../identity.md), [../authentication.md](../authentication.md), [../authorization.md](../authorization.md), [../least-privilege.md](../least-privilege.md)

## Secrets

| Nome | Propósito | Fonte | Obrigatório |
| --- | --- | --- | --- |
| | | | yes / no |

<!-- Never record secret values. -->

Veja [../secrets-management.md](../secrets-management.md), [../secret-exposure.md](../secret-exposure.md)

## Criptografia e proteção de dados

| Dado / canal | Em repouso | Em trânsito | Classificação |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown / Not Applicable |

| Classe de dado | Regras de tratamento | Retenção | Classificação |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown |

Veja [../encryption.md](../encryption.md), [../data-security.md](../data-security.md), [../data-retention.md](../data-retention.md)

## Rede e exposição

| Controle | Propósito | Classificação |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

| Superfície | Exposição | Notas |
| --- | --- | --- |
| | Exposed / Internal / Restricted / Unknown | |

Veja [../attack-surface.md](../attack-surface.md)

## Controles e requisitos

| Requisito | Controle | Tipo | Evidência |
| --- | --- | --- | --- |
| | | Preventive / Detective / Corrective / Compensating | |

Veja [../security-requirements.md](../security-requirements.md), [../security-controls.md](../security-controls.md), [../security-evidence.md](../security-evidence.md)

## Auditabilidade e logging

| Evento | Registrado? | Onde | Classificação |
| --- | --- | --- | --- |
| | yes / no / Unknown | | |

Sem secrets/PII em exemplos de log. Veja [../secure-logging.md](../secure-logging.md), [../auditability.md](../auditability.md)

## Monitoramento e incidentes

| Sinal | Propósito de segurança | Ação |
| --- | --- | --- |
| | | |

| Tópico | Link / notas |
| --- | --- |
| Monitoramento de segurança | [../security-monitoring.md](../security-monitoring.md) |
| Incidentes de segurança | [../security-incidents.md](../security-incidents.md) |
| Vulnerabilidades | [../vulnerability-management.md](../vulnerability-management.md) |
| Exceções | [../security-exceptions.md](../security-exceptions.md) |

## Dependências e supply chain

| Dependência | Notas de confiança / privilégio | Owner |
| --- | --- | --- |
| | | |

Veja [../dependency-security.md](../dependency-security.md), [../supply-chain-security.md](../supply-chain-security.md)

## Testes e prontidão

| Estratégia | Em uso? | Última execução |
| --- | --- | --- |
| | yes / no / N/A / Not Defined | |

| Resultado de prontidão | Ready / Conditionally ready / Not ready / Unknown |
| --- | --- |
| Notas | |

Veja [../security-testing.md](../security-testing.md), [../security-readiness.md](../security-readiness.md), [../secure-development.md](../secure-development.md)

## Débito de segurança e drift

| ID | Descrição | Prioridade | Status |
| --- | --- | --- | --- |
| | | High / Medium / Low | Open / In Progress / Resolved / Accepted Risk |

Veja [../security-debt.md](../security-debt.md), [../security-drift.md](../security-drift.md)

## Recomendações de segurança

| Recomendação | Prioridade | Classificação |
| --- | --- | --- |
| | | Proposed / Confirmed need |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Índice da metodologia de segurança | [../security/README.md](../security/README.md) |
| Arquitetura | |
| Contratos (seções de segurança) | [../contract-security.md](../contract-security.md) |
| Segurança operacional | [../operations-security.md](../operations-security.md) |
| ADRs | |
| Checklist | [../security-checklist.md](../security-checklist.md) |
