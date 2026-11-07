# Checklist de Documentação de Segurança

> Language: pt-BR | [English](../en/security-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Checklist prática para qualidade da **documentação de segurança**. Use o que se aplica — projetos pequenos não precisam marcar todos os itens.

Classifique claims incertos (Confirmed / Inferred / Unknown / Proposed). Prefira estado atual a teatro aspiracional de segurança. Não invente controls, permissions, compliance ou vulnerabilities.

## Model e Ownership

- [ ] Segurança loop compreendido ([security-model.md](security-model.md))
- [ ] Escopo in/out claro ([security-scope.md](security-scope.md))
- [ ] Ownership de segurança definido ([security-ownership.md](security-ownership.md))
- [ ] Template de overview ou equivalente existe para systems materiais ([templates/security.md](templates/security.md))

## Assets, Threats, Risk

- [ ] Modelo de classification documentado ou mapeado ([security-classification.md](security-classification.md))
- [ ] Assets materiais catalogados ou resumidos ([security-assets.md](security-assets.md), [templates/security-asset.md](templates/security-asset.md))
- [ ] Approach de threat modeling aplicado onde valioso ([threat-modeling.md](threat-modeling.md), [templates/threat.md](templates/threat.md))
- [ ] Attack surface resumida ou Unknown ([attack-surface.md](attack-surface.md))
- [ ] Risks registrados com notas de confidence/residual ([security-risk-model.md](security-risk-model.md), [templates/security-risk.md](templates/security-risk.md))

## Requirements e Controls

- [ ] Segurança requirements identificados para caminhos críticos ([security-requirements.md](security-requirements.md), [templates/security-requirement.md](templates/security-requirement.md))
- [ ] Controls classificados (preventive/detective/corrective/compensating) ([security-controls.md](security-controls.md), [templates/security-control.md](templates/security-control.md))
- [ ] Exceptions completas quando usadas (requirement/reason/risk/compensating/owner/approval/expiration) ([security-exceptions.md](security-exceptions.md))

## Identity, Data, Secrets

- [ ] Authentication vs authorization claros ([identity.md](identity.md))
- [ ] Authn/authz documentados ou Unknown ([authentication.md](authentication.md), [authorization.md](authorization.md))
- [ ] Least privilege / privileged access endereçados ([least-privilege.md](least-privilege.md), [privileged-access.md](privileged-access.md))
- [ ] Secrets: sem valores em docs ([secrets-management.md](secrets-management.md))
- [ ] Data security / encryption / retention honestos ([data-security.md](data-security.md), [encryption.md](encryption.md), [data-retention.md](data-retention.md))
- [ ] Secure logging / auditability declarados ([secure-logging.md](secure-logging.md), [auditability.md](auditability.md))

## Arquitetura, Contratos, Operações

- [ ] Segurança architecture linka trust/identity/access/data/controls/exposure/deps — sem duplicação de diagramas ([security-architecture.md](security-architecture.md))
- [ ] Trust boundaries alinhadas aos docs de arquitetura ([trust-boundaries.md](trust-boundaries.md))
- [ ] Tópicos de contract security cobertos por referência ([contract-security.md](contract-security.md))
- [ ] Mecanismos compartilhados de ops documentados uma vez ([operations-security.md](operations-security.md))

## Vulnerabilities, Testing, Incidents

- [ ] Lifecycle de vulnerability Defined ou Not Defined ([vulnerability-management.md](vulnerability-management.md))
- [ ] Strategies de security testing documentadas conceitualmente conforme usadas ([security-testing.md](security-testing.md))
- [ ] Segurança monitoring distinto ou marcado Both com ops ([security-monitoring.md](security-monitoring.md))
- [ ] Segurança incidents integram-se aos incidentes de operations ([security-incidents.md](security-incidents.md))
- [ ] Princípios de evidence integrity seguidos ([security-evidence.md](security-evidence.md))

## Dependências e Development

- [ ] Segurança de dependency considerada ([dependency-security.md](dependency-security.md))
- [ ] Notas de supply-chain security proporcionais ([supply-chain-security.md](supply-chain-security.md))
- [ ] Expectativas de secure development proporcionais ([secure-development.md](secure-development.md))

## Drift, Debt, Readiness

- [ ] Segurança drift pode ser registrado ([security-drift.md](security-drift.md))
- [ ] Registro de security debt usável ([security-debt.md](security-debt.md))
- [ ] Segurança readiness considerado para launches ([security-readiness-checklist.md](security-readiness-checklist.md))
- [ ] Sem secrets em docs de segurança
- [ ] Links de architecture, contract e ops usados em vez de prosa duplicada

## Como usar

| Situation | Use |
| --- | --- |
| Novo service | Percorra Model → Assets/Threats → Identity/Secrets → Detection/Response |
| Review de security doc | Use como backbone de review |
| Pós-incident | Re-cheque Incidents, Evidence, Controls que falharam |
| Segurança docs gerados por IA | Combine com regras de segurança em [ai-documentation.md](ai-documentation.md) |

Itens materiais não checados devem virar security ou documentation debt — não lacunas Confirmed silenciosas.

## Documentos relacionados

- [security-readiness-checklist.md](security-readiness-checklist.md)
- [security/README.md](security/README.md)
- [quality-model.md](quality-model.md)
- [documentation-checklist.md](documentation-checklist.md)
- [architecture-checklist.md](architecture-checklist.md)
- [contract-checklist.md](contract-checklist.md)
- [operations-checklist.md](operations-checklist.md)
