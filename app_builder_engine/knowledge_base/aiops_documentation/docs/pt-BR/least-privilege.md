# Least Privilege

> Language: pt-BR | [English](../en/least-privilege.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam o princípio de que **identities recebem apenas o acesso necessário à sua função** — e nada mais.

Least privilege aplica-se a humanos, services, pipelines e operators. É uma postura de requirement; mecanismos de enforcement pertencem a [authorization.md](authorization.md) e [security-controls.md](security-controls.md).

## Propósito

Responder:

> Para cada identity material, qual é o acesso mínimo necessário, e como prevenimos crescimento silencioso de privilege?

## O que documentar

| Topic | Guidance |
| --- | --- |
| **Baseline grants** | Permissions default para cada tipo de identity |
| **Justifications** | Por que um grant amplo existe (se deve) |
| **Separation** | Identities distintas para duties distintas quando exigido |
| **Time bounds** | Elevation temporária vs standing privilege — veja [privileged-access.md](privileged-access.md) |
| **Review** | Quem revisa grants e com que frequência — ou **Not Defined** |
| **Dependencies** | Privileges exigidos em sistemas upstream — linke owners |

## Inventário sugerido

| Identity / role | Necessary access | Explicitly excluded | Standing / temporary | Review | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | Not Defined se desconhecido | |

## Relação com outros controls

| Concern | Link |
| --- | --- |
| Decision rules | [authorization.md](authorization.md) |
| Caminhos elevados | [privileged-access.md](privileged-access.md) |
| Reachability de secrets | [secrets-management.md](secrets-management.md) — quem pode *ler* uma secret reference |
| Blast radius | [failure-domains.md](failure-domains.md), [criticality.md](criticality.md) |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Declare que roles de service e humanas estão separados se for verdade; note qualquer admin compartilhado |
| Medium | Inventário de grants amplos com owners |
| Large | Cadência de review, padrão de elevation temporária, privileges de dependency |

## Anti-Patterns

- Identity “superuser” compartilhada para toda automation “por convenience.”
- Copiar direitos de admin de produção para non-production sem notar o risk.
- Documentar least privilege enquanto deny-by-default é falso e não declarado.
- Reviews de grant afirmados mas nunca realizados (marque Not Defined em vez disso).

## Documentos relacionados

- [authorization.md](authorization.md)
- [privileged-access.md](privileged-access.md)
- [identity.md](identity.md)
- [security-requirements.md](security-requirements.md)
- [security-ownership.md](security-ownership.md)
