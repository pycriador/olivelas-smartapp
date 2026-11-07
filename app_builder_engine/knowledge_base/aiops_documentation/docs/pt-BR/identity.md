# Identity

> Language: pt-BR | [English](../en/identity.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **identities** e mantêm **authentication** distinta de **authorization**.

## Distinção central

| Concept | Question | Concern |
| --- | --- | --- |
| **Authentication** | Who are you? (ou: qual identity é esta?) | Estabelecer e verificar uma identity |
| **Authorization** | What are you allowed to do? | Permitir ou negar actions sobre resources |

Nunca documente “auth” como um blob único que mistura os dois. Se um mecanismo faz ambos, descreva cada concern separadamente — veja [authentication.md](authentication.md) e [authorization.md](authorization.md).

## Tipos de identity (exemplos)

| Type | Meaning |
| --- | --- |
| **Human user** | Pessoa interagindo com o sistema |
| **Service / workload identity** | Identity de runtime non-human |
| **Operator / admin identity** | Humano privilegiado ou caminho break-glass |
| **Pipeline / automation identity** | Identity de CI/CD ou job que pode mudar systems |
| **External client identity** | Client de partner ou terceiro |

Use nomes do projeto. Marque **Not Applicable** quando um tipo não existir.

## O que documentar

| Topic | Guidance |
| --- | --- |
| Identity sources | De onde identities vêm (directory, issuer, local store) — por nome, não secrets |
| Lifecycle | Expectativas de join / move / leave / revoke quando conhecidas |
| Mapping to authn | Como uma identity é provada em cada entry — [authentication.md](authentication.md) |
| Mapping to authz | Como attributes/roles/permissions de identity são decididos — [authorization.md](authorization.md) |
| Privilege | Identities elevadas — [privileged-access.md](privileged-access.md), [least-privilege.md](least-privilege.md) |
| Contratos | Qual identity é exigida em uma interface — [contract-model.md](contract-model.md) |

## Inventário sugerido

| Identity type | Used where | Authn mechanism (summary) | Authz model (summary) | Owner | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Trust Boundaries

A força da identity frequentemente muda em [trust-boundaries.md](trust-boundaries.md). Documente quando uma zona interna confia em uma prova externa, e quais controls re-validam ou re-autorizam no crossing.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Identities human vs service; authn vs authz claros para a API principal |
| Medium | Identities de operator e pipeline incluídas |
| Large | Lifecycle, revocation e requirements de identity no nível de contract |

## Anti-Patterns

- Tratar network location como identity sem declarar a assumption.
- “Authenticated users can do everything” sem doc de authorization.
- Compartilhar uma única identity de longa duração across muitos workloads não relacionados sem notar o risk.
- Armazenar credentials ou samples de dados pessoais em docs de identity.

## Documentos relacionados

- [authentication.md](authentication.md)
- [authorization.md](authorization.md)
- [least-privilege.md](least-privilege.md)
- [privileged-access.md](privileged-access.md)
- [security-requirements.md](security-requirements.md)
- [trust-boundaries.md](trust-boundaries.md)
