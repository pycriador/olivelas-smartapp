# Attack Surface

> Language: pt-BR | [English](../en/attack-surface.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção inventariam **onde o sistema pode ser alcançado ou influenciado** para análise de segurança.

Documentação de attack surface complementa [trust-boundaries.md](trust-boundaries.md) e [system-boundaries.md](system-boundaries.md). Foca em classes de exposure, não em dump completo de port scan.

## Propósito

Responder:

> Com o que um actor pode interagir, a partir de qual trust zone, e o que é unknown?

## Classes de exposure

Use estes labels (ou um conjunto equivalente do projeto):

| Class | Meaning |
| --- | --- |
| **Exposed** | Alcançável a partir de zonas less-trusted ou externas sem já estar dentro do sistema |
| **Internal** | Alcançável apenas de dentro de uma trust zone interna definida |
| **Restricted** | Alcançável apenas a partir de caminhos privilegiados / fortemente controlados (admin, break-glass, networks selecionadas) |
| **Unknown** | Exposure não estabelecida — trate como lacuna de documentação e de risk |

Uma interface pode mudar de classe por environment. Documente por environment quando diferirem. Prefira **Unknown** a adivinhar.

## O que inventariar

| Kind | Examples (illustrative) |
| --- | --- |
| Network / API edges | Public APIs, webhooks, admin endpoints |
| Async edges | Queues, topics, file drop locations |
| Identity edges | Login, token issuance, impersonation |
| Operator edges | Consoles, padrões SSH/bastion, runbooks que mudam state |
| Build / deploy edges | Pipelines que podem alterar produção |
| Data edges | Exports, replicas, analytics pipelines |

Nunca liste valores secretos. *Entry points* de credential podem ser nomeados por purpose.

## Registro sugerido de surface

| Campo | Significado |
| --- | --- |
| **ID** | Id curto e estável |
| **Entry / interface** | Nome + link a contract ou component |
| **Exposure class** | Exposed / Internal / Restricted / Unknown |
| **Trust zone** | Resumo from → to |
| **Authn / authz** | Resumo ou link — [authentication.md](authentication.md), [authorization.md](authorization.md) |
| **Data classes** | Classifications que atravessam — [security-classification.md](security-classification.md) |
| **Owner** | Technical ou security owner |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| ID | Entry | Exposure | Trust zone | Authn/Authz | Data classes | Owner | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Integração

| Area | Link |
| --- | --- |
| Trust crossings | [trust-boundaries.md](trust-boundaries.md) |
| Threats em surfaces | [threat-modeling.md](threat-modeling.md) |
| Detalhe de interface | [contract-model.md](contract-model.md) |
| Exposure de ops (health, metrics) | [observability-model.md](observability-model.md) — não confunda scrape endpoints com política de authz |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Liste edges Exposed + qualquer caminho Restricted de admin |
| Medium | Inclua interfaces Internal de service que carregam dados Confidential |
| Large | Inventário completo com backlog Unknown e owners |

## Anti-Patterns

- Documentar apenas a public API do happy-path.
- Marcar tudo Internal sem evidência.
- Deixar edges de admin e CI sem documentação.
- Copiar dumps de firewall rules em docs sem interpretação.

## Documentos relacionados

- [security-model.md](security-model.md)
- [trust-boundaries.md](trust-boundaries.md)
- [threat-modeling.md](threat-modeling.md)
- [security-scope.md](security-scope.md)
- [architecture-model.md](architecture-model.md)
