# Authentication

> Language: pt-BR | [English](../en/authentication.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **authentication** — estabelecer quem ou o quê uma identity é — sem assumir um protocolo ou formato de token particular.

Este documento responde **Who are you?** Não responde **What are you allowed to do?** — veja [authorization.md](authorization.md) e [identity.md](identity.md).

## Propósito

Para cada entry point material, registre como a identity é verificada, sob quais assumptions de trust e o que acontece na falha.

## Classes de mecanismo (exemplos, não requirements)

Documente a classe que o projeto realmente usa. Não **assumir** que OAuth, OIDC, JWT, mTLS, API keys ou passwords estão presentes.

| Class (example) | What to capture |
| --- | --- |
| Shared secret / key presentation | Key *name/reference*, owner de rotation — nunca o valor |
| Password / credential challenge | Resumo de policy se definida; storage é concern de secret |
| Proof-of-possession / mutual auth | O que é provado (certificate identity, etc.) em nível conceitual |
| Federated / delegated assertion | Quem emite a assertion; o que se confia dela |
| Platform / infrastructure identity | Mecanismo de identity de cloud ou runtime pelo nome do projeto |
| Step-up / multi-factor | Quando prova adicional é exigida |
| None (anonymous) | Documente explicitamente se acesso anônimo é permitido |

Se o projeto usa um standard nomeado, linke ao contract ou ADR; não cole secrets ou configs privadas completas.

## Registro sugerido por entry-point

| Campo | Significado |
| --- | --- |
| **Entry point** | Id de interface / surface — link [attack-surface.md](attack-surface.md) |
| **Identity type** | Human, service, operator, … |
| **Mechanism** | Classe + nome específico do projeto |
| **Issuer / source** | Quem atesta a identity (se houver) |
| **Failure behavior** | Reject, degrade, challenge — linke contracts para wire errors quando aplicável |
| **Session / replay notes** | Só se definido; senão Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Not Applicable |

## Inventário sugerido

| Entry point | Identity type | Mechanism | Issuer / source | Failure behavior | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Integração com contracts

Expectativas de authentication que peers devem atender pertencem ao [contract](contract-model.md) canônico (ou a um link claro a partir dele). Docs de segurança resumem e apontam; não devem bifurcar regras conflitantes.

## Notas de Trust Boundary

Declare quando authentication no edge é reutilizada dentro de outra zona, e se components internos re-autenticam. Veja [trust-boundaries.md](trust-boundaries.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Mecanismo para o entry Exposed primário; note anonymous se permitido |
| Medium | Todos os entries Exposed + Restricted de admin |
| Large | Authentication service-to-service e de pipeline incluídas |

## Anti-Patterns

- Escrever “JWT/OAuth” como toda a história de authentication sem mapa de entry-points.
- Documentar regras de authorization sob um heading Authentication.
- Embutir samples de token que contenham secrets reais ou PII.
- Afirmar multi-factor ou federation que não está implementado.

## Documentos relacionados

- [identity.md](identity.md)
- [authorization.md](authorization.md)
- [secrets-management.md](secrets-management.md)
- [attack-surface.md](attack-surface.md)
- [contract-model.md](contract-model.md)
- [security-requirements.md](security-requirements.md)
