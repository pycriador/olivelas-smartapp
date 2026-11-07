# Criticidade

> Language: pt-BR | [English](../en/criticality.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar quão importante uma capacidade, dependência ou failure mode é para o negócio e para os operadores.

Este padrão **não classifica automaticamente**. Humanos (ou uma política explícita do projeto) atribuem criticality. Não invente rótulos Critical só a partir de convenções de nome.

## Escala de exemplo

Projetos **podem** usar Critical / High / Medium / Low. **Podem** usar outra escala (P0–P3, Tier 1–3, Gold/Silver/Bronze). Documente a escala uma vez e use-a de forma consistente.

| Level (example) | Meaning (example) |
| --- | --- |
| **Critical** | Outage ou degradação severa é inaceitável para resultados de negócio centrais; resposta imediata esperada |
| **High** | Impacto significativo em usuários ou receita; resposta rápida esperada |
| **Medium** | Impacto limitado ou com workaround; resposta planejada aceitável |
| **Low** | Impacto menor ou só interno; best-effort |

Se o projeto não tem modelo de criticality, escreva **Not Defined** e evite implicar um sistema de tiers em outros docs.

## Fatores a considerar (orientação)

Use como checklist de *inputs* — não como fórmula automática de pontuação:

| Factor | Question |
| --- | --- |
| User impact | Quantos usuários / quais jornadas quebram? |
| Business impact | Receita, legal, segurança, marca? |
| Data impact | Perda, corrupção, exposição de privacidade? |
| Blast radius | Um tenant, uma região, plataforma inteira? |
| Recoverability | Quão difícil / quanto tempo para restaurar? |
| Detectability | Perceberíamos rapidamente? |
| Workarounds | Há caminho manual ou alternativo seguro? |
| Dependency fan-out | Quantos sistemas falham se este falhar? |

Registre o **rationale** brevemente quando o nível não for óbvio.

## O que classificar

Aplique criticality (quando útil) a:

- services / capabilities;
- dependencies ([dependency-reliability.md](dependency-reliability.md));
- failure modes ([failure-modes.md](failure-modes.md));
- alerts e incidents (frequentemente via [incident-severity.md](incident-severity.md) — relacionados, mas não idênticos).

A criticality de um *componente* e a severity de um *incidente* podem diferir (um serviço Critical pode ter um glitch parcial de Low severity).

## Forma de documentação

| Item | Criticality | Rationale | Classification |
| --- | --- | --- | --- |
| | Critical / High / Medium / Low / other / Not Defined | | Confirmed / Inferred / Unknown / Proposed |

## Anti-padrões

- Rotular tudo como Critical “por precaução”.
- Usar tiers padrão de vendor sem significado no projeto.
- Mudar criticality em silêncio sem atualizar ownership, monitoring ou runbooks.

## Documentos relacionados

- [operational-ownership.md](operational-ownership.md)
- [service-levels.md](service-levels.md)
- [incident-severity.md](incident-severity.md)
- [dependency-reliability.md](dependency-reliability.md)
- [failure-domains.md](failure-domains.md)
