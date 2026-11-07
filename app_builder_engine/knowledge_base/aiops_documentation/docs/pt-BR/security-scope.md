# Escopo de Segurança

> Language: pt-BR | [English](../en/security-scope.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção declaram **o que a documentação e a análise de segurança cobrem** — e o que excluem de propósito.

Escopo evita falsa confiança. Um threat model que omite silenciosamente planos de admin, batch jobs ou processadores de terceiros está incompleto, não “mais simples.”

## Propósito

Responder:

> Para este projeto (ou subsystem), o que está no escopo de segurança, o que está fora e por quê?

O escopo de segurança deve alinhar-se a [system-boundaries.md](system-boundaries.md) e [security-model.md](security-model.md). Quando divergirem, diga isso explicitamente.

## Estrutura sugerida

| Section | Content |
| --- | --- |
| **No escopo** | Systems, classes de dados, interfaces, environments, identities e processos cobertos |
| **Fora do escopo** | Exclusões explícitas com rationale |
| **Shared / adjacent** | Dependências owned em outro lugar; o que este projeto ainda deve documentar na boundary |
| **Environments** | Quais de prod / non-prod / local / CI estão cobertos |
| **Assumptions** | Premissas de trust que limitam a análise (marque certainty) |

## In Scope (orientação)

Itens tipicamente in-scope quando existem para o projeto:

- Runtime services e jobs que o time owns
- Dados que o sistema armazena ou processa (por classification — veja [security-classification.md](security-classification.md))
- Interfaces external-facing e internas com expectativas de authn/authz
- Secrets e keys **por nome/referência**, nunca por valor
- Caminhos de acesso privilegiado e de operador
- Caminhos de build/deploy que podem mudar comportamento de produção (quando materiais)

Documente apenas o que é real. Marque **Not Applicable** quando uma categoria não existe.

## Out of Scope (orientação)

Exemplos válidos de out-of-scope (adapte; não invente):

- Plataformas ou produtos owned por outro time, além da integration boundary
- Segurança física de facilities (a menos que o projeto realmente as owne)
- Ownership de programa legal/compliance fora dos docs de engineering
- Sistemas futuros especulativos marcados Proposed em outro lugar

Fora do escopo **não** é desculpa para esconder dependências Critical. Para sistemas compartilhados, documente o **boundary contract** e o residual risk — veja [operational-dependencies.md](operational-dependencies.md) e [contract-model.md](contract-model.md).

## Inventário sugerido

| Item | In / Out / Shared | Rationale | Owner | Classification |
| --- | --- | --- | --- | --- |
| | | | | Confirmed / Inferred / Unknown |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Lista curta in/out amarrada à system boundary |
| Medium | Environments + shared dependencies destacados |
| Large | Tabela de inventário; escopos explícitos de admin/CI/data-plane |

## Anti-Patterns

- Afirmar que “tudo” está in scope sem inventário.
- Deixar terceiros Critical out of scope sem nota de boundary.
- Tratar out of scope como “não nos importamos com o risk.”
- Inventar escopo regulatório que o projeto não definiu.

## Documentos relacionados

- [security-model.md](security-model.md)
- [system-boundaries.md](system-boundaries.md)
- [security-ownership.md](security-ownership.md)
- [security-assets.md](security-assets.md)
- [attack-surface.md](attack-surface.md)
- [architecture-model.md](architecture-model.md)
