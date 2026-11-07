# Checklist de Readiness de Segurança

> Language: pt-BR | [English](../en/security-readiness-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Checklist prática antes de tratar um service como **security-ready** em um environment compartilhado ou de produção. Use o que se aplica — marque N/A conscientemente.

Prefira evidência do estado atual a design aspiracional. Itens materiais não checados viram [security debt](security-debt.md), [documentation debt](documentation-debt.md) ou [exceptions](security-exceptions.md) rastreadas.

## Ownership e Scope

- [ ] Segurança / system / data owners identificáveis ([security-ownership.md](security-ownership.md))
- [ ] Escopo de segurança in/out documentado ou resumido ([security-scope.md](security-scope.md))
- [ ] Escalation para security incidents conhecido ou marcado Not Defined

## Assets e Data

- [ ] Assets materiais identificados ([security-assets.md](security-assets.md))
- [ ] Modelo de data classification escolhido ou exemplo mapeado ([security-classification.md](security-classification.md))
- [ ] Handling de dados sensíveis resumido ([data-security.md](data-security.md))
- [ ] Retention Defined, N/A ou **Not Defined** ([data-retention.md](data-retention.md))

## Threats e Risk

- [ ] Trust boundaries identificadas quando aplicável ([trust-boundaries.md](trust-boundaries.md))
- [ ] Attack surface resumida ou Unknown ([attack-surface.md](attack-surface.md))
- [ ] Threats de caminhos críticos consideradas ([threat-modeling.md](threat-modeling.md))
- [ ] Risks materiais registrados com notas de confidence/residual ([security-risk-model.md](security-risk-model.md))

## Identity, Access, Secrets

- [ ] Approach de authentication documentado para entry points ([authentication.md](authentication.md))
- [ ] Modelo de authorization documentado ou Unknown ([authorization.md](authorization.md))
- [ ] Stance de least privilege / privileged access conhecida ([least-privilege.md](least-privilege.md), [privileged-access.md](privileged-access.md))
- [ ] Secrets: só name/purpose/source/required — sem valores ([secrets-management.md](secrets-management.md))
- [ ] Caminho de response a secret exposure conhecido ([secret-exposure.md](secret-exposure.md))

## Arquitetura e Contratos

- [ ] Lentes de security architecture linkadas — sem diagramas duplicados ([security-architecture.md](security-architecture.md))
- [ ] Contratos críticos cobrem authn/authz/sensitive data conforme aplicável ([contract-security.md](contract-security.md))
- [ ] Stance de encryption para channels/dados materiais Defined ou Not Defined ([encryption.md](encryption.md))

## Detecção, Response, Vulnerabilities

- [ ] Monitoring relevante de segurança identificado ou N/A ([security-monitoring.md](security-monitoring.md))
- [ ] Caminho de security incident integrado com ops incidents ([security-incidents.md](security-incidents.md))
- [ ] Intake/triage de vulnerability Defined ou Not Defined ([vulnerability-management.md](vulnerability-management.md))
- [ ] Exceptions abertas têm requirement/reason/risk/compensating/owner/approval/expiration ([security-exceptions.md](security-exceptions.md))

## Evidência e Logging

- [ ] Controls materiais têm refs de evidence ou Unknown honesto ([security-evidence.md](security-evidence.md))
- [ ] Expectativas de secure logging declaradas ([secure-logging.md](secure-logging.md))
- [ ] Auditability Defined, N/A ou Not Defined ([auditability.md](auditability.md))

## Dependências e Delivery

- [ ] Segurança de dependências materiais considerada ([dependency-security.md](dependency-security.md))
- [ ] Notas de trust de supply-chain / release adequadas ao tamanho ([supply-chain-security.md](supply-chain-security.md))
- [ ] Expectativas de secure development proporcionais ([secure-development.md](secure-development.md))

## Qualidade da documentação

- [ ] Docs de segurança têm owners e metadata `updated` fresca
- [ ] Sem secrets ou PII desnecessário em docs
- [ ] Unknowns marcados; sem controls/compliance Confirmed falsos
- [ ] Links para architecture / contracts / ops resolvem

## Como usar

| Situation | Use |
| --- | --- |
| Launch de novo service | Percorra a lista completa com [operational-readiness-checklist.md](operational-readiness-checklist.md) |
| Redesign major | Re-cheque Threats, Arquitetura/Contratos, Identity |
| Follow-up de security incident | Re-cheque itens de Detection/Response e Evidence que falharam |
| Review periódico | Sample de services críticos |

## Documentos relacionados

- [security-readiness.md](security-readiness.md)
- [security-checklist.md](security-checklist.md)
- [security-debt.md](security-debt.md)
- [quality-model.md](quality-model.md)
- [operational-readiness-checklist.md](operational-readiness-checklist.md)
