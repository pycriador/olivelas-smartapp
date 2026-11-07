# Modelo de Segurança

> Language: pt-BR | [English](../en/security-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **segurança** como um ciclo contínuo — não como uma checklist pontual ou um rótulo de compliance.

Esta metodologia é agnóstica de tecnologia. Integra-se com [Arquitetura](architecture-model.md) (estrutura, trust boundaries, data flows), [Contratos](contract-model.md) (authn/authz nas interfaces, campos sensíveis) e [Operações](operations-model.md) (monitoring, incident response, recovery). Arquitetura descreve *o que existe*; contratos descrevem *regras de interação*; operações descrevem *como o sistema é operado*; docs de segurança descrevem *o que deve ser protegido, de quê, como e com qual evidência*.

Não **invente** certificações, mapeamentos regulatórios ou frameworks de controle que o projeto não usa. Prefira **Unknown** ou **Not Defined** a afirmações de compliance fabricadas.

## Conceitos centrais

Use estes termos com precisão. Não os trate como sinônimos.

| Concept | Meaning | Typical documentation focus |
| --- | --- | --- |
| **Asset** | Algo de valor que o sistema cria, armazena, processa ou do qual depende | Classes de dados, identities, keys (por referência), services, integridade de processos |
| **Threat** | Ação ou condição adversa potencial contra um asset | Quem/o quê poderia prejudicar o asset e como |
| **Vulnerability** | Fraqueza que uma threat poderia explorar | Controle ausente, misconfiguration, lacuna de design — marque certainty |
| **Risk** | Combinação de uma threat agindo sobre um asset (opcionalmente via vulnerability), com consequência estimada | Likelihood, impact, severity, residual risk |
| **Requirement** | Obrigação de segurança que o sistema ou processo deve atender | Authn, authz, confidentiality, integrity, availability, privacy, auditability |
| **Control** | Medida que reduz risk ou enforce um requirement | Preventive, detective, corrective, compensating |
| **Evidence** | Prova observável de que um control ou requirement é atendido | Logs (sem secrets/PII), configs por nome, testes, reviews — nunca valores secretos |

## Segurança Loop

```text
Assets → Threats → Risk → Requirements → Controls → Evidence → Monitoring → Response → Review
    ↑                                                                              │
    └──────────────────────────────────────────────────────────────────────────────┘
```

| Stage | Question | Typical artifacts |
| --- | --- | --- |
| **Assets** | O que devemos proteger? | [security-assets.md](security-assets.md), [security-classification.md](security-classification.md) |
| **Threats** | O que pode dar errado, e quem/o quê motiva? | [threat-modeling.md](threat-modeling.md), [threat-actors.md](threat-actors.md), [attack-surface.md](attack-surface.md) |
| **Risk** | Quão grave é, e qual residual permanece? | [security-risk-model.md](security-risk-model.md) |
| **Requirements** | O que deve ser verdade? | [security-requirements.md](security-requirements.md) |
| **Controls** | Como enforce ou reduzimos? | [security-controls.md](security-controls.md), [identity.md](identity.md), [secrets-management.md](secrets-management.md) |
| **Evidence** | Como sabemos que os controls funcionam? | [security-evidence.md](security-evidence.md) — sem secrets em docs |
| **Monitoring** | Como detectamos sinais relevantes de segurança? | [security-monitoring.md](security-monitoring.md); link [monitoring.md](monitoring.md) |
| **Response** | O que fazemos quando algo dá errado? | [security-incidents.md](security-incidents.md), [incident-management.md](incident-management.md), [secret-exposure.md](secret-exposure.md) |
| **Review** | O que aprendemos e o que deve mudar? | Refresh do threat model, ownership, expiração de exceptions, updates de docs/arquitetura/contratos |

Stages podem se sobrepor. Documente o loop que o projeto realmente usa; não invente processo que não existe.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Scope, ownership, main assets, edge trust boundary, resumo de authn/authz, regra de tratamento de secrets |
| Medium | Threat model para caminhos críticos, notas de risk, key controls, expectativas de logging/audit |
| Large / distributed | Catálogo completo de assets, attack surface, risk model, inventário de controls, processo de exception, review periódico |

## Pontos de integração

| Area | Link |
| --- | --- |
| System e trust edges | [system-boundaries.md](system-boundaries.md), [trust-boundaries.md](trust-boundaries.md) |
| Estrutura de arquitetura | [architecture-model.md](architecture-model.md), [failure-domains.md](failure-domains.md) |
| Auth de interface e dados sensíveis | [contract-model.md](contract-model.md), categoria contracts |
| Detect/respond em runtime | [operations-model.md](operations-model.md), [incident-management.md](incident-management.md), [monitoring.md](monitoring.md) |
| Ownership da documentação | [ownership.md](ownership.md), [security-ownership.md](security-ownership.md) |
| Sem secrets em docs | [standards.md](standards.md), [secrets-management.md](secrets-management.md) |

Prefira links a copiar diagramas de arquitetura, schemas de contrato ou runbooks na prosa de segurança.

## Certainty

Classifique afirmações de segurança como Confirmed / Inferred / Unknown / Proposed ([standards.md](standards.md)). Prefira evidência **Confirmed** antes de aceitar documentos de segurança. Prefira **Unknown** ou **Not Defined** a controls, períodos de retention ou afirmações de compliance inventados.

## Documentos relacionados

- [security-scope.md](security-scope.md)
- [security-ownership.md](security-ownership.md)
- [threat-modeling.md](threat-modeling.md)
- [security-requirements.md](security-requirements.md)
- [security-controls.md](security-controls.md)
- [security-evidence.md](security-evidence.md)
- [security-monitoring.md](security-monitoring.md)
- [security-incidents.md](security-incidents.md)
- [security-architecture.md](security-architecture.md)
- [security-readiness.md](security-readiness.md)
- [security-checklist.md](security-checklist.md)
- [security/README.md](security/README.md)
- [standards.md](standards.md)
