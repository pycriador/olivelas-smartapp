# Privileged Access

> Language: pt-BR | [English](../en/privileged-access.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **acesso elevado** que pode bypassar limites normais, mudar security controls ou alcançar assets altamente sensíveis.

Privileged access é uma especialização de [authorization.md](authorization.md) e [least-privilege.md](least-privilege.md). Trate planos de admin, break-glass, superusers de data-store e deploy identities que podem alterar produção como privileged quando existirem.

## Propósito

Responder:

> Quem pode usar caminhos privilegiados, como a elevation é concedida, como é monitorada e como é revogada?

## Exemplos de caminhos privilegiados (não exaustivos)

- Administrative APIs ou consoles
- Administração direta de data-store
- Administração de secret vault (por nome de role — nunca valores)
- Identities de production deploy ou mutação de infrastructure
- Break-glass / emergency access
- Impersonation de outros tenants ou users

Documente apenas caminhos que existem. Marque os demais **Not Applicable**.

## Registro sugerido

| Campo | Significado |
| --- | --- |
| **Path** | Nome da capability privilegiada |
| **Who** | Roles / identities permitidas |
| **How granted** | Standing vs request/approve vs break-glass |
| **Authn strength** | Prova extra se houver — senão Not Defined |
| **Logging / audit** | O que é registrado — [auditability.md](auditability.md) |
| **Monitoring** | Alerts ou reviews — link [monitoring.md](monitoring.md) |
| **Revocation** | Como o acesso termina |
| **Owner** | Segurança ou system owner |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| Path | Who | Grant model | Audit | Monitoring | Revocation | Owner | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Integração com Operações

Misuse ou falha privilegiada frequentemente vira um [incident](incident-management.md). Alinhe expectativas de severity a [incident-severity.md](incident-severity.md) quando o projeto as definir. Não invente um security on-call separado se nenhum existir — declare **Not Defined** e aponte ao operational ownership.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Nomeie quem pode admin produção e como break-glass funciona (ou que não existe) |
| Medium | Inventário de caminhos privilegiados com notas de audit |
| Large | Grant model, monitoring, revocation e cadência de review |

## Anti-Patterns

- Shared root credentials sem documentação.
- Break-glass sem logging ou owner.
- CI identities privilegiadas com write standing a produção e sem review.
- Colar private keys ou connection strings neste documento.

## Documentos relacionados

- [least-privilege.md](least-privilege.md)
- [authorization.md](authorization.md)
- [identity.md](identity.md)
- [auditability.md](auditability.md)
- [secrets-management.md](secrets-management.md)
- [operational-ownership.md](operational-ownership.md)
