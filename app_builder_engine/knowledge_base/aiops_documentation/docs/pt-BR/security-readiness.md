# Readiness de Segurança

> Language: pt-BR | [English](../en/security-readiness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como decidir se um service ou capability está **ready sob a perspectiva de segurança** para operar em um environment compartilhado ou de produção.

Segurança readiness não é um badge de marketing ou compliance. Pergunta: *Sabemos o que proteger, o que pode dar errado, quais controls existem, como detectamos e respondemos, e o que permanece explicitamente aceito?*

Companheiro de [operational-readiness.md](operational-readiness.md) — um sistema pode estar operationally ready e ainda não security-ready (ou o inverso). Avalie ambos ao lançar.

## Lente de readiness

| Area | Question |
| --- | --- |
| Scope & ownership | Escopo e ownership de segurança estão claros? — [security-scope.md](security-scope.md), [security-ownership.md](security-ownership.md) |
| Assets & classification | Assets e data classes materiais são conhecidos? — [security-assets.md](security-assets.md), [security-classification.md](security-classification.md) |
| Threats & risk | Threats e risks de caminhos críticos foram considerados? — [threat-modeling.md](threat-modeling.md), [security-risk-model.md](security-risk-model.md) |
| Identity & access | Authn/authz e least privilege estão documentados? — [identity.md](identity.md), [authorization.md](authorization.md) |
| Secrets & data | Handling de secrets e dados sensíveis está definido? — [secrets-management.md](secrets-management.md), [data-security.md](data-security.md) |
| Arquitetura & contracts | Trust boundaries e contract security linkados? — [security-architecture.md](security-architecture.md), [contract-security.md](contract-security.md) |
| Detection & response | Segurança monitoring e caminho de incident usáveis? — [security-monitoring.md](security-monitoring.md), [security-incidents.md](security-incidents.md) |
| Vulnerabilities & exceptions | Vulns/exceptions abertas têm owner com expiration? — [vulnerability-management.md](vulnerability-management.md), [security-exceptions.md](security-exceptions.md) |
| Evidence | Controls materiais têm evidence ou Unknown honesto? — [security-evidence.md](security-evidence.md) |

Use a checklist de itens: [security-readiness-checklist.md](security-readiness-checklist.md).

## Outcomes

| Outcome | Meaning |
| --- | --- |
| **Ready** | Lacunas materiais fechadas ou aceitas com risk / debt explícito |
| **Conditionally ready** | [Segurança exceptions](security-exceptions.md) com prazo e owners |
| **Not ready** | Blockers permanecem; não implique security readiness de produção |

Marque unknowns como **Unknown** / **Not Defined**. Não invente controls, permissions, scanners ou attestations de compliance para “passar” readiness.

## Progressive Disclosure

| Project size | Bar |
| --- | --- |
| Small | Owner, assets no edge, resumo de authn/authz, regra de secrets, como reportar um incident |
| Medium | Notas de threat para caminhos críticos, links de monitoring/response, ownership de vuln/exception |
| Large | Lente completa de readiness, evidence para controls materiais, review periódico |

## Documentos relacionados

- [security-readiness-checklist.md](security-readiness-checklist.md)
- [security-checklist.md](security-checklist.md)
- [operational-readiness.md](operational-readiness.md)
- [security-debt.md](security-debt.md)
- [security-model.md](security-model.md)
- [templates/security.md](templates/security.md)
