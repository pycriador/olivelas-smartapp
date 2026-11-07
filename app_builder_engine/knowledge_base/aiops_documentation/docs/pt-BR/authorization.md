# Authorization

> Language: pt-BR | [English](../en/authorization.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **authorization** — o que uma identity autenticada (ou anônima) pode fazer.

## Distinção central

| Question | Document |
| --- | --- |
| **Who are you?** | [authentication.md](authentication.md), [identity.md](identity.md) |
| **What are you allowed to do?** | Este documento |

Sucesso de authentication não é authorization. Identities anônimas, se permitidas, ainda precisam de uma história explícita de authorization (incluindo “deny all non-public actions”).

## O que documentar

| Topic | Guidance |
| --- | --- |
| **Subjects** | Tipos de identity, roles, groups, attributes — vocabulário do projeto |
| **Actions** | Operações que importam (read, write, admin, approve, deploy, …) |
| **Resources** | Objects ou scopes protegidos (tenant data, admin APIs, jobs, …) |
| **Decision point** | Onde o enforcement acontece (edge, service, data layer) |
| **Default posture** | Deny-by-default vs allow-by-default — declare com honestidade |
| **Delegation / impersonation** | Se presente; senão Not Applicable |
| **Failure behavior** | Políticas denied vs not-found quando definidas; linke contracts para errors |

## Estilos de modelo (exemplos, não requirements)

Projetos podem usar qualquer modelo que combine com a realidade:

| Style (example) | Notes |
| --- | --- |
| Role-based | Roles → permissions |
| Attribute-based | Decisions a partir de attributes/context |
| Resource policies | Regras per-resource |
| Capability / ACL lists | Grants explícitos |
| Coarse environment gates | Gates de network ou stage como control *parcial* — declare residual risk |

Não force um nome de estilo se o projeto só tem um allowlist simples.

## Registro sugerido de authorization

| Campo | Significado |
| --- | --- |
| **Action / resource** | O que é protegido |
| **Who is allowed** | Regra de subject |
| **Enforcement point** | Component / boundary |
| **Related authn** | Força de identity exigida se houver |
| **Contract link** | Doc canônico da interface |
| **Certainty** | Confirmed / Inferred / Unknown / Not Applicable |

## Inventário sugerido

| Action / resource | Who is allowed | Enforcement point | Authn prerequisite | Contract | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Least Privilege e Privilege

- Grants default devem seguir [least-privilege.md](least-privilege.md).
- Caminhos elevados pertencem a [privileged-access.md](privileged-access.md).
- Regras cross-tenant devem ser explícitas quando multi-tenancy existir — link [trust-boundaries.md](trust-boundaries.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Quem pode chamar as write APIs principais e quem pode admin |
| Medium | Matriz para resources Critical + nota de isolamento de tenant se aplicável |
| Large | Enforcement points por boundary; impersonation e break-glass |

## Anti-Patterns

- “Authorized if authenticated.”
- Documentar só visibility de UI, não enforcement server-side.
- Regras conflitantes entre contract e security doc.
- Esconder deny rules que sustentam isolamento.

## Documentos relacionados

- [identity.md](identity.md)
- [authentication.md](authentication.md)
- [least-privilege.md](least-privilege.md)
- [privileged-access.md](privileged-access.md)
- [security-controls.md](security-controls.md)
- [contract-model.md](contract-model.md)
