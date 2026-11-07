# Desenvolvimento Seguro

> Language: pt-BR | [English](../en/secure-development.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar **expectativas de segurança no development lifecycle** — do design à change — sem mandatar uma marca específica de metodologia ou toolchain.

Registre o que o projeto realmente faz. Prefira links a ADRs, contracts e evidence de CI existentes a checklists inventadas de SDL.

## Segurança Loop de Development (conceitual)

```text
Design → Implement → Review → Test → Release → Operate → Learn
```

| Stage | Segurança focus | Typical docs |
| --- | --- | --- |
| **Design** | Threats, trust boundaries, requirements | [threat-modeling.md](threat-modeling.md), [security-architecture.md](security-architecture.md) |
| **Implement** | Safe defaults, least privilege, handling de secrets | [least-privilege.md](least-privilege.md), [secrets-management.md](secrets-management.md) |
| **Review** | Review humano/assistido por IA de mudanças sensíveis | [security-evidence.md](security-evidence.md), registros de review |
| **Test** | Strategies de security test em uso | [security-testing.md](security-testing.md) |
| **Release** | Risk de change, exceptions, safety de rollback | [change-management.md](change-management.md), [security-exceptions.md](security-exceptions.md) |
| **Operate** | Monitoring e incidents | [security-monitoring.md](security-monitoring.md), [security-incidents.md](security-incidents.md) |
| **Learn** | PIR, debt, refresh do threat model | [post-incident-review.md](post-incident-review.md), [security-debt.md](security-debt.md) |

## O que documentar

| Topic | Guidance |
| --- | --- |
| Entry criteria para mudanças sensíveis | Quando threat review ou security review é exigido — ou **Not Defined** |
| Expectativas de coding / design | Obrigações de alto nível (validate input, authz checks) — linke requirements |
| Dependency updates | Como risk de dependency é tratado — [dependency-security.md](dependency-security.md) |
| Secrets em development | Sem secrets em repo/docs; source local de secret só por nome |
| Expectativas de review | Quem revisa PRs security-sensitive |
| Expectativas de testing | Quais strategies se aplicam antes do release |
| Exceptions | Como desvios temporários são registrados |

Não invente regras de branch protection, required reviewers ou scanners ausentes do projeto.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Regra de secrets, awareness de authn/authz, como reportar um finding de vulnerability |
| Medium | Notas de threat para caminhos críticos; strategies de security test em uso; review para mudanças sensíveis |
| Large | Expectativas explícitas de secure-development, processo de exception, evidence de review periódico |

## Anti-Patterns

- Colar um checklist genérico OWASP como se fosse prática do projeto.
- Afirmar “secure SDLC certified” sem evidência.
- Documentar gates desejados como processo Confirmed atual.
- Embutir credentials em sample code ou docs.

## Documentos relacionados

- [security-requirements.md](security-requirements.md)
- [security-controls.md](security-controls.md)
- [security-testing.md](security-testing.md)
- [supply-chain-security.md](supply-chain-security.md)
- [contract-security.md](contract-security.md)
- [ai-documentation.md](ai-documentation.md)
