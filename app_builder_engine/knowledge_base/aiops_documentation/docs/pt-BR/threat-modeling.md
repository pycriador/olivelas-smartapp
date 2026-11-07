# Modelo de ameaçasing

> Language: pt-BR | [English](../en/threat-modeling.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **threats contra assets** de forma agnóstica de tecnologia.

Threat modeling é uma forma estruturada de responder: o que pode dar errado, quão grave é e o que fazemos a respeito? Frameworks como STRIDE, LINDDUN ou attack trees são **auxílios opcionais**, não requisitos deste padrão.

## Propósito

Produzir um modelo maintível que conecte:

```text
System → Assets → Trust Boundaries → Threats → Risk → Mitigations
```

Outputs alimentam [security-requirements.md](security-requirements.md), [security-controls.md](security-controls.md) e [security-risk-model.md](security-risk-model.md).

## Fluxo recomendado

| Step | Question | Inputs |
| --- | --- | --- |
| **1. System** | O que está in scope? | [security-scope.md](security-scope.md), [system-boundaries.md](system-boundaries.md), overview de arquitetura |
| **2. Assets** | O que devemos proteger? | [security-assets.md](security-assets.md) |
| **3. Trust boundaries** | Onde a confiança muda? | [trust-boundaries.md](trust-boundaries.md), [attack-surface.md](attack-surface.md) |
| **4. Threats** | Quais ações adversas importam? | [threat-actors.md](threat-actors.md), prompts opcionais estilo STRIDE |
| **5. Risk** | Quão grave, quão provável, residual? | [security-risk-model.md](security-risk-model.md) |
| **6. Mitigations** | Requirements e controls | [security-requirements.md](security-requirements.md), [security-controls.md](security-controls.md) |

Revise quando arquitetura, contratos ou exposure mudarem de forma material — ou na cadência de review que o projeto definir. Marque a cadência **Not Defined** quando nenhuma existir.

## Técnicas opcionais de prompt

Use apenas se forem úteis; não force uma matriz completa para uma ferramenta interna pequena.

| Technique | Use |
| --- | --- |
| **STRIDE-style prompts** | Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege — como perguntas, não categorias obrigatórias |
| **Data-flow review** | Siga assets sensíveis across [trust-boundaries.md](trust-boundaries.md) |
| **Abuse cases** | Inverta use cases primários para fluxos críticos |
| **Dependency focus** | Threats via dependências Critical — [operational-dependencies.md](operational-dependencies.md) |

## Registro sugerido de threat

| Campo | Significado |
| --- | --- |
| **ID** | Id curto e estável |
| **Threat** | Descrição concisa do cenário adverso |
| **Actor** | Categoria ou actor específico se conhecido — [threat-actors.md](threat-actors.md) |
| **Asset** | Id/nome do asset |
| **Boundary / surface** | Onde se aplica |
| **Vulnerability** | Fraqueza se conhecida; senão Unknown |
| **Risk summary** | Likelihood/impact/severity/residual conforme modelo do projeto |
| **Mitigations** | Requirements/controls (links) |
| **Status** | open / accepted / mitigated / Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| ID | Threat | Actor | Asset | Boundary | Risk | Mitigations | Status | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

## Integração com arquitetura

- Comece de diagramas de contexto/sistema existentes; não redesenhe toda a arquitetura para cada threat.
- Mostre trust zones quando esclarecerem crossings; mantenha diagramas legíveis — [architecture-diagrams.md](architecture-diagrams.md).
- Linke failure domains quando uma threat for principalmente availability/resilience — [failure-domains.md](failure-domains.md).
- Catálogos profundos de controls pertencem a docs de segurança, não a overviews de arquitetura — [trust-boundaries.md](trust-boundaries.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Threats narrativos para o edge principal e o data store principal |
| Medium | Inventário para caminhos críticos + residual risks |
| Large | Registros estruturados, histórico de review, linkage a exceptions e incidents |

## Anti-Patterns

- Produzir checklist de framework sem threats específicos do projeto.
- Listar mitigations que não existem como se fossem Confirmed.
- Ignorar caminhos privilegiados e de CI/CD.
- Inventar threats dirigidos por compliance sem evidência.

## Documentos relacionados

- [security-model.md](security-model.md)
- [threat-actors.md](threat-actors.md)
- [attack-surface.md](attack-surface.md)
- [trust-boundaries.md](trust-boundaries.md)
- [security-risk-model.md](security-risk-model.md)
- [security-architecture.md](security-architecture.md)
