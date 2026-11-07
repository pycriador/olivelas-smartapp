# Secure Development

> Language: EN | [Português (pt-BR)](../pt-BR/secure-development.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document **security expectations in the development lifecycle** — from design through change — without mandating a specific methodology brand or toolchain.

Record what the project actually does. Prefer links to existing ADRs, contracts, and CI evidence over invented SDL checklists.

## Development Security Loop (Conceptual)

```text
Design → Implement → Review → Test → Release → Operate → Learn
```

| Stage | Security focus | Typical docs |
| --- | --- | --- |
| **Design** | Threats, trust boundaries, requirements | [threat-modeling.md](threat-modeling.md), [security-architecture.md](security-architecture.md) |
| **Implement** | Safe defaults, least privilege, secret handling | [least-privilege.md](least-privilege.md), [secrets-management.md](secrets-management.md) |
| **Review** | Human/AI-assisted review of sensitive changes | [security-evidence.md](security-evidence.md), review records |
| **Test** | Security test strategies in use | [security-testing.md](security-testing.md) |
| **Release** | Change risk, exceptions, rollback safety | [change-management.md](change-management.md), [security-exceptions.md](security-exceptions.md) |
| **Operate** | Monitoring and incidents | [security-monitoring.md](security-monitoring.md), [security-incidents.md](security-incidents.md) |
| **Learn** | PIR, debt, threat model refresh | [post-incident-review.md](post-incident-review.md), [security-debt.md](security-debt.md) |

## What to Document

| Topic | Guidance |
| --- | --- |
| Entry criteria for sensitive changes | When threat review or security review is required — or **Not Defined** |
| Coding / design expectations | High-level obligations (validate input, authz checks) — link requirements |
| Dependency updates | How dependency risk is handled — [dependency-security.md](dependency-security.md) |
| Secrets in development | No secrets in repo/docs; local secret source by name only |
| Review expectations | Who reviews security-sensitive PRs |
| Testing expectations | Which strategies apply before release |
| Exceptions | How temporary deviations are recorded |

Do not invent branch protection rules, required reviewers, or scanners absent from the project.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Secrets rule, authn/authz awareness, how to report a vulnerability finding |
| Medium | Threat notes for critical paths; security test strategies in use; review for sensitive changes |
| Large | Explicit secure-development expectations, exception process, evidence of periodic review |

## Anti-Patterns

- Pasting a generic OWASP checklist as if it were project practice.
- Claiming “secure SDLC certified” without evidence.
- Documenting desired gates as current Confirmed process.
- Embedding credentials in sample code or docs.

## Related Documents

- [security-requirements.md](security-requirements.md)
- [security-controls.md](security-controls.md)
- [security-testing.md](security-testing.md)
- [supply-chain-security.md](supply-chain-security.md)
- [contract-security.md](contract-security.md)
- [ai-documentation.md](ai-documentation.md)
