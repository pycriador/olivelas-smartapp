# Arquitetura de Segurança

> Language: pt-BR | [English](../en/security-architecture.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar a **visão de segurança da arquitetura** — o que deve ser protegido, onde a confiança muda e quais classes de control se aplicam — sem duplicar diagramas de arquitetura ou catálogos de components.

Docs de arquitetura own estrutura e diagramas ([architecture-model.md](architecture-model.md), [architecture-diagrams.md](architecture-diagrams.md)). Segurança architecture **referencia** esses docs e adiciona a lente de segurança.

## Lentes (documente o que se aplica)

| Lens | Question | Prefer linking |
| --- | --- | --- |
| **Trust Boundaries** | Onde a confiança muda e o que governa o crossing | [trust-boundaries.md](trust-boundaries.md) |
| **Identity** | Como principals são estabelecidos | [identity.md](identity.md), [authentication.md](authentication.md) |
| **Access** | O que principals podem fazer | [authorization.md](authorization.md), [least-privilege.md](least-privilege.md), [privileged-access.md](privileged-access.md) |
| **Data Flow** | Onde dados sensíveis se movem e como são protegidos | Docs de data-flow de arquitetura, [data-security.md](data-security.md), [encryption.md](encryption.md) |
| **Controls** | Quais medidas preventive/detective/corrective/compensating ficam onde | [security-controls.md](security-controls.md) |
| **Exposure** | O que é exposed, internal, restricted ou unknown | [attack-surface.md](attack-surface.md) |
| **Dependencies** | Deps externas e internas trusted/untrusted | [dependency-security.md](dependency-security.md), [supply-chain-security.md](supply-chain-security.md) |

## Como escrever docs de Segurança Arquitetura

1. Linke o overview / context / component docs canônicos de arquitetura.
2. Liste trust boundaries materiais com resumos de control class (não matrizes completas de auth).
3. Resuma padrões de identity e access; linke matrizes detalhadas a docs de segurança ou contract.
4. Aponte diagramas de data-flow para caminhos sensíveis; adicione notas de classification e proteção.
5. Inventarie placement de controls em edges e planos privilegiados.
6. Resuma exposure e dependências de alto risk.
7. Marque Unknown / Not Defined com honestidade.

**Não** redesenhe os mesmos diagramas Mermaid “para segurança” a menos que a visão security-specific adicione informação (por exemplo, anotar trust zones). Prefira referências.

## Arquitetura Boundary vs Trust Boundary vs Controls

| Concept | Owns | Doc home |
| --- | --- | --- |
| Arquitetura / system boundary | O que está dentro do sistema sob documentação | [system-boundaries.md](system-boundaries.md) |
| Trust boundary | Onde o nível de confiança muda | [trust-boundaries.md](trust-boundaries.md) |
| Segurança control | Mecanismo que enforce requirements / reduz risk | [security-controls.md](security-controls.md) |

Veja também a distinção em [trust-boundaries.md](trust-boundaries.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Edge trust boundary + resumo de authn/authz + regra de secrets |
| Medium | Trust map linkado à arquitetura; data flows sensíveis; planos de privilege |
| Large | Lentes completas acima com inventário de controls e notas de trust de dependency |

## Anti-Patterns

- Duplicar listas de components e sequence diagrams por atacado.
- Inventar modelos de zoning empresarial para uma única library interna.
- Afirmar controls que existem só como design Proposed.
- Embutir secrets, private keys ou ACLs de rede completas com credentials.

## Documentos relacionados

- [security-model.md](security-model.md)
- [threat-modeling.md](threat-modeling.md)
- [architecture-model.md](architecture-model.md)
- [failure-domains.md](failure-domains.md)
- [contract-security.md](contract-security.md)
- [templates/security.md](templates/security.md)
